/**
 * A dashboard card that lists the packages on their way to you, or sent by you, from any
 * tracking integration whose sensor lists them in a `packages` attribute in the
 * format README.md documents. Packages still moving are listed first, finished
 * ones last.
 *
 * Each package is one row: where it has got to, as a bar, and the latest thing
 * that happened to it. Clicking it, or only its number, opens the carrier's own page for it.
 */
import { LitElement, css, html, nothing } from "lit";
import type { CSSResultGroup, PropertyValues, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import { AT_PICKUP_POINT, CARD_VERSION, FINISHED, STATUSES } from "./const";
import { trackingEntities, withTitle } from "./editor";
import { ScrollFade, fadeStyles } from "./fade";
import type { HomeAssistant } from "./hass";
import { gridMinRows, heightCardSize, heightStyle, validHeight } from "./height";
import { filledHeight, validRowStep } from "./rows";
import { browserLanguage, translate } from "./localize/localize";
import {
    ago,
    entities,
    formatDateTime,
    iconFor,
    isOutgoing,
    missingEntities,
    packagesOf,
    progressOf,
    type Sensor,
    sensorsOf,
    sortPackages,
    trackingUrl,
    withDirection,
    withinLimits,
    withStatuses,
} from "./packages";
import { qrPath } from "./qr";
import type { PackageTrackerCardConfig, PickupPoint, Shipment } from "./types";

console.info(
    `%c  PACKAGE-TRACKER-CARD \n%c  ${CARD_VERSION}    `,
    "color: orange; font-weight: bold; background: black",
    "color: white; font-weight: bold; background: dimgray",
);

interface CardRegistration {
    type: string;
    name: string;
    description: string;
    documentationURL?: string;
    preview?: boolean;
}

/**
 * The parts of a held card's least height, in pixels, measured live with a 21-character number and the longest status
 * in either language. A card's border and padding, the title on one line, a package's padding, the margins around its
 * progress line, and each line under it.
 */
const CARD_EDGES = 26;
const TITLE = 41;
const ITEM_PADDING = 12;
const PROGRESS_MARGIN = 6;
const LINE = 16;

/**
 * The number's line and the progress line by the width of the card's content: wider than 240 px, up to 240 px (the
 * badges on a line of their own under the number, the bar on a line of its own above the status) and up to 170 px (the
 * number on three lines, the badges one above the other and the status on two lines). The badges stack below 152 px
 * with Matkahuolto's, and the rest leaves room for a longer service's name. A card that lists one way has only the
 * service's badge.
 */
const HELD_MINIMUM = {
    wide: { line: 32, lineOneBadge: 32, progress: 22, status: 18, bar: 18 },
    narrow: { line: 49, lineOneBadge: 49, progress: 40, status: 30, bar: 18 },
    veryNarrow: { line: 82, lineOneBadge: 65, progress: 52, status: 42, bar: 18 },
};
type WidthClass = keyof typeof HELD_MINIMUM;

const registry = window as unknown as { customCards?: CardRegistration[] };
registry.customCards = registry.customCards ?? [];
registry.customCards.push({
    type: "package-tracker-card",
    name: translate(browserLanguage(), "common.name"),
    description: translate(browserLanguage(), "common.description"),
    documentationURL: "https://github.com/jesmak/package-tracker-card",
    preview: true,
});

@customElement("package-tracker-card")
export class PackageTrackerCard extends LitElement {
    @property({ attribute: false }) public hass?: HomeAssistant;
    /** Set by the dashboard: "grid" in a sections view. */
    @property({ attribute: false }) public layout?: string;
    @state() private config?: PackageTrackerCardConfig;
    /** The packages whose pickup code has been revealed by clicking it. */
    @state() private revealed = new Set<string>();
    /** The package whose QR code is open. */
    @state() private qr?: Shipment;
    /** On automatic rows in a sections view, the height that ends the card on a whole row; 0 when it isn't set. */
    @state() private filled = 0;
    /** The room a whole row leaves over, put under the title rather than under the list. */
    @state() private spare = 0;
    /** The layout the card's measured width gives it, as its container query switches; unknown before it is measured. */
    @state() private widthClass?: WidthClass;
    private frame?: number;
    private readonly resizes = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(() => this.measureSoon());
    /** The ha-card the observer follows. The host is inline, so its own box never changes size for an observer. */
    private observed?: Element;
    /** Keeps the times of the sensors' checks current between their updates. */
    private clock?: ReturnType<typeof setInterval>;

    constructor() {
        super();
        // Fades the list's edges while the card is held to a height, through the card's own lifecycle.
        new ScrollFade(this, () => (this.heightStyle() ? this.renderRoot.querySelectorAll<HTMLElement>(".list") : []));
    }

    public static getConfigElement(): HTMLElement {
        return document.createElement("package-tracker-card-editor");
    }

    /** Offers the tracking sensors that are there when the card is added from the picker. */
    public static getStubConfig(hass?: HomeAssistant): Record<string, unknown> {
        return { entity: hass ? trackingEntities(hass) : [] };
    }

    public setConfig(config: PackageTrackerCardConfig): void {
        const noEntity = !config || !config.entity || (Array.isArray(config.entity) && config.entity.length === 0);
        // An empty `max_events:` in YAML is null, which means no limit, as leaving it out does.
        const badCount = [config?.max_events, config?.max_sent_events].some(
            (limit) => limit != null && !(Number.isInteger(limit) && limit > 0),
        );
        const badStatuses =
            config?.statuses != null && !(Array.isArray(config.statuses) && config.statuses.every((status) => STATUSES.includes(status)));
        const badLink = config?.tracking_link != null && !["row", "number", "none"].includes(config.tracking_link);
        const badDirection = config?.direction != null && !["all", "incoming", "outgoing"].includes(config.direction);
        if (noEntity || badCount || badStatuses || badLink || badDirection) {
            throw new Error(translate(browserLanguage(), "common.invalid_configuration"));
        }
        if (!validHeight(config)) {
            throw new Error(translate(browserLanguage(), "common.invalid_height"));
        }
        if (!validRowStep(config)) {
            throw new Error(translate(browserLanguage(), "common.invalid_row_step"));
        }
        this.config = withTitle(config);
    }

    public getCardSize(): number {
        const packages = this.hass && this.config ? this.shown(this.hass, this.config) : [];
        return heightCardSize(this.config ?? {}, 1 + packages.length * 2, this.minimumHeight());
    }

    /**
     * In a sections view the card takes a whole section by default and is never narrower than three quarters of one,
     * nor lower than its minimum. Home Assistant holds rows set in the layout tab to that minimum.
     */
    public getGridOptions(): Record<string, unknown> {
        return { columns: 12, rows: "auto", min_columns: 9, min_rows: gridMinRows(this.minimumHeight()) };
    }

    /**
     * Held to a height, the title and one whole package still fit while every sensor answers: its number, its progress
     * line and the lines the configuration shows, each on one line. At the narrowest its columns can be, or at the width
     * it is measured to have, whichever needs more: a whole section counts as wide, 11 columns or fewer as narrow. The
     * number is counted as long as Posti's, and the badge of the service it came from as there, since only the data
     * says whether it is. A longer number scrolls the rest of the package with the list.
     */
    private minimumHeight(): number {
        const byColumns = this.minimumFor(this.columns() <= 11 ? "narrow" : "wide");
        return Math.max(byColumns, this.widthClass ? this.minimumFor(this.widthClass) : 0);
    }

    private minimumFor(widthClass: WidthClass): number {
        const config = this.config;
        if (!config) {
            return 0;
        }
        const sizes = HELD_MINIMUM[widthClass];
        const bar = config.show_progress !== false;
        const status = config.show_latest_event !== false;
        const progress = bar && status ? sizes.progress : status ? sizes.status : bar ? sizes.bar : 0;
        const message = config.show_latest_event_message !== false;
        // The last line is the destination's, which also takes the pickup code when the message line isn't there to.
        const destination =
            config.show_destination !== false ||
            config.show_pickup !== false ||
            (!message && (config.pickup_code ?? "hidden") !== "hidden");
        const lines = [
            config.show_details === true,
            message,
            config.show_latest_event_location !== false,
            config.show_origin !== false,
            destination,
        ].filter(Boolean).length;
        return (
            CARD_EDGES +
            (config.title ? TITLE : 0) +
            ITEM_PADDING +
            ((config.direction ?? "all") === "all" ? sizes.line : sizes.lineOneBadge) +
            (progress ? progress + PROGRESS_MARGIN : 0) +
            lines * LINE
        );
    }

    /** The columns set in the layout tab, in either form Home Assistant has saved them, or a whole section. */
    private columns(): number {
        const config = this.config as { grid_options?: { columns?: unknown }; layout_options?: { grid_columns?: unknown } } | undefined;
        const columns = config?.grid_options
            ? config.grid_options.columns
            : typeof config?.layout_options?.grid_columns === "number"
              ? config.layout_options.grid_columns * 3
              : undefined;
        return typeof columns === "number" ? columns : 12;
    }

    /** Back on the page, such as from another view, the card is followed and measured again without waiting for its data. */
    public connectedCallback(): void {
        super.connectedCallback();
        if (this.hasUpdated) {
            this.requestUpdate();
        }
        this.clock = setInterval(() => {
            if (this.renderRoot.querySelector(".sensor")) {
                this.requestUpdate();
            }
        }, 60_000);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        clearInterval(this.clock);
        this.resizes?.disconnect();
        this.observed = undefined;
        cancelAnimationFrame(this.frame ?? 0);
    }

    private measureSoon(): void {
        cancelAnimationFrame(this.frame ?? 0);
        this.frame = requestAnimationFrame(() => {
            this.measureWidth();
            this.fillRows();
        });
    }

    /**
     * Keeps the width class of the card's content, as its container query switches, read in a frame rather than in the
     * observer's callback, where a change would resize the card while the observer still runs. A hidden card keeps the
     * last.
     */
    private measureWidth(): void {
        const card = this.renderRoot.querySelector<HTMLElement>("ha-card");
        if (!card?.clientWidth) {
            return;
        }
        const style = getComputedStyle(card);
        const width = card.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
        const widthClass: WidthClass = width <= 170 ? "veryNarrow" : width <= 240 ? "narrow" : "wide";
        if (widthClass !== this.widthClass) {
            this.widthClass = widthClass;
        }
    }

    /**
     * On automatic rows in a sections view, the card takes the whole rows its content needs, or the half rows with
     * `row_step: half`, so the cards under it stay on the rows. Measured to the end of the list's last child, as the list
     * grows to whatever height the card is given. What a whole row leaves over goes above the list, under the title, as
     * its top margin, which the measure leaves out again each time.
     */
    private fillRows(): void {
        const card = this.renderRoot.querySelector<HTMLElement>("ha-card");
        const list = card?.querySelector<HTMLElement>(".list");
        const last = card && (list?.lastElementChild ?? card.querySelector(".message"));
        if (!card || !last || !card.clientWidth || this.layout !== "grid" || this.heightStyle()) {
            if (this.filled) {
                this.filled = 0;
            }
            if (this.spare) {
                this.spare = 0;
            }
            return;
        }
        const style = getComputedStyle(card);
        const content =
            last.getBoundingClientRect().bottom -
            card.getBoundingClientRect().top +
            (parseFloat(style.paddingBottom) || 0) +
            (parseFloat(style.borderBottomWidth) || 0) -
            (list ? Math.max(0, parseFloat(getComputedStyle(list).marginTop) || 0) : 0);
        const filled = filledHeight(Math.round(content), this.config ?? {});
        const spare = list ? Math.max(0, Math.floor(filled - content)) : 0;
        if (filled !== this.filled) {
            this.filled = filled;
        }
        if (spare !== this.spare) {
            this.spare = spare;
        }
    }

    protected shouldUpdate(changed: PropertyValues): boolean {
        if (!this.config || [...changed.keys()].some((key) => key !== "hass")) {
            return true;
        }
        const previous = changed.get("hass") as HomeAssistant | undefined;
        if (!previous || this.language() !== (previous.locale?.language ?? previous.language ?? browserLanguage())) {
            return true;
        }
        // Otherwise redraw only when one of the sensors the card was given has changed.
        return entities(this.config.entity).some((id) => previous.states[id] !== this.hass?.states[id]);
    }

    protected render(): TemplateResult | typeof nothing {
        if (!this.hass || !this.config) {
            return nothing;
        }

        const missing = missingEntities(this.hass, this.config.entity);
        if (missing.length === entities(this.config.entity).length) {
            return html`<ha-card style="${this.cardStyle()}"
                ><div class="message">${this.text("common.no_entity")} ${missing.join(", ")}</div></ha-card
            >`;
        }

        const packages = this.shown(this.hass, this.config);
        const sensors = sensorsOf(this.hass, this.config.entity);

        // Each package says which way it goes when the card is set to list both ways, whatever the packages happen to be.
        // A card set to one way has nothing to tell apart.
        const marked = (this.config.direction ?? "all") === "all";
        const title = this.config.title;
        // Held to a height, the title keeps to one line, so the minimum the card is held to always holds it.
        const held = !!this.heightStyle();

        return html`
            <ha-card class="${this.config.wrap_text ? "wrap" : ""} ${held ? "held" : ""}" style="${this.cardStyle()}">
                ${title ? html`<div class="header" title="${held ? title : nothing}">${title}</div>` : nothing}
                <div class="list">
                    ${
                        packages.length === 0
                            ? this.empty(sensors, held)
                            : html`${sensors.filter((sensor) => !sensor.available).map((sensor) => this.sensor(sensor))}${repeat(
                                  packages,
                                  (item) => item.shipment_number,
                                  (item) => this.shipment(item, marked),
                              )}`
                    }
                </div>
                ${this.qrDialog()}
            </ha-card>
        `;
    }

    protected updated(changed: PropertyValues): void {
        // Opened only as the package is chosen, so a redraw while it is closing doesn't open it again.
        if (changed.has("qr") && this.qr) {
            this.renderRoot.querySelector<HTMLDialogElement>("dialog.qr")?.showModal();
        }
        // An update already queued still runs after the card has left the page, and must not start watching again.
        if (!this.isConnected) {
            return;
        }
        // The message is drawn in an ha-card of its own, so the one followed changes with it.
        const card = this.renderRoot.querySelector("ha-card") ?? undefined;
        if (card !== this.observed) {
            if (this.observed) {
                this.resizes?.unobserve(this.observed);
            }
            if (card) {
                this.resizes?.observe(card);
            }
            this.observed = card;
        }
        this.measureSoon();
    }

    private heightStyle(): string {
        return heightStyle(this.config ?? {}, this.layout, this.minimumHeight());
    }

    private cardStyle(): string {
        return this.heightStyle() || (this.filled ? `min-height: ${this.filled}px; --package-tracker-spare: ${this.spare}px` : "");
    }

    /**
     * With nothing to list, the card says so and shows that each of its sensors still answers, so an empty card can be
     * told apart from a broken one. With `show_sensors` off, only a sensor that doesn't answer is named. Held to a
     * height, an icon fills some of the room, centred with the rest.
     */
    private empty(sensors: Sensor[], held: boolean): TemplateResult {
        return html`<div class="empty">
            ${held ? html`<ha-icon class="empty-icon" icon="mdi:package-variant-closed-check"></ha-icon>` : nothing}
            <div class="no-packages">${this.text("common.no_packages")}</div>
            ${(this.config?.show_sensors === false ? sensors.filter((sensor) => !sensor.available) : sensors).map((sensor) =>
                this.sensor(sensor),
            )}
        </div>`;
    }

    /** A sensor's name, and when it last read its packages, or that it doesn't answer. */
    private sensor(sensor: Sensor): TemplateResult {
        const state = !sensor.available
            ? this.text("common.unavailable")
            : sensor.checked
              ? `${this.text("common.checked")} ${ago(sensor.checked, this.language()) ?? this.text("common.just_now")}`
              : "";
        return html`<div class="sensor ${sensor.available ? "" : "down"}">
            <ha-icon icon="${sensor.available ? "mdi:check-circle-outline" : "mdi:alert-circle-outline"}"></ha-icon>
            <span>${state ? `${sensor.name} · ${state}` : sensor.name}</span>
        </div>`;
    }

    /** The packages listed: the chosen ones in order, up to the most of each direction. */
    private shown(hass: HomeAssistant, config: PackageTrackerCardConfig): Shipment[] {
        return withinLimits(sortPackages(this.chosen(hass, config)), config.max_events, config.max_sent_events);
    }

    /** The packages of the card's sensors with the chosen statuses, going the chosen way. */
    private chosen(hass: HomeAssistant, config: PackageTrackerCardConfig): Shipment[] {
        return withDirection(withStatuses(packagesOf(hass, config.entity), config.statuses), config.direction);
    }

    private shipment(item: Shipment, marked: boolean): TemplateResult {
        const moving = !FINISHED.includes(item.status);
        // The code goes with the message that says the package can be collected; without that row
        // it rides along with the place it is collected from.
        const message = this.config?.show_latest_event_message !== false && moving && !!item.latest_event;
        const link = this.config?.tracking_link ?? "row";
        const url = link === "none" ? undefined : trackingUrl(item);
        const row = link === "row" && !!url;
        // The date it was sent belongs to the sender, and says nothing on its own. A package the user sent names who it
        // goes to in the sender's place, since its sender is the user.
        const sender = item.origin || item.origin_city;
        const outgoing = isOutgoing(item);
        // A click anywhere on the package opens its page, or only a click on its number. For the keyboard and screen
        // readers the number is the link either way, so that the code's button sits beside it rather than inside it.
        return html`
            <div
                class="item status-${item.status} ${row ? "clickable" : ""}"
                title="${row ? url : ""}"
                @click=${() => row && this.openTracking(url)}
            >
                <div class="line">
                    <ha-icon icon="${iconFor(item.status)}"></ha-icon>
                    <span
                        class="number ${url && !row ? "link" : ""}"
                        title="${url && !row ? url : nothing}"
                        role="${url ? "link" : nothing}"
                        tabindex="${url ? 0 : nothing}"
                        @click=${() => !row && this.openTracking(url)}
                        @keydown=${(event: KeyboardEvent) => activate(event, () => this.openTracking(url))}
                        >${item.shipment_number}</span
                    >
                    ${this.badges(item, marked)}
                </div>
                ${this.progress(item)} ${this.details(item)}
                ${this.row(
                    "mdi:text-box",
                    this.config?.show_latest_event_message,
                    moving,
                    [item.latest_event],
                    message ? this.code(item) : nothing,
                )}
                ${this.row("mdi:map-marker", this.config?.show_latest_event_location, moving, [item.latest_event_city])}
                ${
                    outgoing
                        ? this.row("mdi:account-arrow-right", this.config?.show_origin, true, [item.recipient])
                        : this.row("mdi:arrow-up-bold-box", this.config?.show_origin, true, [
                              sender,
                              sender && item.shipment_date ? ` (${formatDateTime(item.shipment_date)})` : "",
                          ])
                }
                ${this.destination(item, !message)}
            </div>
        `;
    }

    /** Which way the package goes, when the list shows both ways, and which service it came from. */
    private badges(item: Shipment, marked: boolean): TemplateResult | typeof nothing {
        if (!marked && !item.source) {
            return nothing;
        }
        const direction = this.text(isOutgoing(item) ? "direction.outgoing" : "direction.incoming");
        return html`
            <span class="badges">
                ${marked ? html`<span class="badge direction">${direction}</span>` : nothing}
                ${item.source ? html`<span class="badge source">${item.source}</span>` : nothing}
            </span>
        `;
    }

    /** How far the package has got, with its status and when it last moved. */
    private progress(item: Shipment): TemplateResult | typeof nothing {
        if (this.config?.show_latest_event === false && this.config?.show_progress === false) {
            return nothing;
        }
        const percent = (progressOf(item.status) * 100).toFixed(0);
        return html`
            <div class="progress-row">
                ${
                    this.config?.show_progress === false
                        ? nothing
                        : html`<div
                              class="track"
                              role="progressbar"
                              aria-label="${this.text(`statuses.${item.status}`)}"
                              aria-valuenow="${percent}"
                              aria-valuemin="0"
                              aria-valuemax="100"
                          >
                              <div class="bar" style="width:${percent}%"></div>
                          </div>`
                }
                ${
                    this.config?.show_latest_event === false
                        ? nothing
                        : html`<span class="latest">
                              <span class="status-text">${this.text(`statuses.${item.status}`)}</span>
                              <span class="when">${formatDateTime(item.latest_event_date)}</span>
                          </span>`
                }
            </div>
        `;
    }

    /**
     * Where the package is going, and by when.
     *
     * The pickup point stands in for the destination whenever the integration sends one: they are
     * the same place said twice. A package waiting at a pickup point shows how long it is kept
     * there; one still on its way shows the estimated delivery instead, because the estimate is of
     * no more use once it has arrived.
     */
    private destination(item: Shipment, withCode: boolean): TemplateResult | typeof nothing {
        const place =
            this.config?.show_destination === false ? "" : placeOf(item.pickup_point) || item.destination || item.destination_city || "";
        const waiting = AT_PICKUP_POINT.includes(item.status);
        const time =
            this.config?.show_pickup === false || FINISHED.includes(item.status)
                ? ""
                : waiting
                  ? item.pickup_deadline
                  : item.estimated_delivery;
        const label = waiting ? this.text("common.pickup_by") : this.text("common.estimated");
        // The line stays for the code even with nothing else on it, or the code would have nowhere to go.
        const code = withCode ? this.code(item) : nothing;
        if (!place && !time && code === nothing) {
            return nothing;
        }
        return html`
            <div class="row secondary">
                <ha-icon icon="${item.pickup_point ? "mdi:map-marker-radius" : "mdi:arrow-down-bold-box"}"></ha-icon>
                <div class="text-content">${[place, time ? `${label} ${formatDateTime(time)}` : ""].filter(Boolean).join(" · ")}</div>
                ${code}
            </div>
        `;
    }

    /**
     * The code that collects the package, and a button for its QR code when the pickup point scans one. Both
     * go by `pickup_code`: the code is shown never, always, or once the field is clicked, and the QR code is
     * behind its button unless the code is never shown. At a locker with a keypad on every door, the door
     * comes first, since the code only opens that one. A compartment without a code is the shelf a counter
     * keeps the package on, which is no secret. A finished package has nothing left to collect, and the code of a
     * package the user sent is the recipient's.
     */
    private code(item: Shipment): TemplateResult | typeof nothing {
        const setting = this.config?.pickup_code ?? "hidden";
        const shelf = item.pickup_code ? undefined : item.pickup_point?.compartment;
        if (
            setting === "hidden" ||
            (!item.pickup_code && !item.pickup_qr && !shelf) ||
            FINISHED.includes(item.status) ||
            isOutgoing(item)
        ) {
            return nothing;
        }
        return html`
            <span class="pickup">
                ${item.pickup_code ? this.codeField(item) : nothing}
                ${shelf ? html`<span class="shelf">${this.text("common.shelf")} ${shelf}</span>` : nothing}
                ${
                    item.pickup_qr
                        ? html`<button
                              type="button"
                              class="qr-button"
                              title="${this.text("common.show_qr")}"
                              aria-label="${this.text("common.show_qr")}"
                              @click=${(event: Event) => this.showQr(event, item)}
                          >
                              <ha-icon icon="mdi:qrcode"></ha-icon>
                          </button>`
                        : nothing
                }
            </span>
        `;
    }

    private codeField(item: Shipment): TemplateResult {
        const setting = this.config?.pickup_code ?? "hidden";
        const shown = setting === "always" || this.revealed.has(item.shipment_number);
        const compartment = item.pickup_point?.compartment;
        const title = !shown ? this.text("common.show_code") : compartment ? `${this.text("common.compartment")} ${compartment}` : "";
        const toggles = setting === "toggle";
        return html`
            <span
                class="code ${shown ? "" : "covered"} ${toggles ? "toggles" : ""}"
                title="${title}"
                role="${toggles ? "button" : nothing}"
                tabindex="${toggles ? 0 : nothing}"
                aria-label="${toggles && !shown ? this.text("common.show_code") : nothing}"
                aria-pressed="${toggles ? String(shown) : nothing}"
                @click=${(event: Event) => this.reveal(event, item)}
                @keydown=${(event: KeyboardEvent) => activate(event, () => this.reveal(event, item))}
            >
                <ha-icon icon="mdi:key-variant"></ha-icon>
                ${shown ? [compartment, item.pickup_code].filter(Boolean).join(" · ") : "••••"}
            </span>
        `;
    }

    /** The QR code is its own button, like the code, so the package under it stays put. */
    private showQr(event: Event, item: Shipment): void {
        event.stopPropagation();
        this.qr = item;
    }

    private closeQr(): void {
        this.renderRoot.querySelector<HTMLDialogElement>("dialog.qr")?.close();
        this.qr = undefined;
    }

    /**
     * The QR code large enough to scan off the screen, with the code under it for a counter that types it in.
     * A modal dialog of the card's own, in the browser's top layer, so no card or view around it can clip it.
     * Esc, the close button and a click outside it close it.
     */
    private qrDialog(): TemplateResult | typeof nothing {
        const item = this.qr;
        if (!item?.pickup_qr) {
            return nothing;
        }
        const { size, path } = qrPath(item.pickup_qr);
        const place = placeOf(item.pickup_point) || item.destination || item.destination_city;
        const deadline = AT_PICKUP_POINT.includes(item.status) ? item.pickup_deadline : undefined;
        return html`
            <dialog
                class="qr"
                aria-labelledby="qr-title"
                @close=${() => (this.qr = undefined)}
                @click=${(event: Event) => event.target === event.currentTarget && this.closeQr()}
            >
                <div class="qr-content">
                    <div class="qr-header">
                        <span id="qr-title" class="qr-title">${item.shipment_number}</span>
                        <button
                            type="button"
                            class="qr-close"
                            title="${this.text("common.close")}"
                            aria-label="${this.text("common.close")}"
                            @click=${() => this.closeQr()}
                        >
                            <ha-icon icon="mdi:close"></ha-icon>
                        </button>
                    </div>
                    <svg
                        class="qr-code"
                        viewBox="0 0 ${size} ${size}"
                        shape-rendering="crispEdges"
                        role="img"
                        aria-label="${this.text("common.qr_code")}"
                    >
                        <rect width="${size}" height="${size}" fill="#fff"></rect>
                        <path d="${path}" fill="#000"></path>
                    </svg>
                    ${item.pickup_code ? html`<div class="qr-number">${item.pickup_code}</div>` : nothing}
                    ${place ? html`<div class="qr-detail">${place}</div>` : nothing}
                    ${deadline ? html`<div class="qr-detail">${this.text("common.pickup_by")} ${formatDateTime(deadline)}</div>` : nothing}
                </div>
            </dialog>
        `;
    }

    private reveal(event: Event, item: Shipment): void {
        // The code is its own thing to click, so the package under it stays put, also when the code is
        // always shown and someone taps it to read it.
        event.stopPropagation();
        if ((this.config?.pickup_code ?? "hidden") !== "toggle") {
            return;
        }
        const revealed = new Set(this.revealed);
        if (revealed.has(item.shipment_number)) {
            revealed.delete(item.shipment_number);
        } else {
            revealed.add(item.shipment_number);
        }
        this.revealed = revealed;
    }

    /** What the package weighs, and how many parcels it has. */
    private details(item: Shipment): TemplateResult | typeof nothing {
        if (this.config?.show_details !== true) {
            return nothing;
        }
        const parts = [
            item.weight ? `${this.number(item.weight, 3)} kg` : "",
            item.package_count && item.package_count > 1 ? `${item.package_count} ${this.text("common.parcels")}` : "",
        ].filter(Boolean);
        if (parts.length === 0) {
            return nothing;
        }
        return html`
            <div class="row secondary">
                <ha-icon icon="mdi:weight-kilogram"></ha-icon>
                <div class="text-content">${parts.join(" · ")}</div>
            </div>
        `;
    }

    private number(value: number, digits: number): string {
        return new Intl.NumberFormat(this.language(), { maximumFractionDigits: digits }).format(value);
    }

    /** A line of the package, left out when the configuration hides it or there is nothing to write. */
    private row(
        icon: string,
        shown: boolean | undefined,
        relevant: boolean,
        parts: Array<string | null | undefined>,
        extra: TemplateResult | typeof nothing = nothing,
    ): TemplateResult | typeof nothing {
        const text = parts.filter((part) => part !== null && part !== undefined && part !== "").join("");
        if (shown === false || !relevant || text === "") {
            return nothing;
        }
        return html`
            <div class="row secondary">
                <ha-icon icon="${icon}"></ha-icon>
                <div class="text-content">${text}</div>
                ${extra}
            </div>
        `;
    }

    private openTracking(url: string | undefined): void {
        if (url) {
            window.open(url, "_blank", "noopener");
        }
    }

    private text(key: string): string {
        return translate(this.language(), key);
    }

    private language(): string {
        return this.hass?.locale?.language ?? this.hass?.language ?? browserLanguage();
    }

    static get styles(): CSSResultGroup {
        return [
            css`
                /* The header stays put and the packages scroll under it, so a card given a
               height, by its options or by the rows of a sections view, never spills its text outside.
               The card is the container its layout measures, so it follows its own width wherever it is. */
                ha-card {
                    display: flex;
                    flex-direction: column;
                    box-sizing: border-box;
                    overflow: hidden;
                    padding: 12px;
                    container-type: inline-size;
                }

                .header {
                    flex: none;
                    font-size: var(--ha-card-header-font-size, 24px);
                    line-height: 1.2;
                    padding: 4px 4px 12px 4px;
                }

                .held .header {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                /* The room a whole row leaves over, when there is any, goes above the list, under the title. */
                .list {
                    margin-top: var(--package-tracker-spare, 0px);
                    flex: 1 1 auto;
                    min-height: 0;
                    overflow-y: auto;
                    scrollbar-width: thin;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    text-align: center;
                }

                .held .empty {
                    flex: 1 0 auto;
                }

                .empty-icon {
                    --mdc-icon-size: 48px;
                    color: var(--secondary-text-color);
                    opacity: 0.5;
                }

                .sensor {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    min-width: 0;
                    font-size: 12px;
                    line-height: 16px;
                    color: var(--secondary-text-color);
                    overflow-wrap: anywhere;
                }

                .sensor ha-icon {
                    --mdc-icon-size: 16px;
                    flex: none;
                }

                .sensor.down {
                    color: var(--warning-color, #ffa600);
                }

                .no-packages,
                .message {
                    color: var(--secondary-text-color);
                    padding: 4px;
                }

                .item {
                    border-radius: 8px;
                    padding: 6px;
                    background: var(--secondary-background-color, transparent);
                }

                .item.clickable {
                    cursor: pointer;
                }

                .item.clickable:hover {
                    background: var(--divider-color, var(--secondary-background-color));
                }

                /* The bar's track and the badges' borders are the hover's colour, so on a hovered package they take the resting one. */
                .item.clickable:hover .track {
                    background: var(--secondary-background-color, #f5f5f5);
                }

                .item.clickable:hover .badge {
                    border-color: var(--secondary-background-color, var(--secondary-text-color));
                }

                .number.link {
                    cursor: pointer;
                }

                .number.link:hover {
                    text-decoration: underline;
                }

                /* Reached by keyboard, the number and the code show where the focus is, inside their edges so the scrolling list
               doesn't clip it. */
                .number:focus-visible,
                .code:focus-visible,
                .qr-button:focus-visible {
                    outline: 2px solid var(--primary-color);
                    outline-offset: -2px;
                }

                .line {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    min-width: 0;
                }

                /* When the card's content is wider than 240 px, the number is never cut short, and gives way last: the badges
               beside it go one above the other first, and only when the line is still too short does the number wrap. The badges' far
               larger share of the shrinking keeps it whole until then. Both shares stay above 1, since shares that add up
               to less than 1 take only that part of the missing room, and the rest would stick out of the card. */
                .number {
                    flex: 0 1 auto;
                    min-width: 0;
                    font-weight: 600;
                    overflow-wrap: anywhere;
                }

                /* Which way the package goes and which service it came from, small and out of the way. */
                /* Side by side while the line has room for them and the whole number, one above the other when it hasn't, as
               the room runs out. A narrow card gives them a line of their own below. */
                .badges {
                    margin-left: auto;
                    flex: 0 1000 auto;
                    min-width: min-content;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                    gap: 2px 4px;
                }

                /* On a narrow card the badges would leave the number no room at all, so they get a line of their own under it
               and the number takes the whole width beside its icon. */
                @container (max-width: 240px) {
                    .line {
                        flex-wrap: wrap;
                        row-gap: 2px;
                    }

                    .number {
                        flex: 1 1 0;
                    }

                    .badges {
                        flex: 1 1 100%;
                        min-width: 0;
                    }
                }

                .badge {
                    font-size: 11px;
                    color: var(--secondary-text-color);
                    border: 1px solid var(--divider-color, var(--secondary-text-color));
                    border-radius: 999px;
                    padding: 0 6px;
                }

                /* The bar keeps the height of a row of text, so hiding the status doesn't
               change how tall a package is, and it lines up with the icons above and below. */
                /* The bar takes the room the status and its time leave it, and gets a line of its own when that would make it
               shorter than it can be read at, whatever the card's width or the status. The status and its time then
               spread over the next line, the time at its end. */
                .progress-row {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 6px 8px;
                    min-height: 18px;
                    margin: 4px 0 2px 0;
                    padding: 0 2px;
                }

                .track {
                    flex: 1000 1 120px;
                    height: 4px;
                    border-radius: 2px;
                    background: var(--divider-color, #ddd);
                    overflow: hidden;
                }

                .bar {
                    height: 100%;
                    border-radius: 2px;
                    background: currentColor;
                }

                /* On a line of its own the status and its time may still not fit side by side, such as a long status on the
               narrowest card: then the time goes under the status. */
                .latest {
                    flex: 1 1 auto;
                    min-width: 0;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 6px 8px;
                }

                .latest .when {
                    margin-left: auto;
                }

                /* A status is a phrase, so on the narrowest card it wraps between its words rather than running past the edge. */
                .status-text {
                    flex: 0 1 auto;
                    min-width: 0;
                    font-size: 12px;
                    line-height: 1;
                    font-weight: 600;
                }

                .when {
                    flex: 0 0 auto;
                    font-size: 12px;
                    line-height: 1;
                    color: var(--secondary-text-color);
                }

                /* Rows align to their first line, so the icon stays beside the start of a wrapped text. */
                .row {
                    display: flex;
                    align-items: flex-start;
                    gap: 4px;
                    min-width: 0;
                }

                .row.secondary {
                    color: var(--secondary-text-color);
                    font-size: 12px;
                    line-height: 16px;
                }

                /* The icon is a box of its own, so its middle lines up with the middle of the text. */
                .row.secondary ha-icon {
                    --mdc-icon-size: 16px;
                    flex: 0 0 auto;
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* The code and its QR button sit at the end of the pickup line, the code covered until it is asked for. */
                .pickup {
                    margin-left: auto;
                    flex: 0 0 auto;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }

                .shelf {
                    white-space: nowrap;
                }

                .code {
                    cursor: default;
                    display: inline-flex;
                    align-items: center;
                    gap: 2px;
                    font-variant-numeric: tabular-nums;
                    letter-spacing: 0.02em;
                }

                .code ha-icon {
                    --mdc-icon-size: 14px;
                    width: 14px;
                    height: 14px;
                }

                /* A code that covers again when clicked shows it can be clicked, one shown always doesn't. */
                .code.toggles {
                    cursor: pointer;
                }

                .code.covered {
                    opacity: 0.7;
                }

                .code.covered:hover {
                    opacity: 1;
                }

                /* A bit taller than the line, without making it taller, so it is easier to hit. */
                .qr-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 20px;
                    margin: -2px 0;
                    padding: 0;
                    /* Not the divider colour, which is also the highlight of a package under the pointer. */
                    border: 1px solid var(--secondary-text-color, currentColor);
                    border-radius: 4px;
                    background: none;
                    color: var(--primary-text-color);
                    cursor: pointer;
                }

                .qr-button:hover {
                    background: var(--secondary-background-color, transparent);
                }

                .qr-button ha-icon {
                    --mdc-icon-size: 14px;
                    width: 14px;
                    height: 14px;
                }

                dialog.qr {
                    box-sizing: border-box;
                    width: min(384px, calc(100vw - 32px));
                    max-height: calc(100vh - 32px);
                    padding: 0;
                    border: 0;
                    border-radius: var(--ha-dialog-border-radius, 24px);
                    background: var(--ha-dialog-surface-background, var(--card-background-color, #fff));
                    color: var(--primary-text-color);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
                }

                dialog.qr::backdrop {
                    background: rgba(0, 0, 0, 0.6);
                }

                .qr-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 12px 24px 24px 24px;
                }

                /* The number is centred over the code, with room left on both sides for the close button. */
                .qr-header {
                    position: relative;
                    align-self: stretch;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 44px;
                    padding: 0 44px;
                    margin-bottom: 12px;
                }

                .qr-title {
                    font-size: 20px;
                    font-weight: 500;
                    text-align: center;
                    overflow-wrap: anywhere;
                }

                .qr-close {
                    position: absolute;
                    top: 0;
                    right: -12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;
                    padding: 0;
                    border: 0;
                    border-radius: 50%;
                    background: none;
                    color: inherit;
                    cursor: pointer;
                }

                .qr-close:hover {
                    background: var(--divider-color, transparent);
                }

                /* White around the code whatever the theme, as scanners need it. */
                .qr-code {
                    display: block;
                    width: 248px;
                    max-width: 100%;
                    height: auto;
                    border-radius: 12px;
                }

                .qr-number {
                    margin-top: 16px;
                    font-size: 36px;
                    font-weight: 700;
                    font-variant-numeric: tabular-nums;
                    letter-spacing: 0.08em;
                    text-align: center;
                    overflow-wrap: anywhere;
                }

                .qr-detail {
                    margin-top: 4px;
                    font-size: 14px;
                    color: var(--secondary-text-color);
                    text-align: center;
                }

                /* Long texts are cut short, or wrap in full with wrap_text. */
                .text-content {
                    min-width: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .wrap .text-content {
                    white-space: normal;
                    overflow-wrap: anywhere;
                }

                /* The status colours the icon, the bar and the status text of a package. */
                .item {
                    color: var(--primary-text-color);
                }

                .status-1,
                .status-2 {
                    color: var(--info-color, cornflowerblue);
                }

                .status-3,
                .status-4 {
                    color: var(--state-icon-color, #44739e);
                }

                .status-5 {
                    color: var(--success-color, #43a047);
                }

                .status-0 {
                    color: var(--secondary-text-color);
                }

                .status-6,
                .status-7 {
                    color: var(--error-color, #db4437);
                }

                .item .number,
                .item .text-content {
                    color: var(--primary-text-color);
                }

                .status-0 .number {
                    color: var(--secondary-text-color);
                }
            `,
            fadeStyles,
        ];
    }
}

/** Enter and Space do what a click does, for a part of the card that isn't a native button or link. */
function activate(event: KeyboardEvent, action: () => void): void {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        action();
    }
}

/** The pickup point as one line: its name, and the city when they differ. */
function placeOf(point: PickupPoint | null | undefined): string {
    if (!point) {
        return "";
    }
    const name = point.name ?? "";
    const city = point.city ?? "";
    return [name, city && city.toLowerCase() !== name.toLowerCase() ? city : ""].filter(Boolean).join(", ");
}

declare global {
    interface HTMLElementTagNameMap {
        "package-tracker-card": PackageTrackerCard;
    }
}
