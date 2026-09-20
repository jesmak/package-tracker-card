import { beforeEach, describe, expect, it, vi } from 'vitest';

import '../src/package-tracker-card';
import type { PackageTrackerCard } from '../src/package-tracker-card';
import type { HomeAssistant } from '../src/hass';
import type { PackageTrackerCardConfig, Shipment } from '../src/types';

const POSTI = 'sensor.posti_omaposti';
const MATKAHUOLTO = 'sensor.matkahuolto';

// A package shaped like the ones posti_tracking writes, with made-up details.
const WAITING: Shipment = {
  shipment_number: 'JJFI0001',
  shipment_date: '2026-09-16T08:00:00Z',
  status: 1,
  raw_status: 'WAITING',
  origin: 'Example Shop',
  origin_city: 'HELSINKI',
  destination: 'Postin automaatti',
  destination_city: 'TAMPERE',
  latest_event: 'Olemme saaneet lähettäjältä tiedon tulevasta lähetyksestä',
  latest_event_city: null,
  latest_event_country: 'FI',
  latest_event_date: '2026-09-16T08:00:00Z',
  source: 'Posti',
};

function hass(
  packages: Record<string, Shipment[]> = { [POSTI]: [WAITING], [MATKAHUOLTO]: [] },
): HomeAssistant {
  return {
    locale: { language: 'fi' },
    states: Object.fromEntries(
      Object.entries(packages).map(([id, list]) => [
        id,
        {
          entity_id: id,
          state: '2026-09-16T08:00:00+00:00',
          last_changed: '2026-09-16',
          attributes: { packages: list },
        },
      ]),
    ),
  };
}

async function card(
  state: HomeAssistant,
  config: Partial<PackageTrackerCardConfig> = {},
): Promise<PackageTrackerCard> {
  const element = document.createElement('package-tracker-card') as PackageTrackerCard;
  element.setConfig({
    type: 'custom:package-tracker-card',
    entity: [POSTI, MATKAHUOLTO],
    ...config,
  } as never);
  element.hass = state;
  document.body.append(element);
  await element.updateComplete;
  return element;
}

