import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import { trackingEntities } from "../src/editor";
import type { PackageTrackerCardEditor } from "../src/editor";
import type { HomeAssistant } from "../src/hass";
import type { PackageTrackerCardConfig } from "../src/types";

const hass: HomeAssistant = {
    locale: { language: "fi" },
    states: {
        "sensor.posti_omaposti": {
            entity_id: "sensor.posti_omaposti",
            state: "2026-09-16T08:00:00+00:00",
            last_changed: "2026-09-16",
            attributes: { packages: [] },
        },
        "sensor.matkahuolto_account": {
            entity_id: "sensor.matkahuolto_account",
            state: "2026-09-16T08:00:00+00:00",
            last_changed: "2026-09-16",
            attributes: { packages: [] },
        },
        "sensor.kitchen": {
            entity_id: "sensor.kitchen",
            state: "21",
            last_changed: "2026-09-16",
            attributes: {},
        },
    },
};

async function editor(config: Partial<PackageTrackerCardConfig> = {}): Promise<PackageTrackerCardEditor> {
    const element = document.createElement("package-tracker-card-editor") as PackageTrackerCardEditor;
    element.setConfig({
        type: "custom:package-tracker-card",
        entity: ["sensor.posti_omaposti"],
        ...config,
    } as never);
    element.hass = hass;
    document.body.append(element);
    await element.updateComplete;
    return element;
}

function form(element: PackageTrackerCardEditor): HTMLElement & { schema: Array<Record<string, unknown>>; data: Record<string, unknown> } {
    const found = element.shadowRoot?.querySelector("ha-form");
    if (!found) {
        throw new Error("the editor rendered no form");
    }
    return found as HTMLElement & { schema: Array<Record<string, unknown>>; data: Record<string, unknown> };
}

function changesOf(element: PackageTrackerCardEditor): PackageTrackerCardConfig[] {
    const changes: PackageTrackerCardConfig[] = [];
    element.addEventListener("config-changed", (event) => {
        changes.push((event as CustomEvent<{ config: PackageTrackerCardConfig }>).detail.config);
    });
    return changes;
}

beforeEach(() => {
    document.body.innerHTML = "";
});

