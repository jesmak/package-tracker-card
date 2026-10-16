import { DELIVERED, FINISHED, PROGRESS, UNKNOWN } from "./const";
import type { HomeAssistant } from "./hass";
import type { Direction, Shipment } from "./types";

/** One icon per status, in the order the tracking integrations number them. */
const ICONS = [
    "mdi:checkbox-marked",
    "mdi:file-document",
    "mdi:clock",
    "mdi:truck-delivery",
    "mdi:human-dolly",
    "mdi:check-decagram",
    "mdi:arrow-u-left-top-bold",
    "mdi:help-circle",
];
const UNKNOWN_ICON = "mdi:help-circle";

export function entities(entity: string | string[]): string[] {
    return typeof entity === "string" ? [entity] : entity;
}

/**
 * The packages of every sensor the card was given. Sensors that aren't there are passed over, and so
 * are entries that aren't packages, with a warning, so that one bad entry can't take the others with it.
 * A package that two sensors both list is shown once, as the one that moved last.
 */
export function packagesOf(hass: HomeAssistant, entity: string | string[]): Shipment[] {
    const found = new Map<string, Shipment>();
    let dropped = 0;
    for (const id of entities(entity)) {
        const packages = hass.states[id]?.attributes?.packages;
        if (!Array.isArray(packages)) {
            continue;
        }
        for (const raw of packages) {
            const item = shipmentOf(raw);
            if (!item) {
                dropped++;
                continue;
            }
            const seen = found.get(item.shipment_number);
            if (!seen || moment(item.latest_event_date) > moment(seen.latest_event_date)) {
                found.set(item.shipment_number, item);
            }
        }
    }
    // Once per change, not on every redraw, or one bad entry would fill the console for as long as it stays.
    if (dropped > 0 && dropped !== lastDropped) {
        console.warn(`package-tracker-card: left out ${dropped} entries that are not packages in the format README.md describes`);
    }
    lastDropped = dropped;
    return [...found.values()];
}

let lastDropped = 0;

const TEXTS = [
    "shipment_date",
    "raw_status",
    "direction",
    "origin",
    "origin_city",
    "destination",
    "destination_city",
    "latest_event",
    "latest_event_city",
    "latest_event_country",
    "latest_event_date",
    "source",
    "tracking_url",
    "estimated_delivery",
    "pickup_deadline",
] as const;
const NUMBERS = ["weight", "package_count"] as const;
const POINT_TEXTS = ["name", "street", "postal_code", "city", "type", "available"] as const;

/**
 * One package from a sensor, keeping only the fields that have the type the format gives them. A code
 * or a door written as a number is taken as text. Without a shipment number or a status it is no package at all.
 */
export function shipmentOf(raw: unknown): Shipment | undefined {
    if (
        !isRecord(raw) ||
        typeof raw.shipment_number !== "string" ||
        raw.shipment_number === "" ||
        raw.status == null ||
        raw.status === ""
    ) {
        return undefined;
    }
    const item: Record<string, unknown> = { shipment_number: raw.shipment_number, status: statusOf(raw.status) };
    for (const key of TEXTS) {
        if (typeof raw[key] === "string") {
            item[key] = raw[key];
        }
    }
    for (const key of NUMBERS) {
        if (typeof raw[key] === "number" && Number.isFinite(raw[key])) {
            item[key] = raw[key];
        }
    }
    item.pickup_code = textOf(raw.pickup_code);
    item.pickup_qr = textOf(raw.pickup_qr);
    if (isRecord(raw.pickup_point)) {
        const point: Record<string, unknown> = { compartment: textOf(raw.pickup_point.compartment) };
        for (const key of POINT_TEXTS) {
            if (typeof raw.pickup_point[key] === "string") {
                point[key] = raw.pickup_point[key];
            }
        }
        item.pickup_point = point;
    }
    return item as unknown as Shipment;
}

/** One of the statuses, also when written as text. Any other status is unknown. */
function statusOf(status: unknown): number {
    const value = typeof status === "string" && status.trim() !== "" ? Number(status) : status;
    return typeof value === "number" && Number.isInteger(value) && value >= DELIVERED && value <= UNKNOWN ? value : UNKNOWN;
}

function textOf(value: unknown): string | undefined {
    if (typeof value === "number" && Number.isFinite(value)) {
        return String(value);
    }
    return typeof value === "string" && value !== "" ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Sensors named in the configuration that Home Assistant doesn't have. */
export function missingEntities(hass: HomeAssistant, entity: string | string[]): string[] {
    return entities(entity).filter((id) => hass.states[id] === undefined);
}

/** The packages with one of `statuses`, or all of them when no statuses are given. */
export function withStatuses(packages: Shipment[], statuses: number[] | undefined): Shipment[] {
    return statuses && statuses.length > 0 ? packages.filter((item) => statuses.includes(item.status)) : packages;
}

/** Whether the user sent the package. One whose direction the integration doesn't give is coming to them. */
export function isOutgoing(item: Shipment): boolean {
    return item.direction?.toLowerCase() === "outgoing";
}

/** The packages going the chosen way, or all of them. */
export function withDirection(packages: Shipment[], direction: Direction | undefined): Shipment[] {
    if (!direction || direction === "all") {
        return packages;
    }
    return packages.filter((item) => isOutgoing(item) === (direction === "outgoing"));
}

/** Whether a list holds packages going both ways, so that each of them needs to say which. */
export function bothDirections(packages: Shipment[]): boolean {
    return packages.some(isOutgoing) && packages.some((item) => !isOutgoing(item));
}

/** Packages still on their way come first, and the most recently moved of them at the top. */
export function sortPackages(packages: Shipment[]): Shipment[] {
    return [...packages].sort((one, other) => {
        const oneDone = FINISHED.includes(one.status);
        const otherDone = FINISHED.includes(other.status);
        if (oneDone !== otherDone) {
            return oneDone ? 1 : -1;
        }
        return moment(other.latest_event_date) - moment(one.latest_event_date);
    });
}

function moment(date: string | null | undefined): number {
    const parsed = date ? Date.parse(date) : NaN;
    return Number.isNaN(parsed) ? 0 : parsed;
}

export function iconFor(status: number): string {
    return ICONS[status] ?? UNKNOWN_ICON;
}

/**
 * A date and time as the card has always written it: 2026-09-13 19:58 in the viewer's own time. A date
 * without a time is a day, not midnight in UTC, so it is written as it is.
 */
export function formatDateTime(date: string | null | undefined): string {
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        // Date.parse takes 2026-02-30 too, so the day has to come back as it went in.
        const parsed = Date.parse(date);
        return !Number.isNaN(parsed) && new Date(parsed).toISOString().startsWith(date) ? date : "";
    }
    const parsed = date ? new Date(date) : null;
    if (!parsed || Number.isNaN(parsed.getTime())) {
        return "";
    }
    const pad = (value: number) => String(value).padStart(2, "0");
    return (
        `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())} ` +
        `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`
    );
}

/** How far along a package is, between 0 and 1. */
export function progressOf(status: number): number {
    return PROGRESS[status] ?? PROGRESS[UNKNOWN];
}

/**
 * The carrier's own page for a package, as the integration gives it in `tracking_url`.
 * Only web addresses are opened, so a package can't carry a script or another app's link.
 */
export function trackingUrl(item: Shipment): string | undefined {
    if (typeof item.tracking_url !== "string") {
        return undefined;
    }
    try {
        const url = new URL(item.tracking_url);
        return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
    } catch {
        return undefined;
    }
}
