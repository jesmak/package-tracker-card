/** The little of Home Assistant a card needs, so the unmaintained custom-card-helpers isn't a dependency. */

export interface HassEntity {
    entity_id: string;
    state: string;
    last_changed: string;
    attributes: Record<string, unknown>;
}

/** One part of an entity's name, as `formatEntityName` puts them together. */
export interface NamePart {
    type: "entity" | "device" | "area" | "floor";
}

export interface HomeAssistant {
    states: Record<string, HassEntity | undefined>;
    language?: string;
    locale?: { language?: string };
    /** Missing in older versions of Home Assistant. */
    formatEntityName?(state: HassEntity, parts: NamePart[]): string;
}

export interface LovelaceCardConfig {
    type: string;
    [key: string]: unknown;
}