describe("the visual editor", () => {
    it("offers the sensors that carry packages, whatever they are called", () => {
        expect(trackingEntities(hass)).toEqual(["sensor.matkahuolto_account", "sensor.posti_omaposti"]);
    });

    it("asks for the sensors, a title, the sizes and the lines", async () => {
        const schema = form(await editor()).schema;
        expect(schema[0].name).toBe("entity");
        expect(schema[1].name).toBe("title");
        const names = schema.flatMap((entry) =>
            Array.isArray(entry.schema) ? (entry.schema as Array<{ name: string }>).map((inner) => inner.name) : [entry.name],
        );
        // The height mode is set in YAML only, as the layout tab sets the card's height in a sections view.
        expect(names).not.toContain("height_mode");
        expect(names).not.toContain("height");
        expect(names).not.toContain("max_height");
        // Every other option in the README's table is in the editor.
        const readme = readFileSync(join(process.cwd(), "README.md"), "utf8");
        const table = readme.slice(readme.indexOf("## Options"), readme.indexOf("\n## ", readme.indexOf("## Options") + 1));
        const options = [...table.matchAll(/^\| `([a-z_]+)`/gm)].map((match) => match[1]);
        const yamlOnly = ["type", "height_mode", "height", "max_height"];
        expect([...new Set(names)].sort()).toEqual(options.filter((option) => !yamlOnly.includes(option)).sort());
    });

    it.each([
        ["no height", {}, true],
        ["a fixed height", { height: 300 }, false],
        ["a maximum height", { max_height: 400 }, true],
    ])("offers the rounding to rows with %s only when the card isn't held to a fixed height", async (_name, config, offered) => {
        const names = form(await editor(config)).schema.map((entry) => entry.name);
        expect(names.includes("row_step")).toBe(offered);
    });

    it("shows every status chosen when the configuration names none", async () => {
        expect(form(await editor()).data.statuses).toEqual(["1", "2", "3", "4", "5", "0", "6", "7"]);
        expect(form(await editor({ statuses: [5] })).data.statuses).toEqual(["5"]);
    });

    it.each([
        ["some of them, as numbers in the order a package goes", ["0", "5"], [5, 0]],
        ["all of them, as no setting", ["1", "2", "3", "4", "5", "0", "6", "7"], undefined],
        ["none of them, as no setting", [], undefined],
    ])("saves %s", async (_what, chosen, saved) => {
        const element = await editor();
        const changes = changesOf(element);
        form(element).dispatchEvent(
            new CustomEvent("value-changed", {
                detail: { value: { type: "custom:package-tracker-card", entity: ["sensor.posti_omaposti"], statuses: chosen } },
            }),
        );
        expect(changes[0].statuses).toEqual(saved);
        expect("statuses" in changes[0]).toBe(saved !== undefined);
    });

    it("shows an old name in the title field, so the next save writes it as the title", async () => {
        const data = form(await editor({ name: "Paketit" })).data;
        expect(data.title).toBe("Paketit");
        expect(data.name).toBeUndefined();
    });

    it("offers a limit for each direction", async () => {
        const names = JSON.stringify(form(await editor()).schema);
        expect(names).toContain('"name":"max_events"');
        expect(names).toContain('"name":"max_sent_events"');
    });

    it("shows one sensor as a list, the way the picker works", async () => {
        expect(form(await editor({ entity: "sensor.posti_omaposti" })).data.entity).toEqual(["sensor.posti_omaposti"]);
    });

    it.each<[string, Record<string, unknown>, Record<string, unknown>]>([
        ["no heights", {}, {}],
        ["a fixed height set in YAML, kept as it is", { height_mode: "fixed", height: 300 }, { height_mode: "fixed", height: 300 }],
        ["a maximum height set in YAML, kept as it is", { max_height: 300 }, { max_height: 300 }],
    ])("keeps the defaults and the empty fields out of the configuration, with %s", async (_name, heights, saved) => {
        const element = await editor();
        const changes = changesOf(element);
        form(element).dispatchEvent(
            new CustomEvent("value-changed", {
                detail: {
                    value: {
                        type: "custom:package-tracker-card",
                        entity: ["sensor.posti_omaposti"],
                        title: "",
                        max_events: "",
                        max_sent_events: null,
                        show_progress: true,
                        show_origin: false,
                        ...heights,
                    },
                },
            }),
        );
        expect(changes[0]).toEqual({
            type: "custom:package-tracker-card",
            entity: ["sensor.posti_omaposti"],
            show_origin: false,
            ...saved,
        });
    });

    it("keeps the pickup defaults out, and a chosen code setting in", async () => {
        const element = await editor();
        const changes = changesOf(element);
        form(element).dispatchEvent(
            new CustomEvent("value-changed", {
                detail: {
                    value: {
                        type: "custom:package-tracker-card",
                        entity: ["sensor.posti_omaposti"],
                        show_pickup: true,
                        show_details: false,
                        pickup_code: "toggle",
                        tracking_link: "row",
                    },
                },
            }),
        );
        expect(changes[0]).toEqual({
            type: "custom:package-tracker-card",
            entity: ["sensor.posti_omaposti"],
            pickup_code: "toggle",
        });
    });

    it("keeps both directions out as the default, and a chosen one in", async () => {
        const element = await editor();
        const changes = changesOf(element);
        for (const direction of ["all", "outgoing"]) {
            form(element).dispatchEvent(
                new CustomEvent("value-changed", {
                    detail: { value: { type: "custom:package-tracker-card", entity: ["sensor.posti_omaposti"], direction } },
                }),
            );
        }
        expect(changes).toEqual([
            { type: "custom:package-tracker-card", entity: ["sensor.posti_omaposti"] },
            { type: "custom:package-tracker-card", entity: ["sensor.posti_omaposti"], direction: "outgoing" },
        ]);
        expect(form(element).schema.map((entry) => entry.name)).toContain("direction");
    });
});
