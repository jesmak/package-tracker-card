import type { LovelaceCardConfig } from './hass';

/** `hidden` never shows the code, `always` shows it, `toggle` reveals it when clicked. */
export type PickupCode = 'hidden' | 'always' | 'toggle';

export interface PackageTrackerCardConfig extends LovelaceCardConfig {
  /** One sensor of a tracking integration, or several whose packages are shown together. */
  entity: string | string[];
  /** Shown at the top of the card. `name` is accepted as well, as older versions documented it. */
  title?: string;
  name?: string;
  /** At most this many packages are listed. */
  max_events?: number;
  /** A fixed height for the card, in pixels. The list scrolls inside it. */
  height?: number;
  /** A height the card never grows past, in pixels. The list scrolls once it is reached. */
  max_height?: number;
  show_progress?: boolean;
  /** The pickup place and the time that goes with it. */
  show_pickup?: boolean;
  /** The weight and how many parcels the shipment has. */
  show_details?: boolean;
  /** `hidden`, `always`, or `toggle` for a field that reveals the code when clicked. */
  pickup_code?: PickupCode;
  show_origin?: boolean;
  show_destination?: boolean;
  show_latest_event?: boolean;
  show_latest_event_message?: boolean;
  show_latest_event_location?: boolean;
  /** Leaves the card out of the dashboard entirely while there is nothing to track. */
  hide_when_nothing_to_show?: boolean;
}

/** One package, as the posti_tracking and matkahuolto_tracking integrations write it. */
export interface Shipment {
  shipment_number: string;
  shipment_date: string;
  status: number;
  raw_status?: string;
  origin?: string | null;
  origin_city?: string | null;
  destination?: string | null;
  destination_city?: string | null;
  latest_event?: string | null;
  latest_event_city?: string | null;
  latest_event_country?: string | null;
  latest_event_date?: string | null;
  /** Which service the package came from, when the sensor says so. */
  source?: string | null;
  /** When the package is expected, before it is ready for pickup. */
  estimated_delivery?: string | null;
  /** How long a package waiting for pickup is kept. Posti never tells, Matkahuolto does. */
  pickup_deadline?: string | null;
  /** Kilograms, and how many parcels the shipment has. */
  weight?: number | null;
  package_count?: number | null;
  /** Where it is picked up, and the code that collects it. Both need the integration's own setting. */
  pickup_point?: PickupPoint | null;
  pickup_code?: string | null;
}

/** The pickup point of a package, as the tracking integrations write it. */
export interface PickupPoint {
  name?: string | null;
  street?: string | null;
  postal_code?: string | null;
  city?: string | null;
  type?: string | null;
  available?: string | null;
}
