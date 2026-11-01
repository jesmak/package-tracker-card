import { beforeEach, describe, expect, it, vi } from "vitest";

import { browserLanguage, translate } from "../src/localize/localize";
import "../src/package-tracker-card";
import type { PackageTrackerCard } from "../src/package-tracker-card";
import type { HomeAssistant } from "../src/hass";
import type { PackageTrackerCardConfig, Shipment } from "../src/types";

const POSTI = "sensor.posti_omaposti";
const MATKAHUOLTO = "sensor.matkahuolto";

// A package shaped like the ones posti_tracking writes, with made-up details.
const WAITING: Shipment = {
    shipment_number: "JJFI0001",
    shipment_date: "2026-09-16T08:00:00Z",
    status: 1,
    raw_status: "WAITING",
    origin: "Example Shop",
    origin_city: "HELSINKI",
    destination: "Postin automaatti",
    destination_city: "TAMPERE",
    latest_event: "Olemme saaneet lähettäjältä tiedon tulevasta lähetyksestä",
    latest_event_city: null,
    latest_event_country: "FI",
    latest_event_date: "2026-09-16T08:00:00Z",
    source: "Posti",
    tracking_url: "https://carrier.example.com/track/JJFI0001",
};

function hass(packages: Record<string, Shipment[]> = { [POSTI]: [WAITING], [MATKAHUOLTO]: [] }): HomeAssistant {
    return {
        locale: { language: "fi" },
        states: Object.fromEntries(
            Object.entries(packages).map(([id, list]) => [
                id,
                {
                    entity_id: id,
                    state: "2026-09-16T08:00:00+00:00",
                    last_changed: "2026-09-16",
                    attributes: { packages: list },
                },
            ]),
        ),
    };
}

async function card(state: HomeAssistant, config: Partial<PackageTrackerCardConfig> = {}, layout?: string): Promise<PackageTrackerCard> {
    const element = document.createElement("package-tracker-card") as PackageTrackerCard;
    element.layout = layout;
    element.setConfig({
        type: "custom:package-tracker-card",
        entity: [POSTI, MATKAHUOLTO],
        ...config,
    } as never);
    element.hass = state;
    document.body.append(element);
    await element.updateComplete;
    return element;
}

function shadow(element: PackageTrackerCard): ShadowRoot {
    const root = element.shadowRoot;
    if (!root) {
        throw new Error("the card rendered nothing");
    }
    return root;
}

beforeEach(() => {
    document.body.innerHTML = "";
});

