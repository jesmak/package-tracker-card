# Package tracker card

Home Assistant dashboard card that lists the packages coming to you, from any package tracking integration.

[![GitHub Release][releases-shield]][releases] [![GitHub Release Date][release-date-shield]][releases] [![HACS][hacs-shield]][hacs] [![License][license-shield]](LICENSE)

<p>
<img src="https://raw.githubusercontent.com/jesmak/package-tracker-card/main/docs/images/packages-light.png#gh-light-mode-only" width="400" alt="Five packages from two carriers, four coming and one sent, each marked which way it goes, one ready for pickup, three on their way and one delivered, each with a progress bar, its status and its latest event">
<img src="https://raw.githubusercontent.com/jesmak/package-tracker-card/main/docs/images/packages-dark.png#gh-dark-mode-only" width="400" alt="Five packages from two carriers, four coming and one sent, each marked which way it goes, one ready for pickup, three on their way and one delivered, each with a progress bar, its status and its latest event">
<img src="https://raw.githubusercontent.com/jesmak/package-tracker-card/main/docs/images/pickup-light.png#gh-light-mode-only" width="400" alt="A package ready for pickup at a parcel locker, with its weight, the locker door and the pickup code, and the deadline for picking it up">
<img src="https://raw.githubusercontent.com/jesmak/package-tracker-card/main/docs/images/pickup-dark.png#gh-dark-mode-only" width="400" alt="A package ready for pickup at a parcel locker, with its weight, the locker door and the pickup code, and the deadline for picking it up">
</p>

## What is it?

A custom card that shows the packages on their way to you, or sent by you, how far each one has got, and what happened
to it last and when. Packages still moving are listed first, with the most recently moved at the top, and finished ones
fall to the bottom. Clicking a package, or only its number if you prefer, opens the carrier's own tracking page for it.

