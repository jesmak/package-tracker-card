import { describe, expect, it, vi } from "vitest";

import {
    bothDirections,
    entities,
    formatDateTime,
    iconFor,
    isOutgoing,
    missingEntities,
    packagesOf,
    shipmentOf,
    sortPackages,
    withDirection,
} from "../src/packages";
import type { HomeAssistant } from "../src/hass";
import type { Shipment } from "../src/types";

function shipment(values: Partial<Shipment> = {}): Shipment {
    return {
        shipment_number: "JJFI1",
        shipment_date: "2026-09-13T16:58:24Z",
        status: 1,
        latest_event_date: "2026-09-13T16:58:24Z",
        ...values,
    };
}

function hass(states: Record<string, unknown[] | undefined>): HomeAssistant {
    return {
        states: Object.fromEntries(
            Object.entries(states).map(([id, packages]) => [
                id,
                { entity_id: id, state: "ok", last_changed: "", attributes: packages ? { packages } : {} },
            ]),
        ),
    };
}

describe("the sensors the card was given", () => {
    it("can be one or several", () => {
        expect(entities("sensor.a")).toEqual(["sensor.a"]);
        expect(entities(["sensor.a", "sensor.b"])).toEqual(["sensor.a", "sensor.b"]);
    });

    it("are gathered into one list of packages", () => {
        const state = hass({ "sensor.a": [shipment()], "sensor.b": [shipment({ shipment_number: "MH2" })] });
        expect(packagesOf(state, ["sensor.a", "sensor.b"]).map((item) => item.shipment_number)).toEqual(["JJFI1", "MH2"]);
    });

    it("are passed over when one of them is missing, instead of throwing", () => {
        const state = hass({ "sensor.a": [shipment()] });
        expect(packagesOf(state, ["sensor.a", "sensor.gone"])).toHaveLength(1);
        expect(missingEntities(state, ["sensor.a", "sensor.gone"])).toEqual(["sensor.gone"]);
    });

    it("are passed over when a sensor carries no packages at all", () => {
        expect(packagesOf(hass({ "sensor.a": undefined }), "sensor.a")).toEqual([]);
    });
});

describe("what a sensor writes", () => {
    it("leaves out entries that are no packages, and keeps the rest", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const state = hass({ "sensor.a": [null, "JJFI2", [], { status: 1 }, { shipment_number: "" }, shipment()] });
        expect(packagesOf(state, "sensor.a").map((item) => item.shipment_number)).toEqual(["JJFI1"]);
        expect(warn).toHaveBeenCalledOnce();
        warn.mockRestore();
    });

    it("drops fields of the wrong type instead of passing them on", () => {
        const item = shipmentOf({
            shipment_number: "JJFI1",
            status: 5,
            origin: 42,
            weight: "heavy",
            pickup_point: { name: "Example Kiosk", city: 53100 },
        });
        expect(item?.origin).toBeUndefined();
        expect(item?.weight).toBeUndefined();
        expect(item?.pickup_point).toEqual({ name: "Example Kiosk", compartment: undefined });
    });

    it("takes a code and a door written as numbers as text", () => {
        const item = shipmentOf({ shipment_number: "JJFI1", status: 5, pickup_code: 1234, pickup_point: { compartment: 17 } });
        expect(item?.pickup_code).toBe("1234");
        expect(item?.pickup_point?.compartment).toBe("17");
    });

    it("takes what a QR code holds as text, and leaves out an empty one", () => {
        expect(shipmentOf({ shipment_number: "JJFI1", status: 5, pickup_qr: 582917 })?.pickup_qr).toBe("582917");
        expect(shipmentOf({ shipment_number: "JJFI1", status: 5, pickup_qr: "" })?.pickup_qr).toBeUndefined();
    });

    it.each([
        ["a status written as text", "0", 0],
        ["a status the card doesn't know", 9, 7],
        ["a status that isn't a whole number", 2.5, 7],
        ["text that isn't a number", "delivered", 7],
    ])("reads %s", (_what, status, expected) => {
        expect(shipmentOf({ shipment_number: "JJFI1", status })?.status).toBe(expected);
    });

    it.each([undefined, null, ""])("leaves out an entry whose status is %s, like one without a number", (status) => {
        expect(shipmentOf({ shipment_number: "JJFI1", status })).toBeUndefined();
    });

    it("lists a package that two sensors both carry once, as the one that moved last", () => {
        const older = shipment({ latest_event: "In transit", latest_event_date: "2026-09-13T10:00:00Z" });
        const newer = shipment({ latest_event: "Ready for pickup", latest_event_date: "2026-09-14T10:00:00Z" });
        // The newer copy comes first, so keeping whichever sensor was read last would fail.
        const listed = packagesOf(hass({ "sensor.a": [newer], "sensor.b": [older] }), ["sensor.a", "sensor.b"]);
        expect(listed.map((item) => item.latest_event)).toEqual(["Ready for pickup"]);
    });
});