describe("the card's height", () => {
    it.each([
        ["its content", undefined, {}, ""],
        ["a fixed height", undefined, { height: 300 }, "height: 300px"],
        ["a maximum height", undefined, { max_height: 400 }, "max-height: 400px"],
        [
            "the mode chosen over the heights it has",
            undefined,
            { height_mode: "max" as const, height: 300, max_height: 400 },
            "max-height: 400px",
        ],
        ["grid rows in a sections view", "grid", { height: 300, grid_options: { rows: 6 } }, "height: 100%"],
        ["the mode when the grid rows are automatic", "grid", { height: 300, grid_options: { rows: "auto" } }, "height: 300px"],
    ])("sizes itself by %s", async (_name, layout, extra, style) => {
        const element = await card(hass(), extra, layout);
        expect(shadow(element).querySelector("ha-card")?.getAttribute("style") ?? "").toBe(style);
    });

    const ONLY_NUMBER = {
        show_progress: false,
        show_latest_event: false,
        show_latest_event_message: false,
        show_latest_event_location: false,
        show_origin: false,
        show_destination: false,
        show_pickup: false,
    };

    // 26 for the card's edges, 41 for the title, 12 for the package's padding, its number's line, its progress line with
    // 6 around it, and 16 a line, by the class of the width of the card's content.
    it.each<[string, Record<string, unknown>, number | undefined, number, number]>([
        ["the default config on a whole section", {}, undefined, 162, 3],
        ["a title on a whole section", { title: "Paketit" }, undefined, 203, 4],
        ["the details line on a whole section", { show_details: true }, undefined, 178, 3],
        ["the status without the bar on a whole section", { show_progress: false }, undefined, 158, 3],
        ["neither the bar nor the status on a whole section", { show_progress: false, show_latest_event: false }, undefined, 134, 3],
        ["only the package's number on a whole section", ONLY_NUMBER, undefined, 70, 2],
        ["the default config on 11 columns", { grid_options: { columns: 11 } }, undefined, 197, 4],
        ["a title on 9 columns", { title: "Paketit", grid_options: { columns: 9 } }, undefined, 238, 4],
        ["the bar without the status on 9 columns", { show_latest_event: false, grid_options: { columns: 9 } }, undefined, 175, 3],
        ["the older layout options' columns", { layout_options: { grid_columns: 3 } }, undefined, 197, 4],
        ["the default config measured 240 px wide", {}, 264, 197, 4],
        ["the default config measured 171 px wide", {}, 195, 197, 4],
        ["the default config measured 170 px wide", {}, 194, 242, 4],
        ["a title measured 150 px wide", { title: "Paketit" }, 174, 283, 5],
        ["one way measured 150 px wide", { direction: "incoming" }, 174, 225, 4],
        ["the status without the bar measured 150 px wide", { show_progress: false }, 174, 232, 4],
        ["the bar without the status measured 150 px wide", { show_latest_event: false }, 174, 208, 4],
        ["one way on a whole section", { direction: "incoming" }, undefined, 162, 3],
        ["one way on 9 columns", { direction: "incoming", grid_options: { columns: 9 } }, undefined, 197, 4],
        ["the status without the bar on 9 columns", { show_progress: false, grid_options: { columns: 9 } }, undefined, 187, 4],
        ["nine columns measured wider than they promise, which counts the columns", { grid_options: { columns: 9 } }, 400, 197, 4],
    ])("is never held lower than the title and one whole package need, with %s", async (_name, extra, width, minimum, rows) => {
        const element = await card(hass(), { ...extra, height: 50 } as Partial<PackageTrackerCardConfig>);
        if (width) {
            measured(element, width);
            await element.updateComplete;
        }
        expect(element.getGridOptions()).toMatchObject({ rows: "auto", min_columns: 9, min_rows: rows });
        expect(shadow(element).querySelector("ha-card")?.getAttribute("style")).toBe(`height: ${minimum}px`);
    });

    // The last line is the destination's, or the pickup code's when the message line doesn't carry the code: it is there
    // whenever the configuration lets either show, so the minimum counts it then. 98 px for the card without its lines.
    it.each<[string, boolean, boolean, boolean, "hidden" | "always" | "toggle", number]>([
        ["the message and the destination", true, true, true, "hidden", 130],
        ["the message alone", true, false, false, "hidden", 114],
        ["the message carrying the code", true, false, false, "always", 114],
        ["the message carrying the code shown when clicked", true, false, false, "toggle", 114],
        ["the destination alone", false, true, true, "hidden", 114],
        ["the pickup deadline alone", false, false, true, "hidden", 114],
        ["the place alone", false, true, false, "hidden", 114],
        ["neither", false, false, false, "hidden", 98],
        ["only the code, always shown", false, false, false, "always", 114],
        ["only the code, shown when clicked", false, false, false, "toggle", 114],
        ["the destination carrying the code", false, true, true, "always", 114],
    ])("counts the destination line with %s", async (_name, message, place, time, code, minimum) => {
        const element = await card(hass(), {
            height: 50,
            show_latest_event_location: false,
            show_origin: false,
            show_latest_event_message: message,
            show_destination: place,
            show_pickup: time,
            pickup_code: code,
        });
        expect(shadow(element).querySelector("ha-card")?.getAttribute("style")).toBe(`height: ${minimum}px`);
    });

    /**
     * Lays the card out with a clientWidth of `width`, 12 px of padding a side, so its content is `width` − 24 px wide, and
     * measures it.
     */
    function measured(element: PackageTrackerCard, width: number): void {
        const haCard = shadow(element).querySelector("ha-card") as HTMLElement;
        Object.defineProperty(haCard, "clientWidth", { value: width, configurable: true });
        vi.spyOn(window, "getComputedStyle").mockReturnValue({ paddingLeft: "12px", paddingRight: "12px" } as CSSStyleDeclaration);
        (element as unknown as { measureWidth(): void }).measureWidth();
        vi.restoreAllMocks();
    }

    it("keeps the title to one line, with the whole of it as a tooltip, only while held", async () => {
        const held = shadow(await card(hass(), { title: "Paketit", height: 300 }));
        expect(held.querySelector("ha-card")?.classList.contains("held")).toBe(true);
        expect(held.querySelector(".header")?.getAttribute("title")).toBe("Paketit");
        const free = shadow(await card(hass(), { title: "Paketit" }));
        expect(free.querySelector("ha-card")?.classList.contains("held")).toBe(false);
        expect(free.querySelector(".header")?.hasAttribute("title")).toBe(false);
    });

    /** Lays the card out with its top at 0 and its last part ending at `bottom`, and fills its rows. */
    async function filledRows(element: PackageTrackerCard, bottom: number): Promise<string> {
        const root = shadow(element);
        const haCard = root.querySelector("ha-card") as HTMLElement;
        Object.defineProperty(haCard, "clientWidth", { value: 460, configurable: true });
        haCard.getBoundingClientRect = () => ({ top: 0 }) as DOMRect;
        const last = (root.querySelector(".list")?.lastElementChild ?? root.querySelector(".message")) as HTMLElement;
        last.getBoundingClientRect = () => ({ bottom }) as DOMRect;
        vi.spyOn(window, "getComputedStyle").mockReturnValue({ paddingBottom: "12px", borderBottomWidth: "1px" } as CSSStyleDeclaration);
        (element as unknown as { fillRows(): void }).fillRows();
        vi.restoreAllMocks();
        await element.updateComplete;
        return haCard.getAttribute("style") ?? "";
    }

    // A card is 64k − 8 px tall on k rows: its last part's end, its bottom padding and its border, rounded up.
    it.each<[string, string | undefined, Record<string, unknown>, number, string]>([
        ["to the next row", "grid", {}, 150, "min-height: 184px"],
        ["staying on a row it ends on", "grid", {}, 171, "min-height: 184px"],
        ["not outside a sections view", undefined, {}, 150, ""],
        ["not when held to a height", "grid", { height: 300 }, 150, "height: 300px"],
        ["not when held by rows", "grid", { grid_options: { rows: 6 } }, 150, "height: 100%"],
    ])("ends on a whole row %s", async (_name, layout, extra, bottom, style) => {
        expect(await filledRows(await card(hass(), extra as Partial<PackageTrackerCardConfig>, layout), bottom)).toBe(style);
    });

    it("ends on a whole row with nothing to track, and gives back the rows its packages took", async () => {
        const element = await card(hass(), { title: "Paketit" }, "grid");
        expect(await filledRows(element, 290)).toBe("min-height: 312px");
        element.hass = hass({ [POSTI]: [], [MATKAHUOLTO]: [] });
        await element.updateComplete;
        expect(shadow(element).querySelector(".list")?.lastElementChild?.className).toBe("empty");
        expect(await filledRows(element, 90)).toBe("min-height: 120px");
    });

    it("is measured again when it comes back to the page, such as from another view", async () => {
        const watched = new Set<Element>();
        let measured = 0;
        vi.stubGlobal(
            "ResizeObserver",
            class {
                observe(target: Element) {
                    watched.add(target);
                }
                unobserve(target: Element) {
                    watched.delete(target);
                }
                disconnect() {
                    watched.clear();
                }
            },
        );
        vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
            measured++;
            callback(0);
            return measured;
        });
        try {
            const element = await card(hass(), {}, "grid");
            const haCard = shadow(element).querySelector("ha-card");
            expect(watched.has(haCard!)).toBe(true);
            element.remove();
            expect(watched.size).toBe(0);
            const before = measured;
            document.body.append(element);
            await element.updateComplete;
            expect(watched.has(shadow(element).querySelector("ha-card")!)).toBe(true);
            expect(measured).toBeGreaterThan(before);
        } finally {
            vi.unstubAllGlobals();
        }
    });

    it("ends on a whole row with only the message about a missing sensor", async () => {
        const element = await card(hass({}), {}, "grid");
        expect(shadow(element).querySelector(".message")).not.toBeNull();
        expect(await filledRows(element, 40)).toBe("min-height: 56px");
    });

    it("puts the title first and the packages in the list after it", async () => {
        const root = shadow(await card(hass(), { title: "Paketit", height_mode: "fixed", height: 200 }));
        expect([...(root.querySelector("ha-card")?.children ?? [])].map((child) => child.classList[0])).toEqual(["header", "list"]);
        expect([...(root.querySelector(".list")?.children ?? [])].map((child) => child.classList[0])).toEqual(["item"]);
    });

    it.each([
        ["held to a height", undefined, { height: 300 }, ["fade-bottom"]],
        ["held up to a limit", undefined, { max_height: 300 }, ["fade-bottom"]],
        ["held by rows in a sections view", "grid", { grid_options: { rows: 4 } }, ["fade-bottom"]],
        [
            "held to a height with automatic rows in a sections view",
            "grid",
            { height: 300, grid_options: { rows: "auto" } },
            ["fade-bottom"],
        ],
        ["held by the older layout options' rows in a sections view", "grid", { layout_options: { grid_rows: 4 } }, ["fade-bottom"]],
        ["never in auto", undefined, {}, []],
        ["never in auto with automatic rows in a sections view", "grid", { grid_options: { rows: "auto" } }, []],
        ["never by grid rows outside a sections view", undefined, { grid_options: { rows: 4 } }, []],
    ])("fades the bottom edge of a list that runs past it when %s", async (_name, layout, extra, expected) => {
        const element = await card(hass(), extra, layout);
        const list = shadow(element).querySelector(".list") as HTMLElement;
        Object.defineProperty(list, "scrollHeight", { value: 600, configurable: true });
        Object.defineProperty(list, "clientHeight", { value: 200, configurable: true });
        element.requestUpdate();
        await element.updateComplete;
        expect(["fade-top", "fade-bottom"].filter((name) => list.classList.contains(name))).toEqual(expected);
    });

    it("lets go of the list's fade when the card goes from held to auto, and fades it again when held again", async () => {
        const element = await card(hass(), { height: 300 });
        const list = shadow(element).querySelector(".list") as HTMLElement;
        Object.defineProperty(list, "scrollHeight", { value: 600, configurable: true });
        Object.defineProperty(list, "clientHeight", { value: 200, configurable: true });
        element.requestUpdate();
        await element.updateComplete;
        expect([...list.classList].filter((name) => name.startsWith("fade"))).toEqual(["fades", "fade-bottom"]);
        element.setConfig({ type: "custom:package-tracker-card", entity: [POSTI, MATKAHUOLTO] } as never);
        await element.updateComplete;
        expect([...list.classList].filter((name) => name.startsWith("fade"))).toEqual([]);
        element.setConfig({ type: "custom:package-tracker-card", entity: [POSTI, MATKAHUOLTO], height: 300 } as never);
        await element.updateComplete;
        expect([...list.classList].filter((name) => name.startsWith("fade"))).toEqual(["fades", "fade-bottom"]);
    });

    it("refuses a height that isn't a positive number of pixels, and an unknown height mode, with an error about the height", () => {
        const element = document.createElement("package-tracker-card") as PackageTrackerCard;
        const config = (extra: Record<string, unknown>) => ({ type: "custom:package-tracker-card", entity: POSTI, ...extra }) as never;
        const error = translate(browserLanguage(), "common.invalid_height");
        expect(error).toMatch(/^Invalid height\./);
        for (const value of ["300px", 0, -10]) {
            expect(() => element.setConfig(config({ max_height: value }))).toThrow(error);
            expect(() => element.setConfig(config({ height: value }))).toThrow(error);
        }
        expect(() => element.setConfig(config({ height_mode: "tall" }))).toThrow(error);
        // Left empty in YAML, each is unset.
        expect(() => element.setConfig(config({ height_mode: null, height: null, max_height: null }))).not.toThrow();
    });
});

