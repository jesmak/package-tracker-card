import type { LovelaceCardConfig } from "./hass";
import type { RowStepConfig } from "./rows";

/** `hidden` never shows the code, `always` shows it, `toggle` reveals it when clicked. */
export type PickupCode = "hidden" | "always" | "toggle";

/** What a click opens the carrier's page from: anywhere on the package, its number only, or nowhere. */
export type TrackingLink = "row" | "number" | "none";

/** Every package, only those coming to the user, or only those the user sent. */
export type Direction = "all" | "incoming" | "outgoing";

export interface PackageTrackerCardConfig extends LovelaceCardConfig, RowStepConfig {
    /** One sensor of a tracking integration, or several whose packages are shown together. */
    entity: string | string[];
    /** Shown at the top of the card. `name`, as older versions documented it, is read as the title. */
    title?: string;
    name?: string;
    /** Only packages with these statuses are listed. Left out or empty, every status is. */
    statuses?: number[];
    /** Which way the packages listed go. Left out, both ways. */
    direction?: Direction;
    /** At most this many incoming packages are listed, and of sent ones at most max_sent_events. */
    max_events?: number;
    max_sent_events?: number;
    show_progress?: boolean;
    /** The pickup place and the time that goes with it. */
    show_pickup?: boolean;
    /** The weight and how many parcels the shipment has. */
    show_details?: boolean;
    /** With nothing to list, each sensor and when it last checked. A sensor that doesn't answer is named either way. */
    show_sensors?: boolean;
    /** Long texts wrap over several lines instead of being cut short. */
    wrap_text?: boolean;
    /** `hidden`, `always`, or `toggle` for a field that reveals the code when clicked. */
    pickup_code?: PickupCode;
    tracking_link?: TrackingLink;
    show_origin?: boolean;
    show_destination?: boolean;
    show_latest_event?: boolean;
    show_latest_event_message?: boolean;
    show_latest_event_location?: boolean;
}

/** One package, as a tracking integration writes it. README.md documents the format. */
export interface Shipment {
    shipment_number: string;
    shipment_date?: string;
    status: number;
    raw_status?: string;
    /** `outgoing` for a package the user sent. `incoming`, anything else or nothing is a package coming to them. */
    direction?: string | null;
    origin?: string | null;
    /** Who a package the user sent goes to. */
    recipient?: string | null;
    origin_city?: string | null;
    destination?: string | null;
    destination_city?: string | null;
    latest_event?: string | null;
    latest_event_city?: string | null;
    latest_event_country?: string | null;
    latest_event_date?: string | null;
    /** Which service the package came from, shown as a label. */
    source?: string | null;
    /** The carrier's own page for the package, opened when it is clicked. */
    tracking_url?: string | null;
    /** When the package is expected, before it is ready for pickup. */
    estimated_delivery?: string | null;
    /** How long a package waiting for pickup is kept, when the carrier tells. */
    pickup_deadline?: string | null;
    /** Kilograms, and how many parcels the shipment has. */
    weight?: number | null;
    package_count?: number | null;
    /** Where it is picked up, and the code that collects it. Both need the integration's own setting. */
    pickup_point?: PickupPoint | null;
    pickup_code?: string | null;
    /** What a QR code for the pickup point holds, when the integration knows the point scans one. */
    pickup_qr?: string | null;
}

/** The pickup point of a package, as the tracking integrations write it. */
export interface PickupPoint {
    name?: string | null;
    /** The door the package is behind, at a locker with a keypad on every door. */
    compartment?: string | null;
    street?: string | null;
    postal_code?: string | null;
    city?: string | null;
    type?: string | null;
    available?: string | null;
}
