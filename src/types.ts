import type { LovelaceCardConfig } from './hass';

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
}