describe("the list of packages", () => {
    it("shows a package with its number, status and places", async () => {
        const root = shadow(await card(hass()));
        expect(root.querySelectorAll(".item")).toHaveLength(1);
        expect(root.querySelector(".number")?.textContent).toContain("JJFI0001");
        expect(root.textContent).toContain("Odottaa");
        expect(root.textContent).toContain("Example Shop");
        expect(root.textContent).toContain("Postin automaatti");
    });

    it("gathers the packages of every sensor it was given", async () => {
        const other: Shipment = { ...WAITING, shipment_number: "MH-2", status: 3 };
        const root = shadow(await card(hass({ [POSTI]: [WAITING], [MATKAHUOLTO]: [other] })));
        expect(root.querySelectorAll(".item")).toHaveLength(2);
    });

    it("lists at most as many as max_events asks for", async () => {
        const packages = [1, 2, 3, 4].map((n) => ({ ...WAITING, shipment_number: `P${n}` }));
        const root = shadow(await card(hass({ [POSTI]: packages }), { max_events: 2 }));
        expect(root.querySelectorAll(".item")).toHaveLength(2);
    });

    it("lists only the statuses asked for, before counting them against max_events", async () => {
        const packages = [
            { ...WAITING, shipment_number: "P1", status: 5 },
            { ...WAITING, shipment_number: "P2", status: 3 },
            { ...WAITING, shipment_number: "P3", status: 5 },
            { ...WAITING, shipment_number: "P4", status: 5 },
        ];
        const root = shadow(await card(hass({ [POSTI]: packages }), { statuses: [5], max_events: 2 }));
        const numbers = [...root.querySelectorAll(".number")].map((number) => number.textContent);
        expect(numbers).toHaveLength(2);
        expect(numbers).not.toContain("P2");
    });

    it.each([
        ["statuses", { statuses: null }],
        ["tracking_link", { tracking_link: null }],
    ])("takes an empty %s as the default", async (_what, config) => {
        const root = shadow(await card(hass(), config as never));
        expect(root.querySelectorAll(".item.clickable")).toHaveLength(1);
    });

    it("lists every status when the list of them is empty", async () => {
        const root = shadow(await card(hass(), { statuses: [] }));
        expect(root.querySelectorAll(".item")).toHaveLength(1);
    });

    it("says there is nothing to track when no package has the statuses asked for", async () => {
        const root = shadow(await card(hass(), { statuses: [5] }));
        expect(root.querySelector(".no-packages")).not.toBeNull();
    });

    it("leaves out a line the configuration hides", async () => {
        const root = shadow(await card(hass(), { show_destination: false }));
        expect(root.textContent).not.toContain("Postin automaatti");
        expect(root.textContent).toContain("Example Shop");
    });

    it("leaves out a line the package has nothing for", async () => {
        // This package has no place for its latest event, and the row would be empty.
        const root = shadow(await card(hass()));
        expect(root.textContent).not.toContain("null");
        expect(root.textContent).not.toContain("undefined");
    });
});

describe("the title", () => {
    it("is taken from name, as older versions documented it, unless a title is given too", async () => {
        const old = shadow(await card(hass(), { name: "Paketit" }));
        expect(old.querySelector(".header")?.textContent).toContain("Paketit");
        const both = shadow(await card(hass(), { name: "Paketit", title: "Lähetykset" }));
        expect(both.querySelector(".header")?.textContent).toContain("Lähetykset");
    });
});