The card doesn't know any carrier. It reads a sensor's `packages` attribute, so any integration that writes its
packages in the [package format](#data) works, and one card can list packages from several of them together. These
integrations write it:

- [Posti package tracking](https://github.com/jesmak/posti_tracking)
- [Matkahuolto package tracking](https://github.com/jesmak/matkahuolto_tracking)
- [PostNord package tracking](https://github.com/jesmak/postnord_tracking)

Integrations that write the format carry the GitHub topic
[`package-tracker-card-source`](https://github.com/topics/package-tracker-card-source), so that's where to look for
more. If you make one, give its repository the topic too.

## Installation

### With HACS

1. Add this repository to HACS custom repositories with type **Dashboard**
2. Search for Package tracker card in HACS and download it
3. Refresh your browser

### Manual

1. Take `dist/package-tracker-card.js` from the source code of the [latest release][releases] and copy it to the
   `config/www` folder of your Home Assistant installation
2. In Home Assistant settings, open dashboards, click the three dots at the top right and open resources
3. Add a new resource with the path `/local/package-tracker-card.js` and type JavaScript
4. Refresh your browser

## Options

The card has a visual editor. Add it from the card picker and choose the sensors. The options can also be written by
hand.

| Name                         | Type           | Description                                                                                                                                                                                                                                 | Default                                                                         |
| ---------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `type`                       | string         | **Required.** `custom:package-tracker-card`                                                                                                                                                                                                 |                                                                                 |
| `entity`                     | string or list | **Required.** The sensor, or sensors, whose packages are listed                                                                                                                                                                             |                                                                                 |
| `title`                      | string         | Shown at the top of the card                                                                                                                                                                                                                |                                                                                 |
| `statuses`                   | list           | List only the packages with these [statuses](#data)                                                                                                                                                                                         | all                                                                             |
| `direction`                  | string         | `all`, `incoming` or `outgoing`, the packages sent by the user                                                                                                                                                                              | `all`                                                                           |
| `max_events`                 | number         | List at most this many incoming packages. Above 0                                                                                                                                                                                           | all                                                                             |
| `max_sent_events`            | number         | List at most this many sent packages. Above 0                                                                                                                                                                                               | all                                                                             |
| `height_mode`                | string         | How tall the card is. `auto` fits its content, `fixed` keeps it at `height`, `max` lets it grow up to `max_height`. In `fixed` and `max` the list scrolls. A height in grid rows, set in the layout tab of a sections view, is used instead | `fixed` when `height` is set, `max` when only `max_height` is, otherwise `auto` |
| `height`                     | number         | The card's height in pixels, for `fixed`                                                                                                                                                                                                    |                                                                                 |
| `max_height`                 | number         | The card's greatest height in pixels, for `max`                                                                                                                                                                                             |                                                                                 |
| `show_progress`              | boolean        | Show how far the package has got, as a bar                                                                                                                                                                                                  | `true`                                                                          |
| `show_latest_event`          | boolean        | Show the status and when it last changed                                                                                                                                                                                                    | `true`                                                                          |
| `show_latest_event_message`  | boolean        | Show what the tracking service last said                                                                                                                                                                                                    | `true`                                                                          |
| `show_latest_event_location` | boolean        | Show where that happened                                                                                                                                                                                                                    | `true`                                                                          |
| `show_origin`                | boolean        | Show who sent the package, or who a sent one goes to                                                                                                                                                                                        | `true`                                                                          |
| `show_destination`           | boolean        | Show where it is going, or where it is picked up                                                                                                                                                                                            | `true`                                                                          |
| `show_pickup`                | boolean        | Add the pickup deadline, or the estimate, to that line                                                                                                                                                                                      | `true`                                                                          |
| `show_details`               | boolean        | Show the weight and how many parcels the shipment has                                                                                                                                                                                       | `false`                                                                         |
| `wrap_text`                  | boolean        | Wrap long texts over several lines instead of cutting them short                                                                                                                                                                            | `false`                                                                         |
| `pickup_code`                | string         | `hidden`, `always`, or `toggle` to reveal it when clicked                                                                                                                                                                                   | `hidden`                                                                        |
| `tracking_link`              | string         | `row`, `number`, or `none`, what opens the tracking page                                                                                                                                                                                    | `row`                                                                           |

A line is left out when the package has nothing to put on it, so a package without a known place for its latest event
simply shows one line fewer. A sensor that isn't there is passed over, and the card says so if none of them are.

## What it shows

The bar says how far the package has got, from waiting to delivered, and is coloured by its status. It is blue while
the carrier has it, green once it can be picked up, grey when it is done and red if it was returned or something went
wrong. Beside it are the status and the moment it last changed.

Under that are the lines you have left on. They say what the carrier last said, where that happened, who sent it and
where it is going. A chip names the service the package came from, which matters when one card lists several.

Clicking a package, or pressing Enter on its number, opens the tracking page its integration gives for it. A package
without one isn't clickable.

| `tracking_link` | What opens the page                                                        |
| --------------- | -------------------------------------------------------------------------- |
| `row`           | A click anywhere on the package                                            |
| `number`        | A click on the shipment number only, so a stray tap elsewhere does nothing |
| `none`          | Nothing. The packages are not links at all                                 |

`statuses` lists only the packages with one of the statuses given, which makes room for a card of its own for the
packages waiting to be picked up. `direction` lists only the packages coming to you, or only those you sent, when the
integration says which way a package goes. `max_events` counts only the incoming packages that are left, and
`max_sent_events` the sent ones, so that many sent packages can't push those coming to you off the card.

When `direction` is `all`, as it is by default, each package says which way it goes, **Incoming** or **Sent**, beside
the label of the service it came from. When it lists only one way, they say nothing, since there is nothing to tell
apart. On a narrow card the two labels sit one above the other. A package whose direction the integration doesn't
give counts as incoming.

A package you sent names its recipient where a received one names its sender. It never shows a pickup code or a QR
code, whatever `pickup_code` says, since those are the recipient's.

With nothing to list, the card says so and names each of its sensors, with when it last checked for packages, so an
empty card can be told apart from one whose integration has stopped working. A sensor that is unavailable is marked
**not available**, and is named above the packages of the others when they have some. Held to a height, an empty card
also shows a package icon.

### The destination line

One line says where the package is going and by when. The **pickup point** stands in for the destination whenever the
tracking integration sends one, since they are the same place said twice.

A package that is still on its way shows its **estimated delivery**. One waiting at a pickup point shows **how long it
is kept** instead, because the estimate is of no more use once it has arrived. Not every carrier gives that deadline,
and without one a package waiting for pickup shows its place alone. A delivered package shows the place only.

`show_destination` hides the place and `show_pickup` the time, so turning off one leaves the other on its own line.

### The pickup code

The pickup code collects the package, so it is never shown unless asked for. It sits beside the tracking service's
own message, the one that says the package can be collected, and moves to the destination line when that message is
hidden.

| `pickup_code` | What it does                                                         |
| ------------- | -------------------------------------------------------------------- |
| `hidden`      | Never shown, whatever the integration sends                          |
| `always`      | Shown beside the status message                                      |
| `toggle`      | Covered with dots. Clicking reveals it, and clicking again covers it |

The integration has to send the code too, and most keep it off by default, so switching it on takes both. At a locker
with a keypad on every door, the door comes first, as `17 · 12345678`, and is covered along with the code. A delivered
or returned package has nothing left to collect, so its code is not shown.

### The QR code

<img src="https://raw.githubusercontent.com/jesmak/package-tracker-card/main/docs/images/qr-light.png#gh-light-mode-only" width="510" alt="A package ready for pickup at a kiosk, its code covered and a QR code button after it">
<img src="https://raw.githubusercontent.com/jesmak/package-tracker-card/main/docs/images/qr-dark.png#gh-dark-mode-only" width="510" alt="A package ready for pickup at a kiosk, its code covered and a QR code button after it">

Some pickup points scan a QR code instead of having the code typed in. When the integration sends one for a package,
a button with a QR icon sits after the code. It opens the QR code large enough to scan off a phone's screen, on white
whatever the theme, with the code under it for a counter that types it in, the pickup point and the deadline. The close
button, Esc or a click outside it close it.

The button follows `pickup_code`. It is there with `always` and `toggle`, and with `toggle` the code in the list stays
covered while the QR code is open. With `hidden` there is no button either. Which packages get a QR code is up to the
integration, which knows which of its pickup points scan one.

### Size

In the `auto` height mode the card is as tall as its packages. In `fixed` and `max`, or with a row count given to it
in a sections view, the packages scroll inside the card and the title stays put above them. Held to a height, the
card never gets lower than the title and one whole package with the lines it shows need. An edge with
packages scrolled past it fades out, so it's clear there's more.

The card is 12 columns wide by default and at least 9. It follows its own width rather than the column count, so it
works the same outside the sections view. On a narrow card the bar gets a line of its own, and the badges go under the
shipment number so that the number has the whole width. Shipment numbers wrap when they don't fit. Other long texts
are cut short unless `wrap_text` is on, which shows them in full at the cost of a taller card.

On automatic rows in a sections view, a card that `height_mode` doesn't keep to `height` or `max_height` ends on a
whole row, so the cards under it stay on the rows.

Held to a height, by `height_mode` or by rows set in the layout tab, the card keeps its title to one line, cut short
with an ellipsis when it is longer. The least it gets counts a shipment number as long as Posti's, on the narrowest
width its columns allow. A height set by `height_mode` is also raised to what the card's own width needs, so a card
inside another card fits too. A longer number scrolls the rest of the first package with the list. A section's
background or a theme can make a card narrower than its columns promise, and then rows set in the layout tab may need
raising by hand.

## Examples

Packages from two accounts in one card, at most five, with the codes revealed when clicked:

```yaml
type: custom:package-tracker-card
title: Packages
entity:
  - sensor.posti_matti_meikalainen_example_com
  - sensor.matkahuolto_matti_meikalainen_example_com
max_events: 5
pickup_code: toggle
```

A small card for a crowded dashboard, with only the status and where to pick the package up:

```yaml
type: custom:package-tracker-card
entity: sensor.posti_matti_meikalainen_example_com
height: 300
show_latest_event_message: false
show_latest_event_location: false
show_origin: false
```

A card of its own for the packages ready for pickup, opened only from their numbers:

```yaml
type: custom:package-tracker-card
title: Ready for pickup
entity: sensor.posti_matti_meikalainen_example_com
statuses: [5]
tracking_link: number
pickup_code: toggle
```

To show the card only while something is on its way or waiting for pickup, use Home Assistant's own visibility
conditions. The tracking integrations count those packages in a sensor of their own, whose entity ID follows Home
Assistant's language. Unlike an empty list, this also hides the card while it still shows recently delivered packages.

```yaml
type: custom:package-tracker-card
entity: sensor.posti_matti_meikalainen_example_com
visibility:
  - condition: numeric_state
    entity: sensor.posti_matti_meikalainen_example_com_packages_on_the_way
    above: 0
```

## Upgrading from earlier versions

Configurations carry over. The only things to know are these.

- `hide_when_nothing_to_show` is gone. The card ignores it and says there are no packages instead. To hide the card,
  use a visibility condition as in the [examples](#examples).
- `name`, from 1.x, is read as the title. The visual editor shows it in the title field and saves it as `title`.
- Clicking a package needs an integration version that gives `tracking_url`. With an older one the packages are
  listed as before but don't open anything.

## Data

The packages come from the tracking integrations the card is given. The card itself fetches nothing.

### The package format

The card lists the packages of every sensor it is given, from the sensor's `packages` attribute, a list with one
object per package. Only `shipment_number` and `status` are required. Anything else may be left out or `null`, and
the line that would show it is left out too.

A sensor may also have a `last_checked` attribute, the ISO 8601 time its integration last read the packages, whether
or not anything had changed. The card shows it when there is nothing to list.

| Key                  | Type   | What the card does with it                                                                                                                                                                     |
| -------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shipment_number`    | string | **Required.** Shown as the package's name                                                                                                                                                      |
| `status`             | number | **Required.** One of the statuses below. Sets the icon, the bar and the colour                                                                                                                 |
| `direction`          | string | `outgoing` for a package the user sent. Anything else is incoming. Filters the list and sets its badge                                                                                         |
| `latest_event_date`  | string | When the status last changed, in ISO 8601. Shown with the status, and sorts the list                                                                                                           |
| `latest_event`       | string | What the carrier last said, in its own words                                                                                                                                                   |
| `latest_event_city`  | string | Where that happened                                                                                                                                                                            |
| `origin`             | string | Who sent it. `origin_city` stands in when there is no name                                                                                                                                     |
| `recipient`          | string | Who a package the user sent goes to. Shown in the sender's place                                                                                                                               |
| `origin_city`        | string | Where it was sent from                                                                                                                                                                         |
| `shipment_date`      | string | When it was sent, in ISO 8601. Shown after the sender                                                                                                                                          |
| `destination`        | string | Where it is going. `destination_city` stands in when there is no name                                                                                                                          |
| `destination_city`   | string | The city it is going to                                                                                                                                                                        |
| `estimated_delivery` | string | When it is expected, in ISO 8601. Shown until it can be picked up                                                                                                                              |
| `pickup_deadline`    | string | How long it is kept at the pickup point, in ISO 8601. Shown once it can be picked up                                                                                                           |
| `pickup_point`       | object | Where it is picked up. `name` and `city` replace the destination, and `compartment`, the door, goes with the code. A `compartment` without a code is a counter shelf, shown beside the QR code |
| `pickup_code`        | string | The code that collects it. Shown only as `pickup_code` allows                                                                                                                                  |
| `pickup_qr`          | string | What a QR code for the pickup point holds, opened from its button. Shown only as `pickup_code` allows                                                                                          |
| `weight`             | number | Kilograms, with `show_details`                                                                                                                                                                 |
| `package_count`      | number | How many parcels the shipment has, with `show_details`                                                                                                                                         |
| `source`             | string | The service it came from, shown as a chip                                                                                                                                                      |
| `tracking_url`       | string | The carrier's page for the package, opened when it is clicked. Only `http` and `https` open                                                                                                    |

The statuses:

| `status` | Meaning                 | `status` | Meaning            |
| -------- | ----------------------- | -------- | ------------------ |
| `0`      | Delivered               | `4`      | Being delivered    |
| `1`      | Waiting                 | `5`      | Ready for pickup   |
| `2`      | Received by the carrier | `6`      | Returned to sender |
| `3`      | In transit              | `7`      | Exception          |

Delivered and returned packages are finished, and sort below the rest. A date without a time is shown as that day.

The card is forgiving about what it is given. An entry without a `shipment_number` or a `status` is left out, with a
warning in the browser's console. A field of the wrong type is left out too, except that a `pickup_code`, a
`pickup_qr` or a `compartment` written as a number is taken as text. A status written as text is read as a number, and a status the
card doesn't know is shown as an exception. A package that two sensors both list is shown once, as the one that moved
last. An integration that needs more of its own can add keys, and the card ignores what it doesn't know.

```json
{
  "shipment_number": "JJFI12345678901234567",
  "status": 5,
  "latest_event_date": "2026-09-16T08:30:00+00:00",
  "latest_event": "The shipment is ready for pickup",
  "origin": "Example Shop",
  "destination_city": "TAMPERE",
  "pickup_deadline": "2026-09-30T21:00:00+00:00",
  "pickup_point": { "name": "Example parcel locker", "city": "TAMPERE", "compartment": "17" },
  "pickup_code": "12345678",
  "source": "Example Carrier",
  "tracking_url": "https://carrier.example.com/track/JJFI12345678901234567"
}
```

## Translating

The card's texts are in `src/localize/languages/`, one JSON file per language, named by its language code, such as
`en.json` and `fi.json`. To add a language, copy `en.json` to the new language's code, such as `sv.json`, and
translate the values. Nothing else needs changing. The card finds the file by itself and uses it when Home Assistant
is set to that language. A text left out falls back to English.

## Development

Requires Node 22.13 or newer.

```
npm install
npm run check
```

`npm run check` typechecks, lints, checks formatting, runs the tests and builds `dist/package-tracker-card.js`, which
is the file HACS installs and is committed to the repository. The screenshots above come from `docs/screenshots.json`,
whose packages are made up.

| Path                          | What it contains                                       |
| ----------------------------- | ------------------------------------------------------ |
| `src/package-tracker-card.ts` | The card itself                                        |
| `src/editor.ts`               | The visual editor                                      |
| `src/packages.ts`             | Reading, checking, sorting and formatting the packages |
| `src/qr.ts`                   | Drawing the QR code                                    |
| `src/localize/languages/`     | The card's texts, one JSON file per language           |
| `tests/`                      | Tests, run with vitest                                 |

## Support

Hey dude! Help me out for a couple of :beers: or a :coffee:!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/jesmak)

## Thanks

The QR codes are drawn with [QR Code Generator](https://github.com/kazuhikoarase/qrcode-generator) by Kazuhiko Arase,
which is bundled into the card under the MIT license, see [LICENSE-qrcode-generator](LICENSE-qrcode-generator).

## License

MIT, see [LICENSE](LICENSE).

[releases-shield]: https://img.shields.io/github/release/jesmak/package-tracker-card.svg?style=for-the-badge
[release-date-shield]: https://img.shields.io/github/release-date/jesmak/package-tracker-card?style=for-the-badge
[releases]: https://github.com/jesmak/package-tracker-card/releases
[hacs-shield]: https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge
[hacs]: https://hacs.xyz/docs/faq/custom_repositories/
[license-shield]: https://img.shields.io/github/license/jesmak/package-tracker-card.svg?style=for-the-badge
