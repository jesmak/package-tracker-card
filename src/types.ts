import { LovelaceCardConfig } from 'custom-card-helpers';

export interface PackageTrackerCardConfig extends LovelaceCardConfig {
  type: string;
  entity: string;
  name?: string;
  show_origin?: boolean;
  show_destination?: boolean;
  show_latest_event?: boolean;
  show_latest_event_message?: boolean;
  show_latest_event_location?: boolean;
}

export interface Shipment {
  origin: string;
  origin_city: string;
  destination: string;
  destination_city: string;
  shipment_number: string;
  shipment_date: string;
  status: number;
  raw_status: string;
  latest_event: string;
  latest_event_country: string;
  latest_event_city: string;
  latest_event_date: string;
}