describe("when there is nothing to track", () => {
    it("says so", async () => {
        const root = shadow(await card(hass({ [POSTI]: [], [MATKAHUOLTO]: [] })));
        expect(root.querySelector(".no-packages")?.textContent).toContain("Ei seurattavia paketteja");
    });

    const NOW = Date.parse("2026-09-16T09:00:00Z");

    function sensor(id: string, state: string, attributes: Record<string, unknown>): HomeAssistant["states"][string] {
        return { entity_id: id, state, last_changed: "2026-09-16", attributes: { packages: [], ...attributes } };
    }

    it.each([
        [
            "when it last read its packages",
            sensor(POSTI, "2026-09-10T08:00:00+00:00", { friendly_name: "Posti", last_checked: "2026-09-16T08:55:00Z" }),
            "Posti · tarkistettu 5 min sitten",
            false,
        ],
        [
            "how many hours ago it last read them",
            sensor(POSTI, "unknown", { friendly_name: "Posti", last_checked: "2026-09-16T06:00:00Z" }),
            "Posti · tarkistettu 3 t sitten",
            false,
        ],
        [
            "under a minute ago as now",
            sensor(POSTI, "unknown", { friendly_name: "Posti", last_checked: "2026-09-16T08:59:30Z" }),
            "Posti · tarkistettu juuri nyt",
            false,
        ],
        ["its name alone when it doesn't tell the time", sensor(POSTI, "unknown", { friendly_name: "Posti" }), "Posti", false],
        ["its entity ID without a name", sensor(POSTI, "unknown", {}), POSTI, false],
        [
            "that it doesn't answer",
            sensor(POSTI, "unavailable", { friendly_name: "Posti", restored: true }),
            "Posti · ei käytettävissä",
            true,
        ],
        [
            "that it doesn't answer, without the time it last had",
            sensor(POSTI, "unavailable", { friendly_name: "Posti", last_checked: "2026-09-16T08:55:00Z" }),
            "Posti · ei käytettävissä",
            true,
        ],
        [
            "its name alone when the time can't be read",
            sensor(POSTI, "unknown", { friendly_name: "Posti", last_checked: "never" }),
            "Posti",
            false,
        ],
        ["that Home Assistant doesn't have it", undefined, `${POSTI} · ei käytettävissä`, true],
    ])("shows each sensor and %s", async (_name, posti, text, down) => {
        vi.useFakeTimers({ now: NOW, toFake: ["Date"] });
        try {
            const states = {
                [MATKAHUOLTO]: sensor(MATKAHUOLTO, "unknown", { friendly_name: "Matkahuolto" }),
                ...(posti ? { [POSTI]: posti } : {}),
            };
            const root = shadow(await card({ locale: { language: "fi" }, states }));
            const lines = [...root.querySelectorAll(".empty .sensor")];
            expect(lines.map((line) => line.textContent?.trim())).toEqual([text, "Matkahuolto"]);
            expect(lines[0].classList.contains("down")).toBe(down);
            expect(lines[0].querySelector("ha-icon")?.getAttribute("icon")).toBe(
                down ? "mdi:alert-circle-outline" : "mdi:check-circle-outline",
            );
        } finally {
            vi.useRealTimers();
        }
    });

    it("keeps the time current between the sensors' updates, and stops once off the page", async () => {
        vi.useFakeTimers({ now: NOW, toFake: ["Date", "setInterval", "clearInterval"] });
        try {
            const states = { [POSTI]: sensor(POSTI, "unknown", { friendly_name: "Posti", last_checked: "2026-09-16T08:59:30Z" }) };
            const element = await card({ locale: { language: "fi" }, states }, { entity: POSTI });
            const line = () => shadow(element).querySelector(".sensor")?.textContent?.trim();
            expect(line()).toBe("Posti · tarkistettu juuri nyt");
            vi.advanceTimersByTime(60_000);
            await element.updateComplete;
            expect(line()).toBe("Posti · tarkistettu 1 min sitten");
            element.remove();
            vi.advanceTimersByTime(120_000);
            await element.updateComplete;
            expect(line()).toBe("Posti · tarkistettu 1 min sitten");
            // Back on the page, such as from another view, the clock runs again.
            document.body.append(element);
            await element.updateComplete;
            expect(line()).toBe("Posti · tarkistettu 3 min sitten");
            vi.advanceTimersByTime(60_000);
            await element.updateComplete;
            expect(line()).toBe("Posti · tarkistettu 4 min sitten");
        } finally {
            vi.useRealTimers();
        }
    });

    it("names the sensors in Home Assistant's language", async () => {
        vi.useFakeTimers({ now: NOW, toFake: ["Date"] });
        try {
            const states = {
                [POSTI]: sensor(POSTI, "unknown", { friendly_name: "Posti", last_checked: "2026-09-16T08:55:00Z" }),
                [MATKAHUOLTO]: sensor(MATKAHUOLTO, "unknown", { friendly_name: "Matkahuolto", last_checked: "2026-09-16T08:59:30Z" }),
            };
            const root = shadow(await card({ locale: { language: "en" }, states }));
            expect([...root.querySelectorAll(".sensor")].map((line) => line.textContent?.trim())).toEqual([
                "Posti · checked 5 min. ago",
                "Matkahuolto · checked just now",
            ]);
        } finally {
            vi.useRealTimers();
        }
    });

    it.each([
        ["on automatic rows", {}, undefined, false],
        ["held by its own height", { height: 300 }, undefined, true],
        ["held by rows", { grid_options: { rows: 6 } }, "grid", true],
    ])("shows its icon only when held: %s", async (_name, extra, layout, icon) => {
        const root = shadow(await card(hass({ [POSTI]: [], [MATKAHUOLTO]: [] }), extra as Partial<PackageTrackerCardConfig>, layout));
        expect(root.querySelector(".empty-icon") !== null).toBe(icon);
    });
});

describe("show_sensors", () => {
    it.each([
        ["on by default, names both with nothing to list", undefined, false, ["Posti", "Matkahuolto · ei käytettävissä"]],
        ["on, names both with nothing to list", true, false, ["Posti", "Matkahuolto · ei käytettävissä"]],
        ["off, still names the one that doesn't answer", false, false, ["Matkahuolto · ei käytettävissä"]],
        ["on by default, names only the one down above packages", undefined, true, ["Matkahuolto · ei käytettävissä"]],
        ["on, names only the one down above packages", true, true, ["Matkahuolto · ei käytettävissä"]],
        ["off, names the one down above packages too", false, true, ["Matkahuolto · ei käytettävissä"]],
    ])("%s", async (_name, show, listed, lines) => {
        const state = hass({ [POSTI]: listed ? [WAITING] : [], [MATKAHUOLTO]: [] });
        state.states[POSTI]!.attributes.friendly_name = "Posti";
        state.states[MATKAHUOLTO] = {
            entity_id: MATKAHUOLTO,
            state: "unavailable",
            last_changed: "2026-09-16",
            attributes: { friendly_name: "Matkahuolto" },
        };
        const root = shadow(await card(state, show === undefined ? {} : { show_sensors: show }));
        expect([...root.querySelectorAll(".sensor")].map((line) => line.textContent?.trim())).toEqual(lines);
        expect(root.querySelectorAll(".item")).toHaveLength(listed ? 1 : 0);
    });
});