function shadow(element: PackageTrackerCard): ShadowRoot {
  const root = element.shadowRoot;
  if (!root) {
    throw new Error('the card rendered nothing');
  }
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('the list of packages', () => {
  it('shows a package with its number, status and places', async () => {
    const root = shadow(await card(hass()));
    expect(root.querySelectorAll('.item')).toHaveLength(1);
    expect(root.querySelector('.number')?.textContent).toContain('JJFI0001');
    expect(root.textContent).toContain('Odottaa');
    expect(root.textContent).toContain('Example Shop');
    expect(root.textContent).toContain('Postin automaatti');
  });

  it('gathers the packages of every sensor it was given', async () => {
    const other: Shipment = { ...WAITING, shipment_number: 'MH-2', status: 3 };
    const root = shadow(await card(hass({ [POSTI]: [WAITING], [MATKAHUOLTO]: [other] })));
    expect(root.querySelectorAll('.item')).toHaveLength(2);
  });

  it('lists at most as many as max_events asks for', async () => {
    const packages = [1, 2, 3, 4].map((n) => ({ ...WAITING, shipment_number: `P${n}` }));
    const root = shadow(await card(hass({ [POSTI]: packages }), { max_events: 2 }));
    expect(root.querySelectorAll('.item')).toHaveLength(2);
  });

  it('leaves out a line the configuration hides', async () => {
    const root = shadow(await card(hass(), { show_destination: false }));
    expect(root.textContent).not.toContain('Postin automaatti');
    expect(root.textContent).toContain('Example Shop');
  });

  it('leaves out a line the package has nothing for', async () => {
    // This package has no place for its latest event, and the row would be empty.
    const root = shadow(await card(hass()));
    expect(root.textContent).not.toContain('null');
    expect(root.textContent).not.toContain('undefined');
  });
});

describe('the title', () => {
  it('is shown when the configuration gives one', async () => {
    const root = shadow(await card(hass(), { title: 'Lähetykset' }));
    expect(root.querySelector('.header')?.textContent).toContain('Lähetykset');
  });

  it('is taken from name as well, as older versions documented it', async () => {
    const root = shadow(await card(hass(), { name: 'Paketit' }));
    expect(root.querySelector('.header')?.textContent).toContain('Paketit');
  });

  it('leaves no empty header when there is no title', async () => {
    const root = shadow(await card(hass()));
    expect(root.querySelector('.header')).toBeNull();
  });
});

describe('when there is nothing to track', () => {
  it('says so', async () => {
    const root = shadow(await card(hass({ [POSTI]: [], [MATKAHUOLTO]: [] })));
    expect(root.querySelector('.no-packages')?.textContent).toContain('Ei seurattavia paketteja');
  });

  it('hides the card entirely when asked to', async () => {
    const element = await card(hass({ [POSTI]: [], [MATKAHUOLTO]: [] }), { hide_when_nothing_to_show: true });
    expect(element.hasAttribute('hidden')).toBe(true);
    expect(shadow(element).querySelector('ha-card')).toBeNull();
  });

  it('comes back when a package arrives', async () => {
    const element = await card(hass({ [POSTI]: [], [MATKAHUOLTO]: [] }), { hide_when_nothing_to_show: true });
    expect(element.hasAttribute('hidden')).toBe(true);

    element.hass = hass({ [POSTI]: [WAITING], [MATKAHUOLTO]: [] });
    await element.updateComplete;

    expect(element.hasAttribute('hidden')).toBe(false);
    expect(shadow(element).querySelectorAll('.item')).toHaveLength(1);
  });
});

describe('when the configuration is wrong', () => {
  it('refuses a configuration without an entity', () => {
    const element = document.createElement('package-tracker-card') as PackageTrackerCard;
    expect(() => element.setConfig({ type: 'custom:package-tracker-card' } as never)).toThrow();
    expect(() => element.setConfig({ type: 'custom:package-tracker-card', entity: [] } as never)).toThrow();
  });

  it('says which entity is missing instead of throwing', async () => {
    const root = shadow(await card(hass({}), { entity: 'sensor.gone' }));
    expect(root.querySelector('.message')?.textContent).toContain('sensor.gone');
  });

  it('still lists the packages of the sensors that are there', async () => {
    const root = shadow(await card(hass({ [POSTI]: [WAITING] }), { entity: [POSTI, 'sensor.gone'] }));
    expect(root.querySelectorAll('.item')).toHaveLength(1);
  });
});

describe('how far a package has got', () => {
  it('draws a bar and the time since it last moved', async () => {
    const root = shadow(await card(hass()));
    const bar = root.querySelector('.bar') as HTMLElement;
    expect(bar.getAttribute('style')).toContain('width:8%');
    expect(root.querySelector('.track')?.getAttribute('aria-valuenow')).toBe('8');
    expect(root.querySelector('.status-text')?.textContent?.trim()).toBe('Odottaa');
    expect(root.querySelector('.when')?.textContent?.trim()).toMatch(/^2026-09-16 \d\d:\d\d$/);
  });

  it('fills the bar for a delivered package', async () => {
    const delivered = { ...WAITING, status: 0 };
    const root = shadow(await card(hass({ [POSTI]: [delivered] })));
    expect((root.querySelector('.bar') as HTMLElement).getAttribute('style')).toContain('width:100%');
  });

  it('is left out when the configuration hides it', async () => {
    const root = shadow(await card(hass(), { show_progress: false, show_latest_event: false }));
    expect(root.querySelector('.progress-row')).toBeNull();
  });
});

describe('opening a package', () => {
  it('opens the carrier the package came from', async () => {
    const opened: string[] = [];
    const openWindow = vi.spyOn(window, 'open').mockImplementation((url) => {
      opened.push(String(url));
      return null;
    });
    const mh = { ...WAITING, shipment_number: '70012345678', source: 'Matkahuolto' };
    const root = shadow(await card(hass({ [POSTI]: [WAITING], [MATKAHUOLTO]: [mh] })));

    const items = [...root.querySelectorAll('.item')] as HTMLElement[];
    items.forEach((item) => item.dispatchEvent(new Event('click')));

    expect(opened).toEqual([
      'https://www.posti.fi/fi/seuranta#/lahetys/JJFI0001',
      'https://www.matkahuolto.fi/seuranta?parcelNumber=70012345678',
    ]);
    openWindow.mockRestore();
  });

  it('stays put for a package of an unknown source', async () => {
    const openWindow = vi.spyOn(window, 'open').mockImplementation(() => null);
    const root = shadow(await card(hass({ [POSTI]: [{ ...WAITING, source: null }] })));
    const item = root.querySelector('.item') as HTMLElement;

    expect(item.classList.contains('clickable')).toBe(false);
    item.dispatchEvent(new Event('click'));
    expect(openWindow).not.toHaveBeenCalled();
    openWindow.mockRestore();
  });
});

describe('the size of the card', () => {
  it('takes a fixed height, and scrolls the packages inside it', async () => {
    const root = shadow(await card(hass(), { height: 300 }));
    expect((root.querySelector('ha-card') as HTMLElement).getAttribute('style')).toBe('height:300px;');
  });

  it('takes a height it never grows past', async () => {
    const root = shadow(await card(hass(), { max_height: 240 }));
    expect((root.querySelector('ha-card') as HTMLElement).getAttribute('style')).toBe('max-height:240px;');
  });

  it('follows its packages when neither is given', async () => {
    const root = shadow(await card(hass()));
    expect((root.querySelector('ha-card') as HTMLElement).getAttribute('style')).toBe('');
  });

  it('keeps the list scrollable, whatever height the card ends up with', async () => {
    const { PackageTrackerCard } = await import('../src/package-tracker-card');
    const styles = String((PackageTrackerCard as unknown as { styles: { cssText: string } }).styles.cssText);
    expect(styles).toContain('overflow-y: auto');
    expect(styles).toContain('min-height: 0');
    // The header used to sit in a 20px margin; it doesn't any more.
    expect(styles).not.toContain('margin: 20px 20px 30px 12px');
  });
});

describe('where a package came from', () => {
  it('is named on the package', async () => {
    const root = shadow(await card(hass()));
    expect(root.querySelector('.source')?.textContent?.trim()).toBe('Posti');
  });
});
