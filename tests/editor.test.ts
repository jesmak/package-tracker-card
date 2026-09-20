import { beforeEach, describe, expect, it } from 'vitest';

import { trackingEntities } from '../src/editor';
import type { PackageTrackerCardEditor } from '../src/editor';
import type { HomeAssistant } from '../src/hass';
import type { PackageTrackerCardConfig } from '../src/types';

const hass: HomeAssistant = {
  locale: { language: 'fi' },
  states: {
    'sensor.posti_omaposti': {
      entity_id: 'sensor.posti_omaposti',
      state: '2026-09-16T08:00:00+00:00',
      last_changed: '2026-09-16',
      attributes: { packages: [] },
    },
    'sensor.matkahuolto_account': {
      entity_id: 'sensor.matkahuolto_account',
      state: '2026-09-16T08:00:00+00:00',
      last_changed: '2026-09-16',
      attributes: { packages: [] },
    },
    'sensor.kitchen': {
      entity_id: 'sensor.kitchen',
      state: '21',
      last_changed: '2026-09-16',
      attributes: {},
    },
  },
};

async function editor(config: Partial<PackageTrackerCardConfig> = {}): Promise<PackageTrackerCardEditor> {
  const element = document.createElement('package-tracker-card-editor') as PackageTrackerCardEditor;
  element.setConfig({
    type: 'custom:package-tracker-card',
    entity: ['sensor.posti_omaposti'],
    ...config,
  } as never);
  element.hass = hass;
  document.body.append(element);
  await element.updateComplete;
  return element;
}

function form(
  element: PackageTrackerCardEditor,
): HTMLElement & { schema: Array<Record<string, unknown>>; data: Record<string, unknown> } {
  const found = element.shadowRoot?.querySelector('ha-form');
  if (!found) {
    throw new Error('the editor rendered no form');
  }
  return found as HTMLElement & { schema: Array<Record<string, unknown>>; data: Record<string, unknown> };
}

function changesOf(element: PackageTrackerCardEditor): PackageTrackerCardConfig[] {
  const changes: PackageTrackerCardConfig[] = [];
  element.addEventListener('config-changed', (event) => {
    changes.push((event as CustomEvent<{ config: PackageTrackerCardConfig }>).detail.config);
  });
  return changes;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('the visual editor', () => {
  it('offers the sensors that carry packages, whatever they are called', () => {
    expect(trackingEntities(hass)).toEqual(['sensor.matkahuolto_account', 'sensor.posti_omaposti']);
  });

  it('asks for the sensors, a title, the sizes and the lines', async () => {
    const schema = form(await editor()).schema;
    expect(schema[0].name).toBe('entity');
    expect(schema[1].name).toBe('title');
    const names = schema.flatMap((entry) =>
      Array.isArray(entry.schema)
        ? (entry.schema as Array<{ name: string }>).map((inner) => inner.name)
        : [entry.name],
    );
    expect(names).toContain('height');
    expect(names).toContain('max_height');
    expect(names).toContain('show_progress');
  });

  it('shows one sensor as a list, the way the picker works', async () => {
    expect(form(await editor({ entity: 'sensor.posti_omaposti' })).data.entity).toEqual([
      'sensor.posti_omaposti',
    ]);
  });

  it('keeps the defaults and the empty fields out of the configuration', async () => {
    const element = await editor();
    const changes = changesOf(element);
    form(element).dispatchEvent(
      new CustomEvent('value-changed', {
        detail: {
          value: {
            type: 'custom:package-tracker-card',
            entity: ['sensor.posti_omaposti'],
            title: '',
            height: null,
            max_height: 300,
            show_progress: true,
            show_origin: false,
          },
        },
      }),
    );
    expect(changes[0]).toEqual({
      type: 'custom:package-tracker-card',
      entity: ['sensor.posti_omaposti'],
      max_height: 300,
      show_origin: false,
    });
  });
});