describe("a sensor that doesn't answer", () => {
    it("is named above the packages of the others, which are still listed", async () => {
        const state = hass();
        state.states[MATKAHUOLTO] = {
            entity_id: MATKAHUOLTO,
            state: "unavailable",
            last_changed: "2026-09-16",
            attributes: { friendly_name: "Matkahuolto" },
        };
        const root = shadow(await card(state));
        const list = root.querySelector(".list");
        expect(list?.firstElementChild?.textContent?.trim()).toBe("Matkahuolto · ei käytettävissä");
        expect(root.querySelectorAll(".item")).toHaveLength(1);
    });

    it("is not named while every sensor answers", async () => {
        const root = shadow(await card(hass()));
        expect(root.querySelector(".sensor")).toBeNull();
    });
});

describe("when the configuration is wrong", () => {
    it("refuses a configuration without an entity", () => {
        const element = document.createElement("package-tracker-card") as PackageTrackerCard;
        expect(() => element.setConfig({ type: "custom:package-tracker-card" } as never)).toThrow();
        expect(() => element.setConfig({ type: "custom:package-tracker-card", entity: [] } as never)).toThrow();
    });

    it("takes an empty max_events as no limit", async () => {
        const root = shadow(await card(hass(), { max_events: null as never }));
        expect(root.querySelectorAll(".item")).toHaveLength(1);
    });

    it.each([0, -1, 2.5])("refuses %s packages at most", (count) => {
        const element = document.createElement("package-tracker-card") as PackageTrackerCard;
        expect(() => element.setConfig({ type: "custom:package-tracker-card", entity: POSTI, max_events: count } as never)).toThrow();
    });

    it.each([
        ["a status that isn't one", { statuses: [8] }],
        ["a status as text", { statuses: ["5"] }],
        ["statuses that aren't a list", { statuses: 5 }],
        ["an unknown tracking link", { tracking_link: "title" }],
    ])("refuses %s", (_what, config) => {
        const element = document.createElement("package-tracker-card") as PackageTrackerCard;
        expect(() => element.setConfig({ type: "custom:package-tracker-card", entity: POSTI, ...config } as never)).toThrow();
    });

    it("says which entity is missing instead of throwing", async () => {
        const root = shadow(await card(hass({}), { entity: "sensor.gone" }));
        expect(root.querySelector(".message")?.textContent).toContain("sensor.gone");
    });

    it("still lists the packages of the sensors that are there", async () => {
        const root = shadow(await card(hass({ [POSTI]: [WAITING] }), { entity: [POSTI, "sensor.gone"] }));
        expect(root.querySelectorAll(".item")).toHaveLength(1);
    });
});

describe("how far a package has got", () => {
    it("draws a bar and the time since it last moved", async () => {
        const root = shadow(await card(hass()));
        const bar = root.querySelector(".bar") as HTMLElement;
        expect(bar.getAttribute("style")).toContain("width:8%");
        expect(root.querySelector(".track")?.getAttribute("aria-valuenow")).toBe("8");
        expect(root.querySelector(".status-text")?.textContent?.trim()).toBe("Odottaa");
        expect(root.querySelector(".when")?.textContent?.trim()).toMatch(/^2026-09-16 \d\d:\d\d$/);
    });

    it("fills the bar for a delivered package", async () => {
        const delivered = { ...WAITING, status: 0 };
        const root = shadow(await card(hass({ [POSTI]: [delivered] })));
        expect((root.querySelector(".bar") as HTMLElement).getAttribute("style")).toContain("width:100%");
    });

    it("is left out when the configuration hides it", async () => {
        const root = shadow(await card(hass(), { show_progress: false, show_latest_event: false }));
        expect(root.querySelector(".progress-row")).toBeNull();
    });
});

describe("opening a package", () => {
    it("opens the page the integration gives for the package", async () => {
        const opened: string[] = [];
        const openWindow = vi.spyOn(window, "open").mockImplementation((url) => {
            opened.push(String(url));
            return null;
        });
        const other = {
            ...WAITING,
            shipment_number: "70012345678",
            source: "Another Carrier",
            tracking_url: "https://other.example.net/?parcel=70012345678",
        };
        const root = shadow(await card(hass({ [POSTI]: [WAITING], [MATKAHUOLTO]: [other] })));

        const items = [...root.querySelectorAll(".item")] as HTMLElement[];
        items.forEach((item) => item.dispatchEvent(new Event("click")));

        expect(opened).toEqual(["https://carrier.example.com/track/JJFI0001", "https://other.example.net/?parcel=70012345678"]);
        openWindow.mockRestore();
    });

    it("opens it with the keyboard as well", async () => {
        const openWindow = vi.spyOn(window, "open").mockImplementation(() => null);
        const root = shadow(await card(hass()));
        root.querySelector(".number")?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        expect(openWindow).toHaveBeenCalledWith("https://carrier.example.com/track/JJFI0001", "_blank", "noopener");
        openWindow.mockRestore();
    });

    it.each([
        ["no tracking_url", undefined],
        ["an empty one", ""],
        ["a script", "javascript:alert(1)"],
        ["something that is no address", "not a url"],
    ])("stays put for a package with %s", async (_what, url) => {
        const openWindow = vi.spyOn(window, "open").mockImplementation(() => null);
        const root = shadow(await card(hass({ [POSTI]: [{ ...WAITING, tracking_url: url }] })));
        const item = root.querySelector(".item") as HTMLElement;

        expect(item.classList.contains("clickable")).toBe(false);
        item.dispatchEvent(new Event("click"));
        expect(openWindow).not.toHaveBeenCalled();
        openWindow.mockRestore();
    });
});

describe("the tracking_link setting", () => {
    it("opens the page from the number only, when asked to", async () => {
        const openWindow = vi.spyOn(window, "open").mockImplementation(() => null);
        const root = shadow(await card(hass(), { tracking_link: "number" }));
        const item = root.querySelector(".item") as HTMLElement;

        expect(item.classList.contains("clickable")).toBe(false);
        item.dispatchEvent(new Event("click"));
        expect(openWindow).not.toHaveBeenCalled();

        root.querySelector(".number")?.dispatchEvent(new Event("click", { bubbles: true }));
        expect(openWindow).toHaveBeenCalledTimes(1);
        expect(openWindow).toHaveBeenCalledWith("https://carrier.example.com/track/JJFI0001", "_blank", "noopener");
        openWindow.mockRestore();
    });

    it("opens nothing, and offers no link, when turned off", async () => {
        const openWindow = vi.spyOn(window, "open").mockImplementation(() => null);
        const root = shadow(await card(hass(), { tracking_link: "none" }));
        const number = root.querySelector(".number") as HTMLElement;

        expect(number.getAttribute("role")).toBeNull();
        expect(number.getAttribute("tabindex")).toBeNull();
        root.querySelector(".item")?.dispatchEvent(new Event("click"));
        number.dispatchEvent(new Event("click", { bubbles: true }));
        number.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        expect(openWindow).not.toHaveBeenCalled();
        openWindow.mockRestore();
    });
});

