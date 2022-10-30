# Package tracking card by [@jesmak](https://www.github.com/jesmak)

A Home Assistant Lovelace custom card for tracking packages being delivered by Posti and Matkahuolto.

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

![Project Maintenance][maintenance-shield]
[![GitHub Activity][commits-shield]][commits]

## What is it?

A custom Lovelace card that allows for easy tracking of packages delivered. Currently there are two custom integrations created by
me that can be used. One for [Finnish Posti](https://github.com/jesmak/posti_tracking) and one for [Matkahuolto](https://github.com/jesmak/matkahuolto_tracking).

## Support

Hey dude! Help me out for a couple of :beers: or a :coffee:!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/jesmak)

## Options

| Name                       | Type    | Requirement  | Description                                       | Default             |
| -------------------------- | ------- | ------------ | ------------------------------------------------- | ------------------- |
| type                       | string  | **Required** | `custom:package-tracker-card`                     |                     |
| entity                     | string  | **Required** | Target entity created by a compatible integration |                     |
| name                       | string  | **Optional** | Title shown on top of card                        |                     |
| show_destination           | boolean | **Optional** | Show destination rows                             | `true`              |
| show_latest_event          | boolean | **Optional** | Show latest event rows                            | `true`              |
| show_latest_event_message  | boolean | **Optional** | Show latest event messages                        | `true`              |
| show_latest_event_location | boolean | **Optional** | Show latest event location                        | `true`              |

## How to install

### Manually

1. Download package-tracker-card.js from latest release and copy it to config/www folder on your Home Assistant installation.
2. In Home Assistant settings, open dashboards, click the 3 dots button on the top right of the screen and open resources
3. Add a new resource with path /local/package-tracker-card.js (type JavaScript)
4. Refresh your browser

[commits-shield]: https://img.shields.io/github/commit-activity/y/jesmak/package-tracker-card.svg?style=for-the-badge
[commits]: https://github.com/jesmak/package-tracker-card/commits/master
[license-shield]: https://img.shields.io/github/license/jesmak/package-tracker-card.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/maintenance/yes/2022.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/jesmak/package-tracker-card.svg?style=for-the-badge
[releases]: https://github.com/jesmak/package-tracker-card/releases
