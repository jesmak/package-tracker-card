import { FINISHED, PROGRESS, TRACKING_URLS, UNKNOWN } from './const';
import type { HomeAssistant } from './hass';
import type { Shipment } from './types';

/** One icon per status, in the order the tracking integrations number them. */
const ICONS = [
  'mdi:checkbox-marked',
  'mdi:file-document',
  'mdi:clock',
  'mdi:truck-delivery',
  'mdi:human-dolly',
  'mdi:check-decagram',
  'mdi:arrow-u-left-top-bold',
  'mdi:help-circle',
];
const UNKNOWN_ICON = 'mdi:help-circle';

export function entities(entity: string | string[]): string[] {
  return typeof entity === 'string' ? [entity] : entity;
}

/** The packages of every sensor the card was given. Sensors that aren't there are passed over. */
export function packagesOf(hass: HomeAssistant, entity: string | string[]): Shipment[] {
  const found: Shipment[] = [];
  for (const id of entities(entity)) {
    const packages = hass.states[id]?.attributes?.packages;
    if (Array.isArray(packages)) {
      found.push(...(packages as Shipment[]));
    }
  }
  return found;
}

/** Sensors named in the configuration that Home Assistant doesn't have. */
export function missingEntities(hass: HomeAssistant, entity: string | string[]): string[] {
  return entities(entity).filter((id) => hass.states[id] === undefined);
}

/** Packages still on their way come first, and the most recently moved of them at the top. */
export function sortPackages(packages: Shipment[]): Shipment[] {
  return [...packages].sort((one, other) => {
    const oneDone = FINISHED.includes(one.status);
    const otherDone = FINISHED.includes(other.status);
    if (oneDone !== otherDone) {
      return oneDone ? 1 : -1;
    }
    return moment(other.latest_event_date) - moment(one.latest_event_date);
  });
}

function moment(date: string | null | undefined): number {
  const parsed = date ? Date.parse(date) : NaN;
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function iconFor(status: number): string {
  return ICONS[status] ?? UNKNOWN_ICON;
}

/** A date and time as the card has always written it: 2026-09-13 19:58 in the viewer's own time. */
export function formatDateTime(date: string | null | undefined): string {
  const parsed = date ? new Date(date) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return '';
  }
  const pad = (value: number) => String(value).padStart(2, '0');
  return (
    `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())} ` +
    `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`
  );
}

/** How far along a package is, between 0 and 1. */
export function progressOf(status: number): number {
  return PROGRESS[status] ?? PROGRESS[UNKNOWN];
}

/** The carrier's own page for a package, or nothing when its source isn't known. */
export function trackingUrl(item: Shipment): string | undefined {
  const pattern = TRACKING_URLS[String(item.source ?? '').toLowerCase()];
  if (!pattern || !item.shipment_number) {
    return undefined;
  }
  return pattern.replace('{number}', encodeURIComponent(item.shipment_number));
}