describe("redrawing", () => {
    it("follows a change of language, even when no package moved", async () => {
        const state = hass();
        const element = await card(state);
        element.hass = { ...state, locale: { language: "en" } };
        await element.updateComplete;
        expect(shadow(element).querySelector(".status-text")?.textContent?.trim()).toBe("Waiting");
    });
});

describe("where a package came from", () => {
    it("leaves out the date it was sent when there is no sender to go with it", async () => {
        const anonymous = { ...WAITING, origin: null, origin_city: null };
        const root = shadow(await card(hass({ [POSTI]: [anonymous] })));
        expect(root.querySelector('ha-icon[icon="mdi:arrow-up-bold-box"]')).toBeNull();
    });
});

describe("the destination line", () => {
    const waiting = (extra: Partial<Shipment> = {}): Shipment => ({
        ...WAITING,
        status: 5,
        pickup_deadline: "2026-09-23T20:59:00Z",
        estimated_delivery: "2026-09-17T07:00:00Z",
        pickup_point: { name: "K-Market Keskusta", city: "TAMPERE" },
        ...extra,
    });

    // The package's own line is the last of the secondary rows.
    const line = (root: ShadowRoot | DocumentFragment): Element => {
        const rows = root.querySelectorAll(".row.secondary");
        return rows[rows.length - 1];
    };

    it("shows the pickup point and the deadline once a package is waiting", async () => {
        const root = shadow(await card(hass({ [POSTI]: [waiting()] })));
        expect(line(root).textContent).toContain("K-Market Keskusta, TAMPERE");
        expect(line(root).textContent).toContain("Nouda viimeistään 2026-09-23");
        expect(line(root).textContent).not.toContain("Arvio");
    });

    it("shows the estimate while the package is still on its way", async () => {
        const root = shadow(await card(hass({ [POSTI]: [waiting({ status: 3 })] })));
        expect(line(root).textContent).toContain("Arvio 2026-09-17");
        expect(line(root).textContent).not.toContain("Nouda viimeistään");
    });

    it("never shows the estimate once the package is at the pickup point", async () => {
        // Posti gives no deadline, so there is simply no time to show.
        const root = shadow(await card(hass({ [POSTI]: [waiting({ pickup_deadline: null })] })));
        expect(line(root).textContent).toContain("K-Market Keskusta");
        expect(line(root).textContent).not.toContain("2026-09-17");
    });

    it("falls back to the destination when there is no pickup point", async () => {
        const root = shadow(await card(hass({ [POSTI]: [waiting({ pickup_point: null })] })));
        expect(line(root).textContent).toContain("Postin automaatti");
        expect(line(root).textContent).toContain("Nouda viimeistään");
    });

    it("shows the time alone when the place is hidden", async () => {
        const state = hass({ [POSTI]: [waiting()] });
        const root = shadow(await card(state, { show_destination: false }));
        expect(line(root).textContent).not.toContain("K-Market Keskusta");
        expect(line(root).textContent).toContain("Nouda viimeistään");
    });

    it("keeps the place but drops the time for a delivered package, and when it is hidden", async () => {
        const delivered = shadow(await card(hass({ [POSTI]: [waiting({ status: 0 })] })));
        expect(line(delivered).textContent).toContain("K-Market Keskusta");
        expect(line(delivered).textContent).not.toContain("Nouda viimeistään");
        const hidden = shadow(await card(hass({ [POSTI]: [waiting()] }), { show_pickup: false }));
        expect(line(hidden).textContent).toContain("K-Market Keskusta");
        expect(line(hidden).textContent).not.toContain("Nouda viimeistään");
    });
});

describe("the pickup code", () => {
    const withCode: Shipment = {
        ...WAITING,
        status: 5,
        pickup_point: { name: "K-Market Keskusta" },
        pickup_code: "12345678",
    };

    it("is not shown by default", async () => {
        const root = shadow(await card(hass({ [POSTI]: [withCode] })));
        expect(root.querySelector(".code")).toBeNull();
    });

    it("is shown outright when asked for", async () => {
        const root = shadow(await card(hass({ [POSTI]: [withCode] }), { pickup_code: "always" }));
        expect(root.querySelector(".code")?.textContent).toContain("12345678");
    });

    // The row an icon belongs to.
    const rowOf = (root: ShadowRoot | DocumentFragment, icon: string): Element | null =>
        root.querySelector(`ha-icon[icon="${icon}"]`)?.parentElement ?? null;

    it("sits with the message that says the package can be collected", async () => {
        const root = shadow(await card(hass({ [POSTI]: [withCode] }), { pickup_code: "always" }));
        expect(rowOf(root, "mdi:text-box")?.querySelector(".code")).not.toBeNull();
        expect(rowOf(root, "mdi:map-marker-radius")?.querySelector(".code")).toBeNull();
    });

    it("keeps a line of its own when the message is hidden and the destination line has nothing else", async () => {
        const bare = { ...withCode, pickup_point: null, destination: null, destination_city: null };
        const root = shadow(await card(hass({ [POSTI]: [bare] }), { pickup_code: "always", show_latest_event_message: false }));
        expect(root.querySelector(".code")?.textContent).toContain("12345678");
    });

    it("moves to the destination line when that message is hidden", async () => {
        const root = shadow(
            await card(hass({ [POSTI]: [withCode] }), {
                pickup_code: "always",
                show_latest_event_message: false,
            }),
        );
        expect(rowOf(root, "mdi:map-marker-radius")?.querySelector(".code")).not.toBeNull();
    });

    it("is covered until clicked, and covers again when clicked once more", async () => {
        const element = await card(hass({ [POSTI]: [withCode] }), { pickup_code: "toggle" });
        const root = shadow(element);
        const field = () => root.querySelector(".code") as HTMLElement;
        expect(field().textContent).toContain("••••");
        expect(field().textContent).not.toContain("12345678");

        field().dispatchEvent(new Event("click"));
        await element.updateComplete;
        expect(field().textContent).toContain("12345678");

        field().dispatchEvent(new Event("click"));
        await element.updateComplete;
        expect(field().textContent).toContain("••••");
    });

    it("comes after the locker door, which stays covered with it", async () => {
        const atDoor = { ...withCode, pickup_point: { name: "K-Market Keskusta", compartment: "17" } };
        const element = await card(hass({ [POSTI]: [atDoor] }), { pickup_code: "toggle" });
        const root = shadow(element);
        const field = () => root.querySelector(".code") as HTMLElement;
        expect(field().textContent).not.toContain("17");

        field().dispatchEvent(new Event("click"));
        await element.updateComplete;
        expect(field().textContent).toContain("17 · 12345678");
        expect(field().title).toBe("Lokero 17");
    });

    it("is not shown for a package that is finished", async () => {
        for (const status of [0, 6]) {
            const root = shadow(await card(hass({ [POSTI]: [{ ...withCode, status }] }), { pickup_code: "always" }));
            expect(root.querySelector(".code")).toBeNull();
        }
    });

    it.each(["toggle", "always"] as const)("does not open the carrier page when the code is clicked, with %s", async (setting) => {
        const openWindow = vi.spyOn(window, "open").mockImplementation(() => null);
        const element = await card(hass({ [POSTI]: [withCode] }), { pickup_code: setting });
        const code = shadow(element).querySelector(".code") as HTMLElement;

        code.dispatchEvent(new Event("click", { bubbles: true }));
        await element.updateComplete;

        expect(openWindow).not.toHaveBeenCalled();
        openWindow.mockRestore();
    });

    it("is revealed with the keyboard as well, without opening the carrier page", async () => {
        const openWindow = vi.spyOn(window, "open").mockImplementation(() => null);
        const element = await card(hass({ [POSTI]: [withCode] }), { pickup_code: "toggle" });
        const field = () => shadow(element).querySelector(".code") as HTMLElement;

        field().dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await element.updateComplete;

        expect(field().textContent).toContain("12345678");
        expect(openWindow).not.toHaveBeenCalled();
        openWindow.mockRestore();
    });
});

