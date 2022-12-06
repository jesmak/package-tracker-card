/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, PropertyValues, CSSResultGroup } from 'lit';
import { repeat } from 'lit-html/directives/repeat';
import { customElement, property, state } from 'lit/decorators';
import { HomeAssistant, hasConfigOrEntityChanged } from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types. https://github.com/custom-cards/custom-card-helpers

import type { PackageTrackerCardConfig, Shipment } from './types';
import { CARD_VERSION } from './const';
import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
  `%c  PACKAGE-TRACKER-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

const icons = [
  'mdi:checkbox-marked',
  'mdi:file-document',
  'mdi:clock',
  'mdi:truck-delivery',
  'mdi:human-dolly',
  'mdi:check-decagram',
  'mdi:arrow-u-left-top-bold',
  'mdi:help-circle',
];

function formatDateTime(timestamp: Date) {
  return (
    timestamp.getFullYear() +
    '-' +
    pad(timestamp.getMonth() + 1) +
    '-' +
    pad(timestamp.getDate()) +
    ' ' +
    pad(timestamp.getHours()) +
    ':' +
    pad(timestamp.getMinutes())
  );
}

function pad(value: number): string {
  return value < 10 ? '0' + value : String(value);
}

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'package-tracker-card',
  name: localize('common.name'),
  description: localize('common.description'),
});

@customElement('package-tracker-card')
export class PackageTrackerCard extends LitElement {
  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  @property() public hass!: HomeAssistant;
  @state() private config!: PackageTrackerCardConfig;

  public setConfig(config: PackageTrackerCardConfig): void {
    if (!config || !config.entity) {
      throw new Error(localize('common.invalid_configuration'));
    }

    this.config = {
      name: localize('common.name'),
      ...config,
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  protected render(): TemplateResult | void {
    const stateObj = this.hass.states[this.config.entity];
    const packages: Shipment[] = stateObj.attributes['packages'];

    return html`
      <ha-card>
        <div class="header">${this.config.title}</div>
        ${repeat(
          packages,
          (item) => item.shipment_number,
          (item: Shipment) =>
            html`
              <div class="item">
                <div class="row">
                  <ha-icon icon="${icons[item.status]}" class="status-${item.status}"></ha-icon>
                  <div>
                    <div class="tracking-number">${item.shipment_number}</div>
                  </div>
                </div>
                <div class="row secondary ${this.config.show_latest_event === false ? 'hidden' : ''}">
                  <ha-icon icon="mdi:calendar"></ha-icon>
                  <div>
                    ${localize('statuses.' + item.status)} (${formatDateTime(new Date(item.latest_event_date))})
                  </div>
                </div>
                <div
                  class="row secondary ${this.config.show_latest_event_message === false ||
                  !item.latest_event ||
                  item.status === 0
                    ? 'hidden'
                    : ''}"
                >
                  <ha-icon icon="mdi:text-box"></ha-icon>
                  <div>${item.latest_event}</div>
                </div>
                <div
                  class="row secondary ${this.config.show_latest_event_location === false ||
                  !item.latest_event_city ||
                  item.status === 0
                    ? 'hidden'
                    : ''}"
                >
                  <ha-icon icon="mdi:map-marker"></ha-icon>
                  <div>${item.latest_event_city}</div>
                </div>
                <div class="row secondary ${this.config.show_origin === false ? 'hidden' : ''}">
                  <ha-icon icon="mdi:arrow-up-bold-box"></ha-icon>
                  <div>${item.origin || item.origin_city} (${formatDateTime(new Date(item.shipment_date))})</div>
                </div>
                <div class="row secondary ${this.config.show_destination === false ? 'hidden' : ''}">
                  <ha-icon icon="mdi:arrow-down-bold-box"></ha-icon>
                  <div>${item.destination || item.destination_city}</div>
                </div>
              </div>
            `,
        )}
        ${packages.length === 0 ? html` <div class="no-packages">${localize('common.no_packages')}</div> ` : null}
      </ha-card>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      .header {
        font-size: 24px;
        margin: 20px 20px 30px 12px;
      }

      .tracking-number {
        font-size: 16px;
      }

      .no-packages {
        font-size: 16px;
        margin: 12px;
      }

      .hidden {
        display: none;
      }

      ha-card {
        padding: 10px;
      }

      ha-icon {
        margin-right: 3px;
      }

      ha-svg-icon {
        display: block;
      }

      .status-0,
      .row.secondary {
        color: grey;
      }

      .status-1,
      .status-2 {
        color: conrflowerblue;
      }

      .status-3,
      .status-4,
      .status-5 {
        color: green;
      }

      .status-6,
      .status-7 {
        color: red;
      }

      .row > * {
        display: inline-block;
        vertical-align: middle;
      }

      .row.secondary {
        margin-left: 4px;
        font-size: 12px;
        line-height: 16px;
      }

      .row.secondary ha-icon {
        --mdc-icon-size: 16px;
      }

      .item {
        margin: 10px;
      }
    `;
  }
}