describe("the order packages are listed in", () => {
    it("puts packages still on their way before delivered ones", () => {
        const packages = [
            shipment({ shipment_number: "delivered", status: 0, latest_event_date: "2026-09-14T10:00:00Z" }),
            shipment({ shipment_number: "moving", status: 3, latest_event_date: "2026-09-10T10:00:00Z" }),
        ];
        expect(sortPackages(packages).map((item) => item.shipment_number)).toEqual(["moving", "delivered"]);
    });

    it("puts the most recently moved first within each group", () => {
        const packages = [
            shipment({ shipment_number: "older", status: 3, latest_event_date: "2026-09-10T10:00:00Z" }),
            shipment({ shipment_number: "newer", status: 2, latest_event_date: "2026-09-14T10:00:00Z" }),
        ];
        expect(sortPackages(packages).map((item) => item.shipment_number)).toEqual(["newer", "older"]);
    });

    it("copes with a package that has no date yet", () => {
        const packages = [
            shipment({ shipment_number: "dated", status: 3, latest_event_date: "2026-09-10T10:00:00Z" }),
            shipment({ shipment_number: "undated", status: 3, latest_event_date: null }),
        ];
        expect(sortPackages(packages).map((item) => item.shipment_number)).toEqual(["dated", "undated"]);
    });

    it("leaves the given list alone", () => {
        const packages = [shipment({ status: 0 }), shipment({ shipment_number: "b", status: 3 })];
        sortPackages(packages);
        expect(packages[0].status).toBe(0);
    });
});

describe("the icon of a status", () => {
    it("is the one of that status", () => {
        expect(iconFor(0)).toBe("mdi:checkbox-marked");
        expect(iconFor(3)).toBe("mdi:truck-delivery");
    });

    it("is a question mark for a status the card does not know", () => {
        expect(iconFor(42)).toBe("mdi:help-circle");
    });
});

describe("dates", () => {
    it("are written as the card has always written them", () => {
        const written = formatDateTime("2026-09-13T16:58:24Z");
        expect(written).toMatch(/^2026-09-\d\d \d\d:\d\d$/);
    });

    it("are left out when there is no date", () => {
        expect(formatDateTime(null)).toBe("");
        expect(formatDateTime(undefined)).toBe("");
        expect(formatDateTime("not a date")).toBe("");
    });

    it("keep a date without a time as the day it is, not midnight in UTC", () => {
        expect(formatDateTime("2026-10-15")).toBe("2026-10-15");
        expect(formatDateTime("2026-13-45")).toBe("");
        expect(formatDateTime("2026-02-30")).toBe("");
    });
});

describe("which way a package goes", () => {
    const sent = { shipment_number: "JJFI1", status: 3, direction: "outgoing" } as Shipment;
    const coming = { shipment_number: "JJFI2", status: 3, direction: "incoming" } as Shipment;
    const unknown = { shipment_number: "JJFI3", status: 3 } as Shipment;

    it("is read from the sensor as text, and left out when it is something else", () => {
        expect(shipmentOf({ shipment_number: "JJFI1", status: 3, direction: "outgoing" })?.direction).toBe("outgoing");
        expect(shipmentOf({ shipment_number: "JJFI1", status: 3, direction: 1 })?.direction).toBeUndefined();
    });

    it("is outgoing only when the integration says so, in any case", () => {
        expect([sent, coming, unknown].map(isOutgoing)).toEqual([true, false, false]);
        expect(isOutgoing({ ...sent, direction: "OUTGOING" })).toBe(true);
    });

    it("filters the packages, and all of them when no way is chosen", () => {
        const all = [sent, coming, unknown];
        expect(withDirection(all, "outgoing")).toEqual([sent]);
        expect(withDirection(all, "incoming")).toEqual([coming, unknown]);
        expect(withDirection(all, "all")).toEqual(all);
        expect(withDirection(all, undefined)).toEqual(all);
    });

    it("tells when a list holds both ways", () => {
        expect(bothDirections([sent, unknown])).toBe(true);
        expect(bothDirections([coming, unknown])).toBe(false);
        expect(bothDirections([sent])).toBe(false);
        expect(bothDirections([])).toBe(false);
    });
});