describe("the QR code", () => {
    const atCounter: Shipment = {
        ...WAITING,
        status: 5,
        pickup_point: { name: "K-Market Keskusta", city: "TAMPERE" },
        pickup_code: "582917",
        pickup_qr: "582917",
        pickup_deadline: "2026-09-30",
    };

    const button = (root: ShadowRoot) => root.querySelector(".qr-button") as HTMLButtonElement | null;
    const dialog = (root: ShadowRoot) => root.querySelector("dialog.qr") as HTMLDialogElement | null;

    it("has a button with the code, whether the code is shown always or when clicked", async () => {
        for (const setting of ["always", "toggle"] as const) {
            const root = shadow(await card(hass({ [POSTI]: [atCounter] }), { pickup_code: setting }));
            expect(button(root)).not.toBeNull();
        }
    });

    it("has no button when the code is never shown, the package is finished, or there is no QR code", async () => {
        const cases: Array<[Shipment, PackageTrackerCardConfig["pickup_code"]]> = [
            [atCounter, "hidden"],
            [{ ...atCounter, status: 0 }, "always"],
            [{ ...atCounter, pickup_qr: null }, "always"],
        ];
        for (const [item, setting] of cases) {
            const root = shadow(await card(hass({ [POSTI]: [item] }), { pickup_code: setting }));
            expect(button(root)).toBeNull();
        }
    });

    it("opens with the code, the place and the deadline, without opening the carrier page", async () => {
        const openWindow = vi.spyOn(window, "open").mockImplementation(() => null);
        const element = await card(hass({ [POSTI]: [atCounter] }), { pickup_code: "toggle" });
        const root = shadow(element);
        expect(dialog(root)).toBeNull();

        button(root)?.click();
        await element.updateComplete;

        const open = dialog(root);
        expect(open?.querySelector(".qr-title")?.textContent).toBe("JJFI0001");
        expect(open?.querySelector("svg.qr-code path")?.getAttribute("d")).toContain("M4 4h1v1h-1z");
        expect(open?.querySelector(".qr-number")?.textContent).toBe("582917");
        expect(open?.textContent).toContain("K-Market Keskusta, TAMPERE");
        expect(open?.textContent).toContain("Nouda viimeistään");
        expect(openWindow).not.toHaveBeenCalled();
        openWindow.mockRestore();
    });

    it("closes from its button", async () => {
        const element = await card(hass({ [POSTI]: [atCounter] }), { pickup_code: "always" });
        const root = shadow(element);
        button(root)?.click();
        await element.updateComplete;

        (root.querySelector(".qr-close") as HTMLButtonElement).click();
        await element.updateComplete;
        expect(dialog(root)).toBeNull();
    });

    it("leaves the code covered in the list", async () => {
        const element = await card(hass({ [POSTI]: [atCounter] }), { pickup_code: "toggle" });
        const root = shadow(element);
        button(root)?.click();
        await element.updateComplete;
        expect(root.querySelector(".code")?.textContent).toContain("••••");
    });
});

describe("the weight and parcels", () => {
    const heavy: Shipment = { ...WAITING, weight: 2.4, package_count: 2 };

    it("are left out by default", async () => {
        const root = shadow(await card(hass({ [POSTI]: [heavy] })));
        expect(root.textContent).not.toContain("kg");
    });

    it("are shown when asked for", async () => {
        const root = shadow(await card(hass({ [POSTI]: [heavy] }), { show_details: true }));
        const text = root.textContent?.replace(/\s+/g, " ");
        expect(text).toContain("2,4 kg");
        expect(text).toContain("2 kollia");
    });

    it("leave out a single parcel, which says nothing", async () => {
        const one = { ...heavy, package_count: 1 };
        const root = shadow(await card(hass({ [POSTI]: [one] }), { show_details: true }));
        const text = root.textContent?.replace(/\s+/g, " ");
        expect(text).toContain("2,4 kg");
        expect(text).not.toContain("kollia");
    });
});

