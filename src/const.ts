/** Replaced at build time with the version in package.json. */
declare const __CARD_VERSION__: string;

export const CARD_VERSION = __CARD_VERSION__;

/** The statuses the tracking integrations give a package. */
export const DELIVERED = 0;
export const WAITING = 1;
export const RECEIVED = 2;
export const IN_TRANSPORT = 3;
export const IN_DELIVERY = 4;
export const READY_FOR_PICKUP = 5;
export const RETURNED = 6;
export const UNKNOWN = 7;

/** A package that is finished is done with, and sorts below the rest. */
export const FINISHED = [DELIVERED, RETURNED];

/**
 * How far along a package is, for the progress bar. A returned package has gone
 * as far as it will go, and an unknown one shows no progress at all.
 */
export const PROGRESS: Record<number, number> = {
  [WAITING]: 0.08,
  [RECEIVED]: 0.3,
  [IN_TRANSPORT]: 0.55,
  [IN_DELIVERY]: 0.75,
  [READY_FOR_PICKUP]: 0.9,
  [DELIVERED]: 1,
  [RETURNED]: 1,
  [UNKNOWN]: 0,
};

/** Where a package's own carrier shows it. `{number}` is the shipment number. */
export const TRACKING_URLS: Record<string, string> = {
  posti: 'https://www.posti.fi/fi/seuranta#/lahetys/{number}',
  matkahuolto: 'https://www.matkahuolto.fi/seuranta?parcelNumber={number}',
};
