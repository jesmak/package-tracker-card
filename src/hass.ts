/** The little of Home Assistant a card needs, so the unmaintained custom-card-helpers isn't a dependency. */

export interface HassEntity {
  entity_id: string;
  state: string;
  last_changed: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity | undefined>;
  language?: string;
  locale?: { language?: string };
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}
