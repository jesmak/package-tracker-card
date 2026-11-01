/**
 * The card's visual editor: the tracking sensors, the title, which packages and
 * how many of them are listed, the card's height, and which lines a package shows.
 */
import { LitElement, html, nothing } from "lit";
import type { TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { STATUSES } from "./const";
import type { HomeAssistant } from "./hass";
import { heightData, heightSchema, tidyHeight } from "./height";
import { browserLanguage, translate } from "./localize/localize";
import type { PackageTrackerCardConfig } from "./types";

interface SchemaEntry {
    name: string;
}

const DEFAULTS: Record<string, unknown> = {
    show_progress: true,
    show_pickup: true,
    show_details: false,
    show_sensors: true,
    wrap_text: false,
    pickup_code: "hidden",
    tracking_link: "row",
    direction: "all",
    show_latest_event: true,
    show_latest_event_message: true,
    show_latest_event_location: true,
    show_origin: true,
    show_destination: true,
};

/**
 * The configuration with an old `name` read as its title. The editor then shows it in the title field,
 * and the next save writes it there.
 */
export function withTitle(config: PackageTrackerCardConfig): PackageTrackerCardConfig {
    const { name, ...rest } = config;
    return name === undefined || rest.title !== undefined ? { ...rest } : { ...rest, title: name };
}

/** The sensors that carry packages: the tracking integrations write them, whatever they are called. */
export function trackingEntities(hass: HomeAssistant): string[] {
    return Object.keys(hass.states)
        .filter((id) => Array.isArray(hass.states[id]?.attributes?.packages))
        .sort();
}

function schema(hass: HomeAssistant, config: PackageTrackerCardConfig, text: (key: string) => string) {
    return [
        {
            name: "entity",
            required: true,
            selector: { entity: { multiple: true, include_entities: trackingEntities(hass) } },
        },
        { name: "title", selector: { text: {} } },
        {
            name: "statuses",
            selector: {
                select: {
                    multiple: true,
                    mode: "list",
                    options: STATUSES.map((status) => ({ value: String(status), label: text(`statuses.${status}`) })),
                },
            },
        },
        {
            name: "direction",
            selector: {
                select: {
                    mode: "dropdown",
                    options: [
                        { value: "all", label: text("editor.direction_all") },
                        { value: "incoming", label: text("editor.direction_incoming") },
                        { value: "outgoing", label: text("editor.direction_outgoing") },
                    ],
                },
            },
        },
        {
            type: "grid",
            name: "",
            schema: [
                { name: "max_events", selector: { number: { min: 1, max: 50, step: 1, mode: "box" } } },
                { name: "max_sent_events", selector: { number: { min: 1, max: 50, step: 1, mode: "box" } } },
            ],
        },
        ...heightSchema(config, text),
        {
            name: "pickup_code",
            selector: {
                select: {
                    mode: "dropdown",
                    options: [
                        { value: "hidden", label: text("editor.pickup_code_hidden") },
                        { value: "always", label: text("editor.pickup_code_always") },
                        { value: "toggle", label: text("editor.pickup_code_toggle") },
                    ],
                },
            },
        },
        {
            name: "tracking_link",
            selector: {
                select: {
                    mode: "dropdown",
                    options: [
                        { value: "row", label: text("editor.tracking_link_row") },
                        { value: "number", label: text("editor.tracking_link_number") },
                        { value: "none", label: text("editor.tracking_link_none") },
                    ],
                },
            },
        },
        {
            type: "grid",
            name: "",
            schema: [
                { name: "show_progress", selector: { boolean: {} } },
                { name: "show_details", selector: { boolean: {} } },
                { name: "wrap_text", selector: { boolean: {} } },
                { name: "show_latest_event", selector: { boolean: {} } },
                { name: "show_latest_event_message", selector: { boolean: {} } },
                { name: "show_latest_event_location", selector: { boolean: {} } },
                { name: "show_origin", selector: { boolean: {} } },
                { name: "show_destination", selector: { boolean: {} } },
                { name: "show_pickup", selector: { boolean: {} } },
                { name: "show_sensors", selector: { boolean: {} } },
            ],
        },
    ];
}

@customElement("package-tracker-card-editor")
export class PackageTrackerCardEditor extends LitElement {
    @property({ attribute: false }) public hass?: HomeAssistant;
    @state() private config: PackageTrackerCardConfig = { type: "custom:package-tracker-card", entity: [] };

    public setConfig(config: PackageTrackerCardConfig): void {
        this.config = withTitle(config);
    }

    protected render(): TemplateResult | typeof nothing {
        if (!this.hass) {
            return nothing;
        }
        // One sensor named in YAML is a string; the picker works with a list.
        const entity = typeof this.config.entity === "string" ? [this.config.entity] : this.config.entity;
        // The form's options are text, and with none chosen in the configuration every status is shown.
        const statuses = (this.config.statuses?.length ? this.config.statuses : STATUSES).map(String);
        return html`
            <ha-form
                .hass=${this.hass}
                .data=${{ ...DEFAULTS, ...heightData(this.config), entity, statuses }}
                .schema=${schema(this.hass, this.config, (key) => this.text(key))}
                .computeLabel=${(entry: SchemaEntry) => this.text(`editor.${entry.name}`)}
                .computeHelper=${(entry: SchemaEntry) => this.helper(entry.name)}
                @value-changed=${this.valueChanged}
            ></ha-form>
        `;
    }

    private valueChanged(event: CustomEvent<{ value: PackageTrackerCardConfig }>): void {
        const config: PackageTrackerCardConfig = tidyHeight(event.detail.value);

        // Every status, or none at all, is the same as showing them all, which needs no setting.
        const chosen = (config.statuses ?? []).map(Number);
        const statuses = STATUSES.filter((status) => chosen.includes(status));
        if (statuses.length === 0 || statuses.length === STATUSES.length) {
            delete config.statuses;
        } else {
            config.statuses = statuses;
        }

        // An emptied number means "no limit", and an empty title means no title at all.
        for (const key of ["max_events", "max_sent_events", "title"] as const) {
            const value = config[key];
            if (value === undefined || value === null || String(value) === "") {
                delete config[key];
            }
        }
        // The defaults are shown in the form but left out of the configuration, so it stays short.
        for (const [key, value] of Object.entries(DEFAULTS)) {
            if (config[key] === value) {
                delete config[key];
            }
        }

        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
    }

    private text(key: string): string {
        return translate(this.language(), key);
    }

    private helper(name: string): string | undefined {
        const key = `editor.${name}_helper`;
        const helper = translate(this.language(), key);
        return helper === key ? undefined : helper;
    }

    private language(): string {
        return this.hass?.locale?.language ?? this.hass?.language ?? browserLanguage();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "package-tracker-card-editor": PackageTrackerCardEditor;
    }
}
