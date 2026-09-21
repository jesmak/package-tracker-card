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
  tracking_url: 'https://carrier.example.com/track/JJFI0001',
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
  it('opens the page the integration gives for the package', async () => {
    const opened: string[] = [];
    const openWindow = vi.spyOn(window, 'open').mockImplementation((url) => {
      opened.push(String(url));
      return null;
    });
    const other = {
      ...WAITING,
      shipment_number: '70012345678',
      source: 'Another Carrier',
      tracking_url: 'https://other.example.net/?parcel=70012345678',
    };
    const root = shadow(await card(hass({ [POSTI]: [WAITING], [MATKAHUOLTO]: [other] })));

    const items = [...root.querySelectorAll('.item')] as HTMLElement[];
    items.forEach((item) => item.dispatchEvent(new Event('click')));

    expect(opened).toEqual([
      'https://carrier.example.com/track/JJFI0001',
      'https://other.example.net/?parcel=70012345678',
    ]);
    openWindow.mockRestore();
  });

  it.each([
    ['no tracking_url', undefined],
    ['an empty one', ''],
    ['a script', 'javascript:alert(1)'],
    ['something that is no address', 'not a url'],
  ])('stays put for a package with %s', async (_what, url) => {
    const openWindow = vi.spyOn(window, 'open').mockImplementation(() => null);
    const root = shadow(await card(hass({ [POSTI]: [{ ...WAITING, tracking_url: url }] })));
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

describe('the destination line', () => {
  const waiting = (extra: Partial<Shipment> = {}): Shipment => ({
    ...WAITING,
    status: 5,
    pickup_deadline: '2026-09-23T20:59:00Z',
    estimated_delivery: '2026-09-17T07:00:00Z',
    pickup_point: { name: 'K-Market Keskusta', city: 'TAMPERE' },
    ...extra,
  });

  // The package's own line is the last of the secondary rows.
  const line = (root: ShadowRoot | DocumentFragment): Element => {
    const rows = root.querySelectorAll('.row.secondary');
    return rows[rows.length - 1];
  };

  it('shows the pickup point and the deadline once a package is waiting', async () => {
    const root = shadow(await card(hass({ [POSTI]: [waiting()] })));
    expect(line(root).textContent).toContain('K-Market Keskusta, TAMPERE');
    expect(line(root).textContent).toContain('Nouda viimeistään 2026-09-23');
    expect(line(root).textContent).not.toContain('Arvio');
  });

  it('shows the estimate while the package is still on its way', async () => {
    const root = shadow(await card(hass({ [POSTI]: [waiting({ status: 3 })] })));
    expect(line(root).textContent).toContain('Arvio 2026-09-17');
    expect(line(root).textContent).not.toContain('Nouda viimeistään');
  });

  it('never shows the estimate once the package is at the pickup point', async () => {
    // Posti gives no deadline, so there is simply no time to show.
    const root = shadow(await card(hass({ [POSTI]: [waiting({ pickup_deadline: null })] })));
    expect(line(root).textContent).toContain('K-Market Keskusta');
    expect(line(root).textContent).not.toContain('2026-09-17');
  });

  it('falls back to the destination when there is no pickup point', async () => {
    const root = shadow(await card(hass({ [POSTI]: [waiting({ pickup_point: null })] })));
    expect(line(root).textContent).toContain('Postin automaatti');
    expect(line(root).textContent).toContain('Nouda viimeistään');
  });

  it('shows the time alone when the place is hidden', async () => {
    const state = hass({ [POSTI]: [waiting()] });
    const root = shadow(await card(state, { show_destination: false }));
    expect(line(root).textContent).not.toContain('K-Market Keskusta');
    expect(line(root).textContent).toContain('Nouda viimeistään');
  });

  it('keeps the place but drops the time for a delivered package, and when it is hidden', async () => {
    const delivered = shadow(await card(hass({ [POSTI]: [waiting({ status: 0 })] })));
    expect(line(delivered).textContent).toContain('K-Market Keskusta');
    expect(line(delivered).textContent).not.toContain('Nouda viimeistään');
    const hidden = shadow(await card(hass({ [POSTI]: [waiting()] }), { show_pickup: false }));
    expect(line(hidden).textContent).toContain('K-Market Keskusta');
    expect(line(hidden).textContent).not.toContain('Nouda viimeistään');
  });
});

describe('the pickup code', () => {
  const withCode: Shipment = {
    ...WAITING,
    status: 5,
    pickup_point: { name: 'K-Market Keskusta' },
    pickup_code: '12345678',
  };

  it('is not shown by default', async () => {
    const root = shadow(await card(hass({ [POSTI]: [withCode] })));
    expect(root.querySelector('.code')).toBeNull();
  });

  it('is shown outright when asked for', async () => {
    const root = shadow(await card(hass({ [POSTI]: [withCode] }), { pickup_code: 'always' }));
    expect(root.querySelector('.code')?.textContent).toContain('12345678');
  });

  // The row an icon belongs to.
  const rowOf = (root: ShadowRoot | DocumentFragment, icon: string): Element | null =>
    root.querySelector(`ha-icon[icon="${icon}"]`)?.parentElement ?? null;

  it('sits with the message that says the package can be collected', async () => {
    const root = shadow(await card(hass({ [POSTI]: [withCode] }), { pickup_code: 'always' }));
    expect(rowOf(root, 'mdi:text-box')?.querySelector('.code')).not.toBeNull();
    expect(rowOf(root, 'mdi:map-marker-radius')?.querySelector('.code')).toBeNull();
  });

  it('moves to the destination line when that message is hidden', async () => {
    const root = shadow(
      await card(hass({ [POSTI]: [withCode] }), {
        pickup_code: 'always',
        show_latest_event_message: false,
      }),
    );
    expect(rowOf(root, 'mdi:map-marker-radius')?.querySelector('.code')).not.toBeNull();
  });

  it('is covered until clicked, and covers again when clicked once more', async () => {
    const element = await card(hass({ [POSTI]: [withCode] }), { pickup_code: 'toggle' });
    const root = shadow(element);
    const field = () => root.querySelector('.code') as HTMLElement;
    expect(field().textContent).toContain('••••');
    expect(field().textContent).not.toContain('12345678');

    field().dispatchEvent(new Event('click'));
    await element.updateComplete;
    expect(field().textContent).toContain('12345678');

    field().dispatchEvent(new Event('click'));
    await element.updateComplete;
    expect(field().textContent).toContain('••••');
  });

  it('does not open the carrier page when the code is clicked', async () => {
    const openWindow = vi.spyOn(window, 'open').mockImplementation(() => null);
    const element = await card(hass({ [POSTI]: [withCode] }), { pickup_code: 'toggle' });
    const code = shadow(element).querySelector('.code') as HTMLElement;

    code.dispatchEvent(new Event('click', { bubbles: true }));
    await element.updateComplete;

    expect(openWindow).not.toHaveBeenCalled();
    openWindow.mockRestore();
  });
});

describe('the weight and parcels', () => {
  const heavy: Shipment = { ...WAITING, weight: 2.4, package_count: 2 };

  it('are left out by default', async () => {
    const root = shadow(await card(hass({ [POSTI]: [heavy] })));
    expect(root.textContent).not.toContain('kg');
  });

  it('are shown when asked for', async () => {
    const root = shadow(await card(hass({ [POSTI]: [heavy] }), { show_details: true }));
    const text = root.textContent?.replace(/\s+/g, ' ');
    expect(text).toContain('2,4 kg');
    expect(text).toContain('2 kollia');
  });

  it('leave out a single parcel, which says nothing', async () => {
    const one = { ...heavy, package_count: 1 };
    const root = shadow(await card(hass({ [POSTI]: [one] }), { show_details: true }));
    const text = root.textContent?.replace(/\s+/g, ' ');
    expect(text).toContain('2,4 kg');
    expect(text).not.toContain('kollia');
  });
});