describe("which way a package goes", () => {
    const SENT: Shipment = { ...WAITING, shipment_number: "JJFI0002", direction: "outgoing", latest_event_date: "2026-09-16T09:00:00Z" };
    const COMING: Shipment = { ...WAITING, shipment_number: "JJFI0003", direction: "incoming", latest_event_date: "2026-09-16T07:00:00Z" };

    function badges(root: ShadowRoot): Record<string, string> {
        return Object.fromEntries(
            [...root.querySelectorAll(".item")].map((item) => [
                item.querySelector(".number")?.textContent ?? "",
                item.querySelector(".badge.direction")?.textContent ?? "",
            ]),
        );
    }

    it("marks every package when the card lists both ways, one without a direction as incoming", async () => {
        const root = shadow(await card(hass({ [POSTI]: [WAITING, SENT] })));
        expect(badges(root)).toEqual({ JJFI0002: "Lähetetty", JJFI0001: "Saapuva" });
        expect(root.querySelectorAll(".badge.source")).toHaveLength(2);
    });

    it("marks every package when the card lists both ways, also when every package goes the same way", async () => {
        // The setting decides, not what the integrations happen to send at the moment.
        const root = shadow(await card(hass({ [POSTI]: [WAITING, COMING] })));
        expect(badges(root)).toEqual({ JJFI0001: "Saapuva", JJFI0003: "Saapuva" });
        expect(root.querySelectorAll(".badge.source")).toHaveLength(2);
    });

    it("lists only the packages going the chosen way, and marks none of them", async () => {
        const sent = shadow(await card(hass({ [POSTI]: [WAITING, SENT, COMING] }), { direction: "outgoing" }));
        expect(Object.keys(badges(sent))).toEqual(["JJFI0002"]);
        expect(sent.querySelectorAll(".badge.direction")).toHaveLength(0);

        document.body.innerHTML = "";
        const incoming = shadow(await card(hass({ [POSTI]: [WAITING, SENT, COMING] }), { direction: "incoming" }));
        expect(Object.keys(badges(incoming))).toEqual(["JJFI0001", "JJFI0003"]);
        expect(incoming.querySelectorAll(".badge.direction")).toHaveLength(0);
    });

    it("lists at most max_events incoming packages and max_sent_events sent ones", async () => {
        const sent2: Shipment = { ...SENT, shipment_number: "JJFI0004", latest_event_date: "2026-09-16T10:00:00Z" };
        const all = hass({ [POSTI]: [WAITING, COMING, SENT, sent2] });
        const incomingOnly = shadow(await card(all, { max_events: 1 }));
        expect(Object.keys(badges(incomingOnly))).toEqual(["JJFI0004", "JJFI0002", "JJFI0001"]);

        document.body.innerHTML = "";
        const both = shadow(await card(all, { max_events: 1, max_sent_events: 1 }));
        expect(Object.keys(badges(both))).toEqual(["JJFI0004", "JJFI0001"]);
    });

    it("sizes itself by the packages it lists", async () => {
        const element = await card(hass({ [POSTI]: [WAITING, COMING, SENT] }), { max_events: 1, max_sent_events: 1 });
        expect(element.getCardSize()).toBe(5);
    });

    it("names the recipient of a sent package where the sender would be, and never shows its code", async () => {
        const sentWithCode: Shipment = { ...SENT, status: 5, recipient: "Maija Mallikas", pickup_code: "123456", pickup_qr: "123456" };
        const root = shadow(await card(hass({ [POSTI]: [sentWithCode] }), { pickup_code: "always" }));
        expect(root.textContent).toContain("Maija Mallikas");
        expect(root.textContent).not.toContain("Example Shop");
        expect(root.querySelector(".code")).toBeNull();
        expect(root.querySelector(".qr-button")).toBeNull();
    });

    it.each([0, -1, 2.5])("refuses %s sent packages at most", (count) => {
        const element = document.createElement("package-tracker-card") as PackageTrackerCard;
        expect(() => element.setConfig({ type: "custom:package-tracker-card", entity: POSTI, max_sent_events: count } as never)).toThrow();
    });

    it("takes an empty max_sent_events as no limit", async () => {
        const sent2: Shipment = { ...SENT, shipment_number: "JJFI0004" };
        const root = shadow(await card(hass({ [POSTI]: [SENT, sent2] }), { max_sent_events: null as never }));
        expect(root.querySelectorAll(".item")).toHaveLength(2);
    });

    it("leaves the recipient out when the card hides the sender, and when the package doesn't name one", async () => {
        const named: Shipment = { ...SENT, recipient: "Maija Mallikas" };
        const hidden = shadow(await card(hass({ [POSTI]: [named] }), { show_origin: false }));
        expect(hidden.textContent).not.toContain("Maija Mallikas");

        document.body.innerHTML = "";
        // A sent package's origin is the user, so with no recipient the row is left out rather than showing that.
        const unnamed = shadow(await card(hass({ [POSTI]: [SENT] })));
        expect(unnamed.querySelector('ha-icon[icon="mdi:account-arrow-right"]')).toBeNull();
        expect(unnamed.querySelector('ha-icon[icon="mdi:arrow-up-bold-box"]')).toBeNull();
    });

    it("never shows a shelf for a sent package", async () => {
        const onShelf: Shipment = { ...SENT, status: 5, pickup_point: { name: "Example Service Point", compartment: "B12" } };
        const root = shadow(await card(hass({ [POSTI]: [onShelf] }), { pickup_code: "always" }));
        expect(root.querySelector(".shelf")).toBeNull();
    });

    it("sizes itself by the packages going the chosen way", async () => {
        const element = await card(hass({ [POSTI]: [WAITING, SENT, COMING] }), { direction: "outgoing" });
        expect(element.getCardSize()).toBe(3);
    });

    it("refuses a direction it doesn't know", () => {
        const element = document.createElement("package-tracker-card") as PackageTrackerCard;
        expect(() => element.setConfig({ type: "custom:package-tracker-card", entity: POSTI, direction: "sideways" } as never)).toThrow();
    });
});

describe("a counter shelf", () => {
    const onShelf: Shipment = {
        ...WAITING,
        status: 5,
        pickup_point: { name: "Example Service Point", compartment: "B12" },
        pickup_qr: "ITEM-1",
    };

    it("is shown beside the QR code when the package has no code", async () => {
        const root = shadow(await card(hass({ [POSTI]: [onShelf] }), { pickup_code: "toggle" }));
        expect(root.querySelector(".shelf")?.textContent?.trim()).toBe("Hylly B12");
        expect(root.querySelector(".qr-button")).not.toBeNull();
        expect(root.querySelector(".code")).toBeNull();
    });

    it("is shown without a QR code too", async () => {
        const root = shadow(await card(hass({ [POSTI]: [{ ...onShelf, pickup_qr: null }] }), { pickup_code: "always" }));
        expect(root.querySelector(".shelf")?.textContent?.trim()).toBe("Hylly B12");
    });

    it("is not shown when the card hides the pickup details", async () => {
        const root = shadow(await card(hass({ [POSTI]: [onShelf] })));
        expect(root.querySelector(".shelf")).toBeNull();
    });

    it("is no shelf when the package has a code: the compartment is then the locker door, with the code", async () => {
        const locker = { ...onShelf, pickup_code: "123456", pickup_qr: null };
        const root = shadow(await card(hass({ [POSTI]: [locker] }), { pickup_code: "always" }));
        expect(root.querySelector(".shelf")).toBeNull();
        expect(root.querySelector(".code")?.textContent).toContain("B12 · 123456");
    });
});
