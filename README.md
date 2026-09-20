# Package tracking card

Home Assistant dashboard card that lists the packages coming to you from Posti and Matkahuolto.

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE)
[![GitHub Activity][commits-shield]][commits]

## Support

Hey dude! Help me out for a couple of :beers: or a :coffee:!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/jesmak)

## What is it?

A custom card that shows the packages on their way to you: how far each one has got, what happened to it last and
when. Packages still moving are listed first, with the most recently moved at the top, and finished ones fall to the
bottom. Clicking a package opens the carrier's own tracking page for it.

The packages come from the [Posti](https://github.com/jesmak/posti_tracking) and
[Matkahuolto](https://github.com/jesmak/matkahuolto_tracking) integrations. Both write their packages the same way, so
one card can list them together.

![The card](docs/images/card.png)

## Options

The card has a visual editor: add it from the card picker and choose the sensors. The options can also be written by
hand.

| Name                         | Type           | Requirement  | Description                                                 | Default              |
| ---------------------------- | -------------- | ------------ | ----------------------------------------------------------- | -------------------- |
| `type`                       | string         | **Required** | `custom:package-tracker-card`                               |                      |
| `entity`                     | string or list | **Required** | The sensor, or sensors, whose packages are listed           |                      |
| `title`                      | string         | Optional     | Shown at the top of the card                                |                      |
| `max_events`                 | number         | Optional     | List at most this many packages                             | all                  |
| `height`                     | number         | Optional     | A fixed height in pixels; the packages scroll inside it     | follows the packages |
| `max_height`                 | number         | Optional     | A height the card never grows past, in pixels               | none                 |
| `show_progress`              | boolean        | Optional     | Show how far the package has got, as a bar                  | `true`               |
| `show_origin`                | boolean        | Optional     | Show where the package was sent from                        | `true`               |
| `show_destination`           | boolean        | Optional     | Show where it is going                                      | `true`               |
| `show_latest_event`          | boolean        | Optional     | Show the status and when it last changed                    | `true`               |
| `show_latest_event_message`  | boolean        | Optional     | Show what the tracking service last said                    | `true`               |
| `show_latest_event_location` | boolean        | Optional     | Show where that happened                                    | `true`               |
| `hide_when_nothing_to_show`  | boolean        | Optional     | Leave the card out of the dashboard while nothing is coming | `false`              |

```yaml
type: custom:package-tracker-card
title: Lähetykset
entity:
  - sensor.posti_omaposti
  - sensor.matkahuolto
max_events: 5
show_destination: false
hide_when_nothing_to_show: true
```

A line is left out when the package has nothing to put on it, so a package without a known place for its latest event
simply shows one line fewer. A sensor that isn't there is passed over, and the card says so if none of them are.

## What a package shows

The bar says how far the package has got, from waiting to delivered, and is coloured by its status: blue while the
carrier has it, green once it can be picked up, grey when it is done, red if it was returned or something went wrong.
Beside it are the status and the moment it last changed.

Under that are the lines you have left on: what the carrier last said, where that happened, who sent it and where it
is going. A chip names the service the package came from, which matters when one card lists both.

Clicking a package opens it on Posti's or Matkahuolto's own tracking page, whichever sent it.

## The size of the card

Without `height` or `max_height` the card is as tall as its packages. With either of them the packages scroll inside
the card, and the title stays put above them. A height set another way — `card_mod`, or a section that sizes its
cards — works the same way: the card keeps to it instead of letting the text run outside.

## How to install

### With HACS

1. Add this repository to HACS custom repositories with type **Dashboard**
2. Search for Package tracker card in HACS and download it
3. Refresh your browser

### Manually

1. Download `package-tracker-card.js` from the latest release and copy it to the `config/www` folder of your Home
   Assistant installation
2. In Home Assistant settings, open dashboards, click the three dots at the top right and open resources
3. Add a new resource with the path `/local/package-tracker-card.js` and type JavaScript
4. Refresh your browser

## Upgrading from 1.x

Nothing needs to be done: the card keeps its configuration, and `name` is still accepted for the title.

A package is now one row with a progress bar rather than a stack of icon lines, the card has a visual editor, and
`height` and `max_height` keep it inside a size you give it. The statuses "waiting" and "received by the carrier" were
the wrong way round before, and are now as the integrations mean them.

## Development

Requires Node 22.13 or newer.

```
npm install
npm run check
```

`npm run check` typechecks, lints, checks formatting, runs the tests and builds `dist/package-tracker-card.js`, which
is the file HACS installs and is committed to the repository.

| Path                          | What it contains                             |
| ----------------------------- | -------------------------------------------- |
| `src/package-tracker-card.ts` | The card itself                              |
| `src/editor.ts`               | The visual editor                            |
| `src/packages.ts`             | Reading, sorting and formatting the packages |
| `src/localize/`               | The card's texts                             |
| `tests/`                      | Tests, run with vitest                       |

## Data

Package tracking: [Posti](https://www.posti.fi/) and [Matkahuolto](https://www.matkahuolto.fi/), through the
integrations named above.

[commits-shield]: https://img.shields.io/github/commit-activity/y/jesmak/package-tracker-card.svg?style=for-the-badge
[commits]: https://github.com/jesmak/package-tracker-card/commits/master
[license-shield]: https://img.shields.io/github/license/jesmak/package-tracker-card.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/jesmak/package-tracker-card.svg?style=for-the-badge
[releases]: https://github.com/jesmak/package-tracker-card/releases
