/**
 * The card's visual editor: the tracking sensors, the title, how many packages
 * are listed, the card's height, and which lines a package shows.
 */
import { LitElement, html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { HomeAssistant } from './hass';
import { browserLanguage, translate } from './localize/localize';
import type { PackageTrackerCardConfig } from './types';

interface SchemaEntry {
  name: string;
}

const DEFAULTS: Record<string, unknown> = {
  show_progress: true,
  show_latest_event: true,
  show_latest_event_message: true,
  show_latest_event_location: true,
  show_origin: true,
  show_destination: true,
  hide_when_nothing_to_show: false,
};

/** The sensors that carry packages: the tracking integrations write them, whatever they are called. */
export function trackingEntities(hass: HomeAssistant): string[] {
  return Object.keys(hass.states)
    .filter((id) => Array.isArray(hass.states[id]?.attributes?.packages))
    .sort();
}

function schema(hass: HomeAssistant) {
  return [
    {
      name: 'entity',
      required: true,
      selector: { entity: { multiple: true, include_entities: trackingEntities(hass) } },
    },
    { name: 'title', selector: { text: {} } },
    {
      type: 'grid',
      name: '',
      schema: [
        { name: 'max_events', selector: { number: { min: 1, max: 50, step: 1, mode: 'box' } } },
        {
          name: 'height',
          selector: { number: { min: 100, max: 1200, step: 10, unit_of_measurement: 'px', mode: 'box' } },
        },
        {
          name: 'max_height',
          selector: { number: { min: 100, max: 1200, step: 10, unit_of_measurement: 'px', mode: 'box' } },
        },
      ],
    },
    {
      type: 'grid',
      name: '',
      schema: [
        { name: 'show_progress', selector: { boolean: {} } },
        { name: 'show_latest_event', selector: { boolean: {} } },
        { name: 'show_latest_event_message', selector: { boolean: {} } },
        { name: 'show_latest_event_location', selector: { boolean: {} } },
        { name: 'show_origin', selector: { boolean: {} } },
        { name: 'show_destination', selector: { boolean: {} } },
        { name: 'hide_when_nothing_to_show', selector: { boolean: {} } },
      ],
    },
  ];
}

@customElement('package-tracker-card-editor')
export class PackageTrackerCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config: PackageTrackerCardConfig = { type: 'custom:package-tracker-card', entity: [] };

  public setConfig(config: PackageTrackerCardConfig): void {
    this.config = { ...config };
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass) {
      return nothing;
    }
    // One sensor named in YAML is a string; the picker works with a list.
    const entity = typeof this.config.entity === 'string' ? [this.config.entity] : this.config.entity;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{ ...DEFAULTS, ...this.config, entity }}
        .schema=${schema(this.hass)}
        .computeLabel=${(entry: SchemaEntry) => this.text(`editor.${entry.name}`)}
        .computeHelper=${(entry: SchemaEntry) => this.helper(entry.name)}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }

  private valueChanged(event: CustomEvent<{ value: PackageTrackerCardConfig }>): void {
    const config: PackageTrackerCardConfig = { ...event.detail.value };

    // An emptied number means "no limit", and an empty title means no title at all.
    for (const key of ['max_events', 'height', 'max_height', 'title'] as const) {
      const value = config[key];
      if (value === undefined || value === null || String(value) === '') {
        delete config[key];
      }
    }
    // The defaults are shown in the form but left out of the configuration, so it stays short.
    for (const [key, value] of Object.entries(DEFAULTS)) {
      if (config[key] === value) {
        delete config[key];
      }
    }

    this.dispatchEvent(
      new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }),
    );
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
    'package-tracker-card-editor': PackageTrackerCardEditor;
  }
}
