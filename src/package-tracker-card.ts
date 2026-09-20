/**
 * A dashboard card that lists the packages on their way to you, from the
 * posti_tracking and matkahuolto_tracking integrations. Packages still moving
 * are listed first, finished ones last.
 *
 * Each package is one row: where it has got to, as a bar, and the latest thing
 * that happened to it. Clicking it opens the carrier's own page for it.
 */
import { LitElement, css, html, nothing } from 'lit';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { CARD_VERSION, FINISHED } from './const';
import './editor';
import type { HomeAssistant } from './hass';
import { browserLanguage, translate } from './localize/localize';
import {
  entities,
  formatDateTime,
  iconFor,
  missingEntities,
  packagesOf,
  progressOf,
  sortPackages,
  trackingUrl,
} from './packages';
import type { PackageTrackerCardConfig, Shipment } from './types';

console.info(
  `%c  PACKAGE-TRACKER-CARD \n%c  ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

interface CardRegistration {
  type: string;
  name: string;
  description: string;
  documentationURL?: string;
  preview?: boolean;
}

const registry = window as unknown as { customCards?: CardRegistration[] };
registry.customCards = registry.customCards ?? [];
registry.customCards.push({
  type: 'package-tracker-card',
  name: translate(browserLanguage(), 'common.name'),
  description: translate(browserLanguage(), 'common.description'),
  documentationURL: 'https://github.com/jesmak/package-tracker-card',
  preview: true,
});

@customElement('package-tracker-card')
export class PackageTrackerCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: PackageTrackerCardConfig;

  public static getConfigElement(): HTMLElement {
    return document.createElement('package-tracker-card-editor');
  }

  /** Offers the tracking sensors that are there when the card is added from the picker. */
  public static getStubConfig(hass?: HomeAssistant): Record<string, unknown> {
    const found = Object.keys(hass?.states ?? {}).filter((id) =>
      Array.isArray(hass?.states[id]?.attributes?.packages),
    );
    return { entity: found };
  }

  public setConfig(config: PackageTrackerCardConfig): void {
    if (!config || !config.entity || (Array.isArray(config.entity) && config.entity.length === 0)) {
      throw new Error(translate(browserLanguage(), 'common.invalid_configuration'));
    }
    this.config = { ...config };
  }

  public getCardSize(): number {
    const packages = this.hass && this.config ? packagesOf(this.hass, this.config.entity) : [];
    return 1 + Math.min(packages.length, this.config?.max_events ?? packages.length) * 2;
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.has('config') || !this.config) {
      return true;
    }
    const previous = changed.get('hass') as HomeAssistant | undefined;
    if (!previous) {
      return true;
    }
    // Redraw when any of the sensors the card was given has changed.
    return entities(this.config.entity).some((id) => previous.states[id] !== this.hass?.states[id]);
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.config) {
      return nothing;
    }

    const missing = missingEntities(this.hass, this.config.entity);
    if (missing.length === entities(this.config.entity).length) {
      this.toggleAttribute('hidden', false);
      return html`<ha-card
        ><div class="message">${this.text('common.no_entity')} ${missing.join(', ')}</div></ha-card
      >`;
    }

    let packages = sortPackages(packagesOf(this.hass, this.config.entity));
    if (this.config.max_events !== undefined && this.config.max_events < packages.length) {
      packages = packages.slice(0, this.config.max_events);
    }

    // Nothing to track: either say so, or leave the card out of the dashboard entirely.
    const hide = packages.length === 0 && this.config.hide_when_nothing_to_show === true;
    this.toggleAttribute('hidden', hide);
    if (hide) {
      return nothing;
    }

    const title = this.config.title ?? this.config.name;

    return html`
      <ha-card style="${this.heights()}">
        ${title ? html`<div class="header">${title}</div>` : nothing}
        <div class="list">
          ${
            packages.length === 0
              ? html`<div class="no-packages">${this.text('common.no_packages')}</div>`
              : repeat(
                  packages,
                  (item) => item.shipment_number,
                  (item) => this.shipment(item),
                )
          }
        </div>
      </ha-card>
    `;
  }

  /** A fixed height, a limit, or neither. The list scrolls inside whatever the card gets. */
  private heights(): string {
    const { height, max_height: maxHeight } = this.config ?? {};
    return [
      height === undefined ? '' : `height:${height}px;`,
      maxHeight === undefined ? '' : `max-height:${maxHeight}px;`,
    ].join('');
  }

  private shipment(item: Shipment): TemplateResult {
    const moving = !FINISHED.includes(item.status);
    const url = trackingUrl(item);
    return html`
      <div
        class="item status-${item.status} ${url ? 'clickable' : ''}"
        @click=${() => this.openTracking(url)}
        title="${url ?? ''}"
      >
        <div class="line">
          <ha-icon icon="${iconFor(item.status)}"></ha-icon>
          <span class="number">${item.shipment_number}</span>
          ${item.source ? html`<span class="source">${item.source}</span>` : nothing}
        </div>
        ${this.progress(item)}
        ${this.row('mdi:text-box', this.config?.show_latest_event_message, moving, [item.latest_event])}
        ${this.row('mdi:map-marker', this.config?.show_latest_event_location, moving, [item.latest_event_city])}
        ${this.row('mdi:arrow-up-bold-box', this.config?.show_origin, true, [
          item.origin || item.origin_city,
          item.shipment_date ? ` (${formatDateTime(item.shipment_date)})` : '',
        ])}
        ${this.row('mdi:arrow-down-bold-box', this.config?.show_destination, true, [
          item.destination || item.destination_city,
        ])}
      </div>
    `;
  }

  /** How far the package has got, with its status and when it last moved. */
  private progress(item: Shipment): TemplateResult | typeof nothing {
    if (this.config?.show_latest_event === false && this.config?.show_progress === false) {
      return nothing;
    }
    const percent = (progressOf(item.status) * 100).toFixed(0);
    return html`
      <div class="progress-row">
        ${
          this.config?.show_progress === false
            ? nothing
            : html`<div
                class="track"
                role="progressbar"
                aria-valuenow="${percent}"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div class="bar" style="width:${percent}%"></div>
              </div>`
        }
        ${
          this.config?.show_latest_event === false
            ? nothing
            : html`<span class="status-text">${this.text(`statuses.${item.status}`)}</span>
                <span class="when">${formatDateTime(item.latest_event_date)}</span>`
        }
      </div>
    `;
  }

  /** A line of the package, left out when the configuration hides it or there is nothing to write. */
  private row(
    icon: string,
    shown: boolean | undefined,
    relevant: boolean,
    parts: Array<string | null | undefined>,
  ): TemplateResult | typeof nothing {
    const text = parts.filter((part) => part !== null && part !== undefined && part !== '').join('');
    if (shown === false || !relevant || text === '') {
      return nothing;
    }
    return html`
      <div class="row secondary">
        <ha-icon icon="${icon}"></ha-icon>
        <div class="text-content">${text}</div>
      </div>
    `;
  }

  private openTracking(url: string | undefined): void {
    if (url) {
      window.open(url, '_blank', 'noopener');
    }
  }

  private text(key: string): string {
    return translate(this.language(), key);
  }

  private language(): string {
    return this.hass?.locale?.language ?? this.hass?.language ?? browserLanguage();
  }

  static get styles(): CSSResultGroup {
    return css`
      :host([hidden]) {
        display: none;
      }

      /* The header stays put and the packages scroll under it, so a card given a
         height never spills its text outside. */
      ha-card {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 12px;
      }

      .header {
        flex: 0 0 auto;
        font-size: var(--ha-card-header-font-size, 24px);
        line-height: 1.2;
        padding: 4px 4px 12px 4px;
      }

      .list {
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .no-packages,
      .message {
        color: var(--secondary-text-color);
        padding: 4px;
      }

      .item {
        border-radius: 8px;
        padding: 6px;
        background: var(--secondary-background-color, transparent);
      }

      .item.clickable {
        cursor: pointer;
      }

      .item.clickable:hover {
        background: var(--divider-color, var(--secondary-background-color));
      }

      .line {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }

      .number {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Which service the package came from, small and out of the way. */
      .source {
        margin-left: auto;
        flex: 0 0 auto;
        font-size: 11px;
        color: var(--secondary-text-color);
        border: 1px solid var(--divider-color, var(--secondary-text-color));
        border-radius: 999px;
        padding: 0 6px;
      }

      /* The bar keeps the height of a row of text, so hiding the status doesn't
         change how tall a package is, and it lines up with the icons above and below. */
      .progress-row {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 18px;
        margin: 4px 0 2px 0;
        padding: 0 2px;
      }

      .track {
        flex: 1 1 auto;
        height: 4px;
        border-radius: 2px;
        background: var(--divider-color, #ddd);
        overflow: hidden;
      }

      .bar {
        height: 100%;
        border-radius: 2px;
        background: currentColor;
      }

      .status-text {
        flex: 0 0 auto;
        font-size: 12px;
        line-height: 1;
        font-weight: 600;
      }

      .when {
        flex: 0 0 auto;
        font-size: 12px;
        line-height: 1;
        color: var(--secondary-text-color);
      }

      .row {
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
      }

      .row.secondary {
        color: var(--secondary-text-color);
        font-size: 12px;
        line-height: 16px;
      }

      /* The icon is a box of its own, so its middle lines up with the middle of the text. */
      .row.secondary ha-icon {
        --mdc-icon-size: 16px;
        flex: 0 0 auto;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .text-content {
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* The status colours the icon, the bar and the status text of a package. */
      .item {
        color: var(--primary-text-color);
      }

      .status-1,
      .status-2 {
        color: var(--info-color, cornflowerblue);
      }

      .status-3,
      .status-4 {
        color: var(--state-icon-color, #44739e);
      }

      .status-5 {
        color: var(--success-color, #43a047);
      }

      .status-0 {
        color: var(--secondary-text-color);
      }

      .status-6,
      .status-7 {
        color: var(--error-color, #db4437);
      }

      .item .number,
      .item .text-content {
        color: var(--primary-text-color);
      }

      .status-0 .number {
        color: var(--secondary-text-color);
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'package-tracker-card': PackageTrackerCard;
  }
}
