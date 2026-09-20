import { describe, expect, it } from 'vitest';

import {
  entities,
  formatDateTime,
  iconFor,
  missingEntities,
  packagesOf,
  sortPackages,
} from '../src/packages';
import type { HomeAssistant } from '../src/hass';
import type { Shipment } from '../src/types';

function shipment(values: Partial<Shipment> = {}): Shipment {
  return {
    shipment_number: 'JJFI1',
    shipment_date: '2026-09-13T16:58:24Z',
    status: 1,
    latest_event_date: '2026-09-13T16:58:24Z',
    ...values,
  };
}

function hass(states: Record<string, Shipment[] | undefined>): HomeAssistant {
  return {
    states: Object.fromEntries(
      Object.entries(states).map(([id, packages]) => [
        id,
        { entity_id: id, state: 'ok', last_changed: '', attributes: packages ? { packages } : {} },
      ]),
    ),
  };
}

describe('the sensors the card was given', () => {
  it('can be one or several', () => {
    expect(entities('sensor.a')).toEqual(['sensor.a']);
    expect(entities(['sensor.a', 'sensor.b'])).toEqual(['sensor.a', 'sensor.b']);
  });

  it('are gathered into one list of packages', () => {
    const state = hass({ 'sensor.a': [shipment()], 'sensor.b': [shipment({ shipment_number: 'MH2' })] });
    expect(packagesOf(state, ['sensor.a', 'sensor.b']).map((item) => item.shipment_number)).toEqual([
      'JJFI1',
      'MH2',
    ]);
  });

  it('are passed over when one of them is missing, instead of throwing', () => {
    const state = hass({ 'sensor.a': [shipment()] });
    expect(packagesOf(state, ['sensor.a', 'sensor.gone'])).toHaveLength(1);
    expect(missingEntities(state, ['sensor.a', 'sensor.gone'])).toEqual(['sensor.gone']);
  });

  it('are passed over when a sensor carries no packages at all', () => {
    expect(packagesOf(hass({ 'sensor.a': undefined }), 'sensor.a')).toEqual([]);
  });
});

describe('the order packages are listed in', () => {
  it('puts packages still on their way before delivered ones', () => {
    const packages = [
      shipment({ shipment_number: 'delivered', status: 0, latest_event_date: '2026-09-14T10:00:00Z' }),
      shipment({ shipment_number: 'moving', status: 3, latest_event_date: '2026-09-10T10:00:00Z' }),
    ];
    expect(sortPackages(packages).map((item) => item.shipment_number)).toEqual(['moving', 'delivered']);
  });

  it('puts the most recently moved first within each group', () => {
    const packages = [
      shipment({ shipment_number: 'older', status: 3, latest_event_date: '2026-09-10T10:00:00Z' }),
      shipment({ shipment_number: 'newer', status: 2, latest_event_date: '2026-09-14T10:00:00Z' }),
    ];
    expect(sortPackages(packages).map((item) => item.shipment_number)).toEqual(['newer', 'older']);
  });

  it('copes with a package that has no date yet', () => {
    const packages = [
      shipment({ shipment_number: 'dated', status: 3, latest_event_date: '2026-09-10T10:00:00Z' }),
      shipment({ shipment_number: 'undated', status: 3, latest_event_date: null }),
    ];
    expect(sortPackages(packages).map((item) => item.shipment_number)).toEqual(['dated', 'undated']);
  });

  it('leaves the given list alone', () => {
    const packages = [shipment({ status: 0 }), shipment({ shipment_number: 'b', status: 3 })];
    sortPackages(packages);
    expect(packages[0].status).toBe(0);
  });
});

describe('the icon of a status', () => {
  it('is the one of that status', () => {
    expect(iconFor(0)).toBe('mdi:checkbox-marked');
    expect(iconFor(3)).toBe('mdi:truck-delivery');
  });

  it('is a question mark for a status the card does not know', () => {
    expect(iconFor(42)).toBe('mdi:help-circle');
  });
});

describe('dates', () => {
  it('are written as the card has always written them', () => {
    const written = formatDateTime('2026-09-13T16:58:24Z');
    expect(written).toMatch(/^2026-09-\d\d \d\d:\d\d$/);
  });

  it('are left out when there is no date', () => {
    expect(formatDateTime(null)).toBe('');
    expect(formatDateTime(undefined)).toBe('');
    expect(formatDateTime('not a date')).toBe('');
  });
});
