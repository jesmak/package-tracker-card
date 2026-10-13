/**
 * A dashboard card that lists the packages on their way to you, from any
 * tracking integration whose sensor lists them in a `packages` attribute in the
 * format README.md documents. Packages still moving are listed first, finished
 * ones last.
 *
 * Each package is one row: where it has got to, as a bar, and the latest thing
 * that happened to it. Clicking it opens the carrier's own page for it.
 */
import { LitElement, css, html, nothing } from "lit";
import type { CSSResultGroup, PropertyValues, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import { AT_PICKUP_POINT, CARD_VERSION, FINISHED } from "./const";
import { trackingEntities, withTitle } from "./editor";
import type { HomeAssistant } from "./hass";
import { browserLanguage, translate } from "./localize/localize";
import { entities, formatDateTime, iconFor, missingEntities, packagesOf, progressOf, sortPackages, trackingUrl } from "./packages";
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
    @state() private config?: PackageTrackerCardConfig;
    /** The packages whose pickup code has been revealed by clicking it. */
    @state() private revealed = new Set<string>();
    private resizeObserver?: ResizeObserver;
    private observed?: HTMLElement;

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
        const badCount = config?.max_events != null && !(Number.isInteger(config.max_events) && config.max_events > 0);
        if (noEntity || badCount) {
            throw new Error(translate(browserLanguage(), "common.invalid_configuration"));
        }
        this.config = withTitle(config);
    }

    public getCardSize(): number {
        const packages = this.hass && this.config ? packagesOf(this.hass, this.config.entity) : [];
        return 1 + Math.min(packages.length, this.config?.max_events ?? packages.length) * 2;
    }

    public getGridOptions(): Record<string, unknown> {
        return { columns: 12, rows: "auto", min_columns: 6 };
    }

    /** Home Assistant takes cards out of the page and puts them back, such as when the view changes. */
    public connectedCallback(): void {
        super.connectedCallback();
        if (this.observed) {
            this.resizeObserver?.observe(this.observed);
            fadeEdges(this.observed);
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.resizeObserver?.disconnect();
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
            return html`<ha-card><div class="message">${this.text("common.no_entity")} ${missing.join(", ")}</div></ha-card>`;
        }

        let packages = sortPackages(packagesOf(this.hass, this.config.entity));
        if (this.config.max_events != null && this.config.max_events < packages.length) {
            packages = packages.slice(0, this.config.max_events);
        }

        const title = this.config.title;

        return html`
            <ha-card class="${this.config.wrap_text ? "wrap" : ""}" style="${this.heights()}">
                ${title ? html`<div class="header">${title}</div>` : nothing}
                <div class="list" @scroll=${(event: Event) => fadeEdges(event.currentTarget as HTMLElement)}>
                    ${
                        packages.length === 0
                            ? html`<div class="no-packages">${this.text("common.no_packages")}</div>`
                            : repeat(
                                  packages,
                                  (item) => item.shipment_number,
                                  (item) => this.shipment(item),
                              )
                    }
                </div>
            </ha-card>
        `;
    }

    /** The list's edges fade wherever packages are scrolled out of sight, which changes as the list and the card resize. */
    protected updated(): void {
        const list = this.renderRoot.querySelector<HTMLElement>(".list") ?? undefined;
        if (list !== this.observed) {
            this.resizeObserver ??= new ResizeObserver((entries) => entries.forEach((entry) => fadeEdges(entry.target as HTMLElement)));
            this.resizeObserver.disconnect();
            if (list) {
                this.resizeObserver.observe(list);
            }
            this.observed = list;
        }
        if (list) {
            fadeEdges(list);
        }
    }

    /** A fixed height, a limit, or neither. The list scrolls inside whatever the card gets. */
    private heights(): string {
        const { height, max_height: maxHeight } = this.config ?? {};
        return [height === undefined ? "" : `height:${height}px;`, maxHeight === undefined ? "" : `max-height:${maxHeight}px;`].join("");
    }

    private shipment(item: Shipment): TemplateResult {
        const moving = !FINISHED.includes(item.status);
        // The code goes with the message that says the package can be collected; without that row
        // it rides along with the place it is collected from.
        const message = this.config?.show_latest_event_message !== false && moving && !!item.latest_event;
        const url = trackingUrl(item);
        // The date it was sent belongs to the sender, and says nothing on its own.
        const sender = item.origin || item.origin_city;
        // A click anywhere on the package opens its page. For the keyboard and screen readers the number is the link,
        // so that the code's button sits beside it rather than inside it.
        return html`
            <div class="item status-${item.status} ${url ? "clickable" : ""}" title="${url ?? ""}" @click=${() => this.openTracking(url)}>
                <div class="line">
                    <ha-icon icon="${iconFor(item.status)}"></ha-icon>
                    <span
                        class="number"
                        role="${url ? "link" : nothing}"
                        tabindex="${url ? 0 : nothing}"
                        @keydown=${(event: KeyboardEvent) => activate(event, () => this.openTracking(url))}
                        >${item.shipment_number}</span
                    >
                    ${item.source ? html`<span class="source">${item.source}</span>` : nothing}
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
                ${this.row("mdi:arrow-up-bold-box", this.config?.show_origin, true, [
                    sender,
                    sender && item.shipment_date ? ` (${formatDateTime(item.shipment_date)})` : "",
                ])}
                ${this.destination(item, !message)}
            </div>
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
                        : html`<span class="status-text">${this.text(`statuses.${item.status}`)}</span>
                              <span class="when">${formatDateTime(item.latest_event_date)}</span>`
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
     * The code that collects the package: never, always, or once the field is clicked. At a locker with
     * a keypad on every door, the door comes first, since the code only opens that one. A finished
     * package has nothing left to collect.
     */
    private code(item: Shipment): TemplateResult | typeof nothing {
        const setting = this.config?.pickup_code ?? "hidden";
        if (setting === "hidden" || !item.pickup_code || FINISHED.includes(item.status)) {
            return nothing;
        }
        const shown = setting === "always" || this.revealed.has(item.shipment_number);
        const compartment = item.pickup_point?.compartment;
        const title = !shown ? this.text("common.show_code") : compartment ? `${this.text("common.compartment")} ${compartment}` : "";
        const toggles = setting === "toggle";
        return html`
            <span
                class="code ${shown ? "" : "covered"}"
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
        return css`
            /* The header stays put and the packages scroll under it, so a card given a
               height, by its options or by the rows of a sections view, never spills its text outside.
               The card is the container its layout measures, so it follows its own width wherever it is. */
            ha-card {
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                height: 100%;
                overflow: hidden;
                padding: 12px;
                container-type: inline-size;
            }

            .header {
                flex: 0 0 auto;
                font-size: var(--ha-card-header-font-size, 24px);
                line-height: 1.2;
                padding: 4px 4px 12px 4px;
            }

            .list {
                flex: 1 1 auto;
                min-height: 0;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            /* An edge with packages scrolled past it fades out, so it's clear there's more. */
            .list.fade-top {
                mask-image: linear-gradient(to bottom, transparent, #000 24px);
            }

            .list.fade-bottom {
                mask-image: linear-gradient(to top, transparent, #000 24px);
            }

            .list.fade-top.fade-bottom {
                mask-image: linear-gradient(to bottom, transparent, #000 24px, #000 calc(100% - 24px), transparent);
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

            /* Reached by keyboard, the number and the code show where the focus is, inside their edges so the scrolling list doesn't clip it. */
            .number:focus-visible,
            .code:focus-visible {
                outline: 2px solid var(--primary-color);
                outline-offset: -2px;
            }

            .line {
                display: flex;
                align-items: center;
                gap: 6px;
                min-width: 0;
            }

            /* The number is never cut short. It wraps when the card is too narrow for it. */
            .number {
                min-width: 0;
                font-weight: 600;
                overflow-wrap: anywhere;
            }

            /* Which service the package came from, small and out of the way. */
            .source {
                margin-left: auto;
                flex: 0 0 auto;
                font-size: 11px;
                color: var(--secondary-text-color);
                border: 1px solid var(--divider-color, var(--secondary-text-color));
                border-radius: 999px;
                padding: 0 6px;
            }

            /* The bar keeps the height of a row of text, so hiding the status doesn't
               change how tall a package is, and it lines up with the icons above and below. */
            .progress-row {
                display: flex;
                align-items: center;
                gap: 8px;
                min-height: 18px;
                margin: 4px 0 2px 0;
                padding: 0 2px;
            }

            .track {
                flex: 1 1 auto;
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

            .status-text {
                flex: 0 0 auto;
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

            /* The code sits at the end of the pickup line, covered until it is asked for. */
            .code {
                margin-left: auto;
                flex: 0 0 auto;
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

            .code.covered {
                cursor: pointer;
                opacity: 0.7;
            }

            .code.covered:hover {
                opacity: 1;
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

            /* On a narrow card the bar gets a line of its own, with the status under it and its time at the end. */
            @container (max-width: 360px) {
                .progress-row {
                    flex-wrap: wrap;
                    row-gap: 6px;
                }

                .track {
                    flex-basis: 100%;
                }

                .when {
                    margin-left: auto;
                }
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
        `;
    }
}

/** Enter and Space do what a click does, for a part of the card that isn't a native button or link. */
function activate(event: KeyboardEvent, action: () => void): void {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        action();
    }
}

/** Marks the edges of a scrolling list that have packages beyond them. A pixel of slack absorbs fractional scrolling. */
function fadeEdges(list: HTMLElement): void {
    list.classList.toggle("fade-top", list.scrollTop > 1);
    list.classList.toggle("fade-bottom", list.scrollTop + list.clientHeight < list.scrollHeight - 1);
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
