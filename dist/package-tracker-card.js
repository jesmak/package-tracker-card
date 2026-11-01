/*! package-tracker-card 2.5.0 | MIT License | includes QR Code Generator, Copyright (c) 2009 Kazuhiko Arase, MIT License */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i7 = decorators.length - 1, decorator; i7 >= 0; i7--)
    if (decorator = decorators[i7])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = /* @__PURE__ */ Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t6, e6, o6) {
    if (this._$cssResult$ = true, o6 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t6, this.t = e6;
  }
  get styleSheet() {
    let t6 = this.o;
    const s5 = this.t;
    if (e && void 0 === t6) {
      const e6 = void 0 !== s5 && 1 === s5.length;
      e6 && (t6 = o.get(s5)), void 0 === t6 && ((this.o = t6 = new CSSStyleSheet()).replaceSync(this.cssText), e6 && o.set(s5, t6));
    }
    return t6;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t6) => new n("string" == typeof t6 ? t6 : t6 + "", void 0, s);
var i = (t6, ...e6) => {
  const o6 = 1 === t6.length ? t6[0] : e6.reduce((e7, s5, o7) => e7 + ((t7) => {
    if (true === t7._$cssResult$) return t7.cssText;
    if ("number" == typeof t7) return t7;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t7 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s5) + t6[o7 + 1], t6[0]);
  return new n(o6, t6, s);
};
var S = (s5, o6) => {
  if (e) s5.adoptedStyleSheets = o6.map((t6) => t6 instanceof CSSStyleSheet ? t6 : t6.styleSheet);
  else for (const e6 of o6) {
    const o7 = document.createElement("style"), n5 = t.litNonce;
    void 0 !== n5 && o7.setAttribute("nonce", n5), o7.textContent = e6.cssText, s5.appendChild(o7);
  }
};
var c = e ? (t6) => t6 : (t6) => t6 instanceof CSSStyleSheet ? ((t7) => {
  let e6 = "";
  for (const s5 of t7.cssRules) e6 += s5.cssText;
  return r(e6);
})(t6) : t6;

// node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t6, s5) => t6;
var u = { toAttribute(t6, s5) {
  switch (s5) {
    case Boolean:
      t6 = t6 ? l : null;
      break;
    case Object:
    case Array:
      t6 = null == t6 ? t6 : JSON.stringify(t6);
  }
  return t6;
}, fromAttribute(t6, s5) {
  let i7 = t6;
  switch (s5) {
    case Boolean:
      i7 = null !== t6;
      break;
    case Number:
      i7 = null === t6 ? null : Number(t6);
      break;
    case Object:
    case Array:
      try {
        i7 = JSON.parse(t6);
      } catch (t7) {
        i7 = null;
      }
  }
  return i7;
} };
var f = (t6, s5) => !i2(t6, s5);
var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
Symbol.metadata ?? (Symbol.metadata = /* @__PURE__ */ Symbol("metadata")), a.litPropertyMetadata ?? (a.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
var y = class extends HTMLElement {
  static addInitializer(t6) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t6);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t6, s5 = b) {
    if (s5.state && (s5.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t6) && ((s5 = Object.create(s5)).wrapped = true), this.elementProperties.set(t6, s5), !s5.noAccessor) {
      const i7 = /* @__PURE__ */ Symbol(), h4 = this.getPropertyDescriptor(t6, i7, s5);
      void 0 !== h4 && e2(this.prototype, t6, h4);
    }
  }
  static getPropertyDescriptor(t6, s5, i7) {
    const { get: e6, set: r6 } = h(this.prototype, t6) ?? { get() {
      return this[s5];
    }, set(t7) {
      this[s5] = t7;
    } };
    return { get: e6, set(s6) {
      const h4 = e6?.call(this);
      r6?.call(this, s6), this.requestUpdate(t6, h4, i7);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t6) {
    return this.elementProperties.get(t6) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties"))) return;
    const t6 = n2(this);
    t6.finalize(), void 0 !== t6.l && (this.l = [...t6.l]), this.elementProperties = new Map(t6.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t7 = this.properties, s5 = [...r2(t7), ...o2(t7)];
      for (const i7 of s5) this.createProperty(i7, t7[i7]);
    }
    const t6 = this[Symbol.metadata];
    if (null !== t6) {
      const s5 = litPropertyMetadata.get(t6);
      if (void 0 !== s5) for (const [t7, i7] of s5) this.elementProperties.set(t7, i7);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t7, s5] of this.elementProperties) {
      const i7 = this._$Eu(t7, s5);
      void 0 !== i7 && this._$Eh.set(i7, t7);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s5) {
    const i7 = [];
    if (Array.isArray(s5)) {
      const e6 = new Set(s5.flat(1 / 0).reverse());
      for (const s6 of e6) i7.unshift(c(s6));
    } else void 0 !== s5 && i7.push(c(s5));
    return i7;
  }
  static _$Eu(t6, s5) {
    const i7 = s5.attribute;
    return false === i7 ? void 0 : "string" == typeof i7 ? i7 : "string" == typeof t6 ? t6.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t6) => this.enableUpdating = t6), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t6) => t6(this));
  }
  addController(t6) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t6), void 0 !== this.renderRoot && this.isConnected && t6.hostConnected?.();
  }
  removeController(t6) {
    this._$EO?.delete(t6);
  }
  _$E_() {
    const t6 = /* @__PURE__ */ new Map(), s5 = this.constructor.elementProperties;
    for (const i7 of s5.keys()) this.hasOwnProperty(i7) && (t6.set(i7, this[i7]), delete this[i7]);
    t6.size > 0 && (this._$Ep = t6);
  }
  createRenderRoot() {
    const t6 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t6, this.constructor.elementStyles), t6;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), this._$EO?.forEach((t6) => t6.hostConnected?.());
  }
  enableUpdating(t6) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t6) => t6.hostDisconnected?.());
  }
  attributeChangedCallback(t6, s5, i7) {
    this._$AK(t6, i7);
  }
  _$ET(t6, s5) {
    const i7 = this.constructor.elementProperties.get(t6), e6 = this.constructor._$Eu(t6, i7);
    if (void 0 !== e6 && true === i7.reflect) {
      const h4 = (void 0 !== i7.converter?.toAttribute ? i7.converter : u).toAttribute(s5, i7.type);
      this._$Em = t6, null == h4 ? this.removeAttribute(e6) : this.setAttribute(e6, h4), this._$Em = null;
    }
  }
  _$AK(t6, s5) {
    const i7 = this.constructor, e6 = i7._$Eh.get(t6);
    if (void 0 !== e6 && this._$Em !== e6) {
      const t7 = i7.getPropertyOptions(e6), h4 = "function" == typeof t7.converter ? { fromAttribute: t7.converter } : void 0 !== t7.converter?.fromAttribute ? t7.converter : u;
      this._$Em = e6;
      const r6 = h4.fromAttribute(s5, t7.type);
      this[e6] = r6 ?? this._$Ej?.get(e6) ?? r6, this._$Em = null;
    }
  }
  requestUpdate(t6, s5, i7, e6 = false, h4) {
    if (void 0 !== t6) {
      const r6 = this.constructor;
      if (false === e6 && (h4 = this[t6]), i7 ?? (i7 = r6.getPropertyOptions(t6)), !((i7.hasChanged ?? f)(h4, s5) || i7.useDefault && i7.reflect && h4 === this._$Ej?.get(t6) && !this.hasAttribute(r6._$Eu(t6, i7)))) return;
      this.C(t6, s5, i7);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t6, s5, { useDefault: i7, reflect: e6, wrapped: h4 }, r6) {
    i7 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t6) && (this._$Ej.set(t6, r6 ?? s5 ?? this[t6]), true !== h4 || void 0 !== r6) || (this._$AL.has(t6) || (this.hasUpdated || i7 || (s5 = void 0), this._$AL.set(t6, s5)), true === e6 && this._$Em !== t6 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t6));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t7) {
      Promise.reject(t7);
    }
    const t6 = this.scheduleUpdate();
    return null != t6 && await t6, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t8, s6] of this._$Ep) this[t8] = s6;
        this._$Ep = void 0;
      }
      const t7 = this.constructor.elementProperties;
      if (t7.size > 0) for (const [s6, i7] of t7) {
        const { wrapped: t8 } = i7, e6 = this[s6];
        true !== t8 || this._$AL.has(s6) || void 0 === e6 || this.C(s6, void 0, i7, e6);
      }
    }
    let t6 = false;
    const s5 = this._$AL;
    try {
      t6 = this.shouldUpdate(s5), t6 ? (this.willUpdate(s5), this._$EO?.forEach((t7) => t7.hostUpdate?.()), this.update(s5)) : this._$EM();
    } catch (s6) {
      throw t6 = false, this._$EM(), s6;
    }
    t6 && this._$AE(s5);
  }
  willUpdate(t6) {
  }
  _$AE(t6) {
    this._$EO?.forEach((t7) => t7.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t6)), this.updated(t6);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t6) {
    return true;
  }
  update(t6) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t7) => this._$ET(t7, this[t7]))), this._$EM();
  }
  updated(t6) {
  }
  firstUpdated(t6) {
  }
};
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ?? (a.reactiveElementVersions = [])).push("2.1.2");

// node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = (t6) => t6;
var s2 = t2.trustedTypes;
var e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t6) => t6 }) : void 0;
var h2 = "$lit$";
var o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var n3 = "?" + o3;
var r3 = `<${n3}>`;
var l2 = document;
var c3 = () => l2.createComment("");
var a2 = (t6) => null === t6 || "object" != typeof t6 && "function" != typeof t6;
var u2 = Array.isArray;
var d2 = (t6) => u2(t6) || "function" == typeof t6?.[Symbol.iterator];
var f2 = "[ 	\n\f\r]";
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y2 = /^(?:script|style|textarea|title)$/i;
var x = (t6) => (i7, ...s5) => ({ _$litType$: t6, strings: i7, values: s5 });
var b2 = x(1);
var w = x(2);
var T = x(3);
var E = /* @__PURE__ */ Symbol.for("lit-noChange");
var A = /* @__PURE__ */ Symbol.for("lit-nothing");
var C = /* @__PURE__ */ new WeakMap();
var P = l2.createTreeWalker(l2, 129);
function V(t6, i7) {
  if (!u2(t6) || !t6.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e3 ? e3.createHTML(i7) : i7;
}
var N = (t6, i7) => {
  const s5 = t6.length - 1, e6 = [];
  let n5, l3 = 2 === i7 ? "<svg>" : 3 === i7 ? "<math>" : "", c5 = v;
  for (let i8 = 0; i8 < s5; i8++) {
    const s6 = t6[i8];
    let a3, u5, d3 = -1, f3 = 0;
    for (; f3 < s6.length && (c5.lastIndex = f3, u5 = c5.exec(s6), null !== u5); ) f3 = c5.lastIndex, c5 === v ? "!--" === u5[1] ? c5 = _ : void 0 !== u5[1] ? c5 = m : void 0 !== u5[2] ? (y2.test(u5[2]) && (n5 = RegExp("</" + u5[2], "g")), c5 = p2) : void 0 !== u5[3] && (c5 = p2) : c5 === p2 ? ">" === u5[0] ? (c5 = n5 ?? v, d3 = -1) : void 0 === u5[1] ? d3 = -2 : (d3 = c5.lastIndex - u5[2].length, a3 = u5[1], c5 = void 0 === u5[3] ? p2 : '"' === u5[3] ? $ : g) : c5 === $ || c5 === g ? c5 = p2 : c5 === _ || c5 === m ? c5 = v : (c5 = p2, n5 = void 0);
    const x2 = c5 === p2 && t6[i8 + 1].startsWith("/>") ? " " : "";
    l3 += c5 === v ? s6 + r3 : d3 >= 0 ? (e6.push(a3), s6.slice(0, d3) + h2 + s6.slice(d3) + o3 + x2) : s6 + o3 + (-2 === d3 ? i8 : x2);
  }
  return [V(t6, l3 + (t6[s5] || "<?>") + (2 === i7 ? "</svg>" : 3 === i7 ? "</math>" : "")), e6];
};
var S2 = class _S {
  constructor({ strings: t6, _$litType$: i7 }, e6) {
    let r6;
    this.parts = [];
    let l3 = 0, a3 = 0;
    const u5 = t6.length - 1, d3 = this.parts, [f3, v3] = N(t6, i7);
    if (this.el = _S.createElement(f3, e6), P.currentNode = this.el.content, 2 === i7 || 3 === i7) {
      const t7 = this.el.content.firstChild;
      t7.replaceWith(...t7.childNodes);
    }
    for (; null !== (r6 = P.nextNode()) && d3.length < u5; ) {
      if (1 === r6.nodeType) {
        if (r6.hasAttributes()) for (const t7 of r6.getAttributeNames()) if (t7.endsWith(h2)) {
          const i8 = v3[a3++], s5 = r6.getAttribute(t7).split(o3), e7 = /([.?@])?(.*)/.exec(i8);
          d3.push({ type: 1, index: l3, name: e7[2], strings: s5, ctor: "." === e7[1] ? I : "?" === e7[1] ? L : "@" === e7[1] ? z : H }), r6.removeAttribute(t7);
        } else t7.startsWith(o3) && (d3.push({ type: 6, index: l3 }), r6.removeAttribute(t7));
        if (y2.test(r6.tagName)) {
          const t7 = r6.textContent.split(o3), i8 = t7.length - 1;
          if (i8 > 0) {
            r6.textContent = s2 ? s2.emptyScript : "";
            for (let s5 = 0; s5 < i8; s5++) r6.append(t7[s5], c3()), P.nextNode(), d3.push({ type: 2, index: ++l3 });
            r6.append(t7[i8], c3());
          }
        }
      } else if (8 === r6.nodeType) if (r6.data === n3) d3.push({ type: 2, index: l3 });
      else {
        let t7 = -1;
        for (; -1 !== (t7 = r6.data.indexOf(o3, t7 + 1)); ) d3.push({ type: 7, index: l3 }), t7 += o3.length - 1;
      }
      l3++;
    }
  }
  static createElement(t6, i7) {
    const s5 = l2.createElement("template");
    return s5.innerHTML = t6, s5;
  }
};
function M(t6, i7, s5 = t6, e6) {
  if (i7 === E) return i7;
  let h4 = void 0 !== e6 ? s5._$Co?.[e6] : s5._$Cl;
  const o6 = a2(i7) ? void 0 : i7._$litDirective$;
  return h4?.constructor !== o6 && (h4?._$AO?.(false), void 0 === o6 ? h4 = void 0 : (h4 = new o6(t6), h4._$AT(t6, s5, e6)), void 0 !== e6 ? (s5._$Co ?? (s5._$Co = []))[e6] = h4 : s5._$Cl = h4), void 0 !== h4 && (i7 = M(t6, h4._$AS(t6, i7.values), h4, e6)), i7;
}
var R = class {
  constructor(t6, i7) {
    this._$AV = [], this._$AN = void 0, this._$AD = t6, this._$AM = i7;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t6) {
    const { el: { content: i7 }, parts: s5 } = this._$AD, e6 = (t6?.creationScope ?? l2).importNode(i7, true);
    P.currentNode = e6;
    let h4 = P.nextNode(), o6 = 0, n5 = 0, r6 = s5[0];
    for (; void 0 !== r6; ) {
      if (o6 === r6.index) {
        let i8;
        2 === r6.type ? i8 = new k(h4, h4.nextSibling, this, t6) : 1 === r6.type ? i8 = new r6.ctor(h4, r6.name, r6.strings, this, t6) : 6 === r6.type && (i8 = new Z(h4, this, t6)), this._$AV.push(i8), r6 = s5[++n5];
      }
      o6 !== r6?.index && (h4 = P.nextNode(), o6++);
    }
    return P.currentNode = l2, e6;
  }
  p(t6) {
    let i7 = 0;
    for (const s5 of this._$AV) void 0 !== s5 && (void 0 !== s5.strings ? (s5._$AI(t6, s5, i7), i7 += s5.strings.length - 2) : s5._$AI(t6[i7])), i7++;
  }
};
var k = class _k {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t6, i7, s5, e6) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t6, this._$AB = i7, this._$AM = s5, this.options = e6, this._$Cv = e6?.isConnected ?? true;
  }
  get parentNode() {
    let t6 = this._$AA.parentNode;
    const i7 = this._$AM;
    return void 0 !== i7 && 11 === t6?.nodeType && (t6 = i7.parentNode), t6;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t6, i7 = this) {
    t6 = M(this, t6, i7), a2(t6) ? t6 === A || null == t6 || "" === t6 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t6 !== this._$AH && t6 !== E && this._(t6) : void 0 !== t6._$litType$ ? this.$(t6) : void 0 !== t6.nodeType ? this.T(t6) : d2(t6) ? this.k(t6) : this._(t6);
  }
  O(t6) {
    return this._$AA.parentNode.insertBefore(t6, this._$AB);
  }
  T(t6) {
    this._$AH !== t6 && (this._$AR(), this._$AH = this.O(t6));
  }
  _(t6) {
    this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t6 : this.T(l2.createTextNode(t6)), this._$AH = t6;
  }
  $(t6) {
    const { values: i7, _$litType$: s5 } = t6, e6 = "number" == typeof s5 ? this._$AC(t6) : (void 0 === s5.el && (s5.el = S2.createElement(V(s5.h, s5.h[0]), this.options)), s5);
    if (this._$AH?._$AD === e6) this._$AH.p(i7);
    else {
      const t7 = new R(e6, this), s6 = t7.u(this.options);
      t7.p(i7), this.T(s6), this._$AH = t7;
    }
  }
  _$AC(t6) {
    let i7 = C.get(t6.strings);
    return void 0 === i7 && C.set(t6.strings, i7 = new S2(t6)), i7;
  }
  k(t6) {
    u2(this._$AH) || (this._$AH = [], this._$AR());
    const i7 = this._$AH;
    let s5, e6 = 0;
    for (const h4 of t6) e6 === i7.length ? i7.push(s5 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s5 = i7[e6], s5._$AI(h4), e6++;
    e6 < i7.length && (this._$AR(s5 && s5._$AB.nextSibling, e6), i7.length = e6);
  }
  _$AR(t6 = this._$AA.nextSibling, s5) {
    for (this._$AP?.(false, true, s5); t6 !== this._$AB; ) {
      const s6 = i3(t6).nextSibling;
      i3(t6).remove(), t6 = s6;
    }
  }
  setConnected(t6) {
    void 0 === this._$AM && (this._$Cv = t6, this._$AP?.(t6));
  }
};
var H = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t6, i7, s5, e6, h4) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t6, this.name = i7, this._$AM = e6, this.options = h4, s5.length > 2 || "" !== s5[0] || "" !== s5[1] ? (this._$AH = Array(s5.length - 1).fill(new String()), this.strings = s5) : this._$AH = A;
  }
  _$AI(t6, i7 = this, s5, e6) {
    const h4 = this.strings;
    let o6 = false;
    if (void 0 === h4) t6 = M(this, t6, i7, 0), o6 = !a2(t6) || t6 !== this._$AH && t6 !== E, o6 && (this._$AH = t6);
    else {
      const e7 = t6;
      let n5, r6;
      for (t6 = h4[0], n5 = 0; n5 < h4.length - 1; n5++) r6 = M(this, e7[s5 + n5], i7, n5), r6 === E && (r6 = this._$AH[n5]), o6 || (o6 = !a2(r6) || r6 !== this._$AH[n5]), r6 === A ? t6 = A : t6 !== A && (t6 += (r6 ?? "") + h4[n5 + 1]), this._$AH[n5] = r6;
    }
    o6 && !e6 && this.j(t6);
  }
  j(t6) {
    t6 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t6 ?? "");
  }
};
var I = class extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t6) {
    this.element[this.name] = t6 === A ? void 0 : t6;
  }
};
var L = class extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t6) {
    this.element.toggleAttribute(this.name, !!t6 && t6 !== A);
  }
};
var z = class extends H {
  constructor(t6, i7, s5, e6, h4) {
    super(t6, i7, s5, e6, h4), this.type = 5;
  }
  _$AI(t6, i7 = this) {
    if ((t6 = M(this, t6, i7, 0) ?? A) === E) return;
    const s5 = this._$AH, e6 = t6 === A && s5 !== A || t6.capture !== s5.capture || t6.once !== s5.once || t6.passive !== s5.passive, h4 = t6 !== A && (s5 === A || e6);
    e6 && this.element.removeEventListener(this.name, this, s5), h4 && this.element.addEventListener(this.name, this, t6), this._$AH = t6;
  }
  handleEvent(t6) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t6) : this._$AH.handleEvent(t6);
  }
};
var Z = class {
  constructor(t6, i7, s5) {
    this.element = t6, this.type = 6, this._$AN = void 0, this._$AM = i7, this.options = s5;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t6) {
    M(this, t6);
  }
};
var j = { M: h2, P: o3, A: n3, C: 1, L: N, R, D: d2, V: M, I: k, H, N: L, U: z, B: I, F: Z };
var B = t2.litHtmlPolyfillSupport;
B?.(S2, k), (t2.litHtmlVersions ?? (t2.litHtmlVersions = [])).push("3.3.3");
var D = (t6, i7, s5) => {
  const e6 = s5?.renderBefore ?? i7;
  let h4 = e6._$litPart$;
  if (void 0 === h4) {
    const t7 = s5?.renderBefore ?? null;
    e6._$litPart$ = h4 = new k(i7.insertBefore(c3(), t7), t7, void 0, s5 ?? {});
  }
  return h4._$AI(t6), h4;
};

// node_modules/lit-element/lit-element.js
var s3 = globalThis;
var i4 = class extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a;
    const t6 = super.createRenderRoot();
    return (_a = this.renderOptions).renderBefore ?? (_a.renderBefore = t6.firstChild), t6;
  }
  update(t6) {
    const r6 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t6), this._$Do = D(r6, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return E;
  }
};
i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
var o4 = s3.litElementPolyfillSupport;
o4?.({ LitElement: i4 });
(s3.litElementVersions ?? (s3.litElementVersions = [])).push("4.2.2");

// node_modules/@lit/reactive-element/decorators/custom-element.js
var t3 = (t6) => (e6, o6) => {
  void 0 !== o6 ? o6.addInitializer(() => {
    customElements.define(t6, e6);
  }) : customElements.define(t6, e6);
};

// node_modules/@lit/reactive-element/decorators/property.js
var o5 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
var r4 = (t6 = o5, e6, r6) => {
  const { kind: n5, metadata: i7 } = r6;
  let s5 = globalThis.litPropertyMetadata.get(i7);
  if (void 0 === s5 && globalThis.litPropertyMetadata.set(i7, s5 = /* @__PURE__ */ new Map()), "setter" === n5 && ((t6 = Object.create(t6)).wrapped = true), s5.set(r6.name, t6), "accessor" === n5) {
    const { name: o6 } = r6;
    return { set(r7) {
      const n6 = e6.get.call(this);
      e6.set.call(this, r7), this.requestUpdate(o6, n6, t6, true, r7);
    }, init(e7) {
      return void 0 !== e7 && this.C(o6, void 0, t6, e7), e7;
    } };
  }
  if ("setter" === n5) {
    const { name: o6 } = r6;
    return function(r7) {
      const n6 = this[o6];
      e6.call(this, r7), this.requestUpdate(o6, n6, t6, true, r7);
    };
  }
  throw Error("Unsupported decorator location: " + n5);
};
function n4(t6) {
  return (e6, o6) => "object" == typeof o6 ? r4(t6, e6, o6) : ((t7, e7, o7) => {
    const r6 = e7.hasOwnProperty(o7);
    return e7.constructor.createProperty(o7, t7), r6 ? Object.getOwnPropertyDescriptor(e7, o7) : void 0;
  })(t6, e6, o6);
}

// node_modules/@lit/reactive-element/decorators/state.js
function r5(r6) {
  return n4({ ...r6, state: true, attribute: false });
}

// node_modules/lit-html/directive.js
var t4 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e5 = (t6) => (...e6) => ({ _$litDirective$: t6, values: e6 });
var i5 = class {
  constructor(t6) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t6, e6, i7) {
    this._$Ct = t6, this._$AM = e6, this._$Ci = i7;
  }
  _$AS(t6, e6) {
    return this.update(t6, e6);
  }
  update(t6, e6) {
    return this.render(...e6);
  }
};

// node_modules/lit-html/directive-helpers.js
var { I: t5 } = j;
var i6 = (o6) => o6;
var s4 = () => document.createComment("");
var v2 = (o6, n5, e6) => {
  const l3 = o6._$AA.parentNode, d3 = void 0 === n5 ? o6._$AB : n5._$AA;
  if (void 0 === e6) {
    const i7 = l3.insertBefore(s4(), d3), n6 = l3.insertBefore(s4(), d3);
    e6 = new t5(i7, n6, o6, o6.options);
  } else {
    const t6 = e6._$AB.nextSibling, n6 = e6._$AM, c5 = n6 !== o6;
    if (c5) {
      let t7;
      e6._$AQ?.(o6), e6._$AM = o6, void 0 !== e6._$AP && (t7 = o6._$AU) !== n6._$AU && e6._$AP(t7);
    }
    if (t6 !== d3 || c5) {
      let o7 = e6._$AA;
      for (; o7 !== t6; ) {
        const t7 = i6(o7).nextSibling;
        i6(l3).insertBefore(o7, d3), o7 = t7;
      }
    }
  }
  return e6;
};
var u3 = (o6, t6, i7 = o6) => (o6._$AI(t6, i7), o6);
var m2 = {};
var p3 = (o6, t6 = m2) => o6._$AH = t6;
var M2 = (o6) => o6._$AH;
var h3 = (o6) => {
  o6._$AR(), o6._$AA.remove();
};

// node_modules/lit-html/directives/repeat.js
var u4 = (e6, s5, t6) => {
  const r6 = /* @__PURE__ */ new Map();
  for (let l3 = s5; l3 <= t6; l3++) r6.set(e6[l3], l3);
  return r6;
};
var c4 = e5(class extends i5 {
  constructor(e6) {
    if (super(e6), e6.type !== t4.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e6, s5, t6) {
    let r6;
    void 0 === t6 ? t6 = s5 : void 0 !== s5 && (r6 = s5);
    const l3 = [], o6 = [];
    let i7 = 0;
    for (const s6 of e6) l3[i7] = r6 ? r6(s6, i7) : i7, o6[i7] = t6(s6, i7), i7++;
    return { values: o6, keys: l3 };
  }
  render(e6, s5, t6) {
    return this.dt(e6, s5, t6).values;
  }
  update(s5, [t6, r6, c5]) {
    const d3 = M2(s5), { values: p4, keys: a3 } = this.dt(t6, r6, c5);
    if (!Array.isArray(d3)) return this.ut = a3, p4;
    const h4 = this.ut ?? (this.ut = []), v3 = [];
    let m3, y3, x2 = 0, j2 = d3.length - 1, k2 = 0, w2 = p4.length - 1;
    for (; x2 <= j2 && k2 <= w2; ) if (null === d3[x2]) x2++;
    else if (null === d3[j2]) j2--;
    else if (h4[x2] === a3[k2]) v3[k2] = u3(d3[x2], p4[k2]), x2++, k2++;
    else if (h4[j2] === a3[w2]) v3[w2] = u3(d3[j2], p4[w2]), j2--, w2--;
    else if (h4[x2] === a3[w2]) v3[w2] = u3(d3[x2], p4[w2]), v2(s5, v3[w2 + 1], d3[x2]), x2++, w2--;
    else if (h4[j2] === a3[k2]) v3[k2] = u3(d3[j2], p4[k2]), v2(s5, d3[x2], d3[j2]), j2--, k2++;
    else if (void 0 === m3 && (m3 = u4(a3, k2, w2), y3 = u4(h4, x2, j2)), m3.has(h4[x2])) if (m3.has(h4[j2])) {
      const e6 = y3.get(a3[k2]), t7 = void 0 !== e6 ? d3[e6] : null;
      if (null === t7) {
        const e7 = v2(s5, d3[x2]);
        u3(e7, p4[k2]), v3[k2] = e7;
      } else v3[k2] = u3(t7, p4[k2]), v2(s5, d3[x2], t7), d3[e6] = null;
      k2++;
    } else h3(d3[j2]), j2--;
    else h3(d3[x2]), x2++;
    for (; k2 <= w2; ) {
      const e6 = v2(s5, v3[w2 + 1]);
      u3(e6, p4[k2]), v3[k2++] = e6;
    }
    for (; x2 <= j2; ) {
      const e6 = d3[x2++];
      null !== e6 && h3(e6);
    }
    return this.ut = a3, p3(s5, v3), E;
  }
});

// src/const.ts
var CARD_VERSION = "2.5.0";
var DELIVERED = 0;
var WAITING = 1;
var RECEIVED = 2;
var IN_TRANSPORT = 3;
var IN_DELIVERY = 4;
var READY_FOR_PICKUP = 5;
var RETURNED = 6;
var UNKNOWN = 7;
var STATUSES = [WAITING, RECEIVED, IN_TRANSPORT, IN_DELIVERY, READY_FOR_PICKUP, DELIVERED, RETURNED, UNKNOWN];
var AT_PICKUP_POINT = [READY_FOR_PICKUP, DELIVERED, RETURNED];
var FINISHED = [DELIVERED, RETURNED];
var PROGRESS = {
  [WAITING]: 0.08,
  [RECEIVED]: 0.3,
  [IN_TRANSPORT]: 0.55,
  [IN_DELIVERY]: 0.75,
  [READY_FOR_PICKUP]: 0.9,
  [DELIVERED]: 1,
  [RETURNED]: 1,
  [UNKNOWN]: 0
};

// src/height.ts
var HEIGHT_MODES = ["auto", "fixed", "max"];
var pixels = (value) => value == null || typeof value === "number" && Number.isFinite(value) && value > 0;
function validHeight(config) {
  return (config.height_mode == null || HEIGHT_MODES.includes(config.height_mode)) && pixels(config.height) && pixels(config.max_height);
}
function heightMode(config) {
  return config.height_mode ?? (config.height ? "fixed" : config.max_height ? "max" : "auto");
}
var ROW_HEIGHT = 56;
var ROW_GAP = 8;
function heightStyle(config, layout, minimum = 0) {
  const rows = config.grid_options ? config.grid_options.rows : config.layout_options?.grid_rows;
  if (layout === "grid" && typeof rows === "number") {
    return "height: 100%";
  }
  const mode = heightMode(config);
  if (mode === "fixed" && config.height) {
    return `height: ${Math.max(config.height, minimum)}px`;
  }
  return mode === "max" && config.max_height ? `max-height: ${Math.max(config.max_height, minimum)}px` : "";
}
function gridMinRows(minimum) {
  return Math.max(1, Math.ceil((minimum + ROW_GAP) / (ROW_HEIGHT + ROW_GAP)));
}
function heightCardSize(config, content, minimum = 0) {
  const mode = heightMode(config);
  if (mode === "fixed" && config.height) {
    return Math.max(1, Math.round(Math.max(config.height, minimum) / 50));
  }
  return mode === "max" && config.max_height ? Math.max(1, Math.min(content, Math.round(Math.max(config.max_height, minimum) / 50))) : content;
}
function heightSchema(config, text) {
  const mode = heightMode(config);
  const field = (name) => ({
    name,
    selector: { number: { min: 100, max: 2e3, step: 10, unit_of_measurement: "px", mode: "box" } }
  });
  return [
    {
      name: "height_mode",
      selector: {
        select: { mode: "dropdown", options: HEIGHT_MODES.map((value) => ({ value, label: text(`editor.height_mode_${value}`) })) }
      }
    },
    ...mode === "fixed" ? [field("height")] : mode === "max" ? [field("max_height")] : []
  ];
}
function heightData(config) {
  return { ...config, height_mode: heightMode(config) };
}
function tidyHeight(config) {
  const mode = heightMode(config);
  const tidied = { ...config };
  if (mode !== "fixed" || !tidied.height) {
    delete tidied.height;
  }
  if (mode !== "max" || !tidied.max_height) {
    delete tidied.max_height;
  }
  if (!tidied.height_mode || heightMode({ ...tidied, height_mode: void 0 }) === mode) {
    delete tidied.height_mode;
  }
  return tidied;
}

// src/localize/languages/en.json
var en_default = {
  common: {
    invalid_configuration: "Invalid configuration",
    invalid_height: "Invalid height. height and max_height must be positive numbers of pixels, and height_mode auto, fixed or max.",
    description: "Package tracker card for tracking parcels",
    name: "Package tracker card",
    no_packages: "No packages to track at the moment",
    checked: "checked",
    just_now: "just now",
    unavailable: "not available",
    no_entity: "No such entity:",
    pickup_by: "Pick up by",
    estimated: "Estimated",
    show_code: "Show the pickup code",
    compartment: "Compartment",
    shelf: "Shelf",
    show_qr: "Show the QR code",
    qr_code: "QR code",
    close: "Close",
    parcels: "parcels"
  },
  statuses: {
    "0": "Delivered",
    "1": "Waiting",
    "2": "Received by the carrier",
    "3": "In transit",
    "4": "Being delivered",
    "5": "Ready for pickup",
    "6": "Returned to sender",
    "7": "Exception"
  },
  direction: {
    incoming: "Incoming",
    outgoing: "Sent"
  },
  editor: {
    entity: "Tracked accounts",
    entity_helper: "The accounts whose packages are shown. Packages from several are listed together.",
    title: "Title",
    statuses: "Statuses to show",
    statuses_helper: "Only packages with one of these statuses are listed. With none chosen, all of them are.",
    direction: "Direction",
    direction_helper: "Incoming packages, sent ones, or both. When the card shows both, each package has a marker that says which way it goes. A package whose direction the integration doesn't give is incoming.",
    direction_all: "All",
    direction_incoming: "Incoming",
    direction_outgoing: "Sent",
    max_events: "Most incoming packages to show",
    max_sent_events: "Most sent packages to show",
    height_mode: "Height",
    height_mode_helper: "A height set in the layout tab of a sections view is used instead.",
    height_mode_auto: "Fits the content",
    height_mode_fixed: "Fixed",
    height_mode_max: "Grows up to a limit",
    height: "Fixed height",
    height_helper: "The card is always this tall, and the list scrolls inside it.",
    max_height: "Maximum height",
    max_height_helper: "The card grows with its content up to this height, and then the list scrolls.",
    show_progress: "Progress bar",
    show_latest_event: "Status and time",
    show_latest_event_message: "Latest event",
    show_latest_event_location: "Latest location",
    show_origin: "Sender",
    show_destination: "Destination",
    show_destination_helper: "Where the package is going \u2014 the pickup point when the carrier names one.",
    show_pickup: "Pickup time",
    show_pickup_helper: "Adds the pickup deadline to that row, or the estimated delivery while the package is still on its way.",
    show_details: "Weight and parcels",
    show_details_helper: "The package's weight and how many parcels it has.",
    show_sensors: "Show the package sensors' status when there's nothing to list",
    show_sensors_helper: "Each package sensor, and when it last checked for packages. A sensor that doesn't answer gets a warning.",
    wrap_text: "Wrap long texts",
    wrap_text_helper: "When this is off, overlong texts are cut short instead of wrapping.",
    pickup_code: "Pickup code",
    pickup_code_helper: "The code the package can be picked up with. It must be turned on in the integration's settings too.",
    pickup_code_hidden: "Never shown",
    pickup_code_always: "Always shown",
    pickup_code_toggle: "Revealed when clicked",
    tracking_link: "Package tracking",
    tracking_link_helper: "A click on what opens the official package tracking page.",
    tracking_link_row: "The whole tile",
    tracking_link_number: "The shipment number",
    tracking_link_none: "Nothing"
  }
};

// src/localize/languages/fi.json
var fi_default = {
  common: {
    invalid_configuration: "Virheellinen konfiguraatio",
    invalid_height: "Virheellinen korkeus. Korkeuksien (height ja max_height) on oltava positiivisia lukuja pikselein\xE4, ja korkeustilan (height_mode) auto, fixed tai max.",
    description: "Kortti pakettil\xE4hetysten seuraamiseen",
    name: "L\xE4hetysten seuranta",
    no_packages: "Ei seurattavia paketteja t\xE4ll\xE4 hetkell\xE4",
    checked: "tarkistettu",
    just_now: "juuri nyt",
    unavailable: "ei k\xE4ytett\xE4viss\xE4",
    no_entity: "Entiteetti\xE4 ei ole:",
    pickup_by: "Nouda viimeist\xE4\xE4n",
    estimated: "Arvio",
    show_code: "N\xE4yt\xE4 noutokoodi",
    compartment: "Lokero",
    shelf: "Hylly",
    show_qr: "N\xE4yt\xE4 QR-koodi",
    qr_code: "QR-koodi",
    close: "Sulje",
    parcels: "kollia"
  },
  statuses: {
    "0": "Toimitettu",
    "1": "Odottaa",
    "2": "Vastaanotettu",
    "3": "Kuljetuksessa",
    "4": "Toimituksessa",
    "5": "Noudettavissa",
    "6": "Palautettu l\xE4hett\xE4j\xE4lle",
    "7": "Poikkeama"
  },
  direction: {
    incoming: "Saapuva",
    outgoing: "L\xE4hetetty"
  },
  editor: {
    entity: "Seurattavat tilit",
    entity_helper: "Tilit, joiden paketit n\xE4ytet\xE4\xE4n. Useamman tilin paketit listataan yhdess\xE4.",
    title: "Otsikko",
    statuses: "N\xE4ytett\xE4v\xE4t tilat",
    statuses_helper: "Listalla n\xE4ytet\xE4\xE4n vain paketit, joilla on jokin n\xE4ist\xE4 tiloista. Jos mit\xE4\xE4n ei ole valittu, n\xE4ytet\xE4\xE4n kaikki.",
    direction: "Suunta",
    direction_helper: "Saapuvat paketit, l\xE4hetetyt tai molemmat. Kun kortti n\xE4ytt\xE4\xE4 molemmat, jokaisen paketin kohdalla on ilmaisin, joka kertoo kumpaan suuntaan se kulkee. Paketti, jonka suuntaa integraatio ei kerro, on saapuva.",
    direction_all: "Kaikki",
    direction_incoming: "Saapuvat",
    direction_outgoing: "L\xE4hetetyt",
    max_events: "Saapuvia paketteja enint\xE4\xE4n",
    max_sent_events: "L\xE4hetettyj\xE4 paketteja enint\xE4\xE4n",
    height_mode: "Korkeus",
    height_mode_helper: "Osioihin jaetun n\xE4kym\xE4n asettelu-v\xE4lilehdell\xE4 asetettu korkeus ohittaa t\xE4m\xE4n.",
    height_mode_auto: "Sis\xE4ll\xF6n mukaan",
    height_mode_fixed: "Kiinte\xE4",
    height_mode_max: "Kasvaa rajaan asti",
    height: "Kiinte\xE4 korkeus",
    height_helper: "Kortti on aina n\xE4in korkea, ja lista vierii sen sis\xE4ll\xE4.",
    max_height: "Enimm\xE4iskorkeus",
    max_height_helper: "Kortti kasvaa sis\xE4lt\xF6ns\xE4 mukana t\xE4h\xE4n korkeuteen asti, ja sen j\xE4lkeen lista vierii.",
    show_progress: "Edistymispalkki",
    show_latest_event: "Tila ja aika",
    show_latest_event_message: "Viimeisin tapahtuma",
    show_latest_event_location: "Viimeisin sijainti",
    show_origin: "L\xE4hett\xE4j\xE4",
    show_destination: "M\xE4\xE4r\xE4np\xE4\xE4",
    show_destination_helper: "Minne paketti on menossa \u2013 noutopaikka, jos kuljetusyhti\xF6 kertoo sen.",
    show_pickup: "Noutoaika",
    show_pickup_helper: "Lis\xE4\xE4 samalle riville noudon m\xE4\xE4r\xE4ajan, tai arvioidun toimituksen kun paketti on viel\xE4 matkalla.",
    show_details: "Paino ja kollit",
    show_details_helper: "Paketin paino ja kollien m\xE4\xE4r\xE4.",
    show_sensors: "N\xE4yt\xE4 pakettisensorien tila, kun paketteja ei ole",
    show_sensors_helper: "Jokainen pakettisensori, ja milloin viimeksi se tarkisti paketit. Sensoreista, jotka eiv\xE4t vastaa, n\xE4ytet\xE4\xE4n varoitus.",
    wrap_text: "Rivit\xE4 pitk\xE4t tekstit",
    wrap_text_helper: "Kun asetus on pois p\xE4\xE4lt\xE4, ylipitk\xE4t tekstit lyhennet\xE4\xE4n rivitt\xE4misen sijaan.",
    pickup_code: "Noutokoodi",
    pickup_code_helper: "Koodi, jolla paketin voi noutaa. Oltava p\xE4\xE4ll\xE4 my\xF6s integraation asetuksissa.",
    pickup_code_hidden: "Ei n\xE4ytet\xE4",
    pickup_code_always: "N\xE4ytet\xE4\xE4n aina",
    pickup_code_toggle: "Paljastuu napsauttamalla",
    tracking_link: "L\xE4hetyksen seuranta",
    tracking_link_helper: "Mist\xE4 napsauttamalla virallinen l\xE4hetyksen seuranta avautuu.",
    tracking_link_row: "Koko laatikosta",
    tracking_link_number: "L\xE4hetystunnuksesta",
    tracking_link_none: "Ei mist\xE4\xE4n"
  }
};

// src/localize/localize.ts
var FILES = { "./languages/en.json": en_default, "./languages/fi.json": fi_default };
var LANGUAGES = Object.fromEntries(
  Object.entries(FILES).map(([path, table]) => [path.replace(/^.*\/|\.json$/g, "").toLowerCase(), table])
);
var LANGUAGE_CODES = Object.keys(LANGUAGES).sort();
function translate(language, key) {
  const code = (language ?? "en").split(/[-_]/)[0].toLowerCase();
  return read(LANGUAGES[code], key) ?? read(LANGUAGES.en, key) ?? key;
}
function read(table, key) {
  let value = table;
  for (const part of key.split(".")) {
    if (value === null || typeof value !== "object") {
      return void 0;
    }
    value = value[part];
  }
  return typeof value === "string" ? value : void 0;
}
function browserLanguage() {
  return document.documentElement.lang || navigator.language || "en";
}

// src/editor.ts
var DEFAULTS = {
  show_progress: true,
  show_pickup: true,
  show_details: false,
  show_sensors: true,
  wrap_text: false,
  pickup_code: "hidden",
  tracking_link: "row",
  direction: "all",
  show_latest_event: true,
  show_latest_event_message: true,
  show_latest_event_location: true,
  show_origin: true,
  show_destination: true
};
function withTitle(config) {
  const { name, ...rest } = config;
  return name === void 0 || rest.title !== void 0 ? { ...rest } : { ...rest, title: name };
}
function trackingEntities(hass) {
  return Object.keys(hass.states).filter((id) => Array.isArray(hass.states[id]?.attributes?.packages)).sort();
}
function schema(hass, config, text) {
  return [
    {
      name: "entity",
      required: true,
      selector: { entity: { multiple: true, include_entities: trackingEntities(hass) } }
    },
    { name: "title", selector: { text: {} } },
    {
      name: "statuses",
      selector: {
        select: {
          multiple: true,
          mode: "list",
          options: STATUSES.map((status) => ({ value: String(status), label: text(`statuses.${status}`) }))
        }
      }
    },
    {
      name: "direction",
      selector: {
        select: {
          mode: "dropdown",
          options: [
            { value: "all", label: text("editor.direction_all") },
            { value: "incoming", label: text("editor.direction_incoming") },
            { value: "outgoing", label: text("editor.direction_outgoing") }
          ]
        }
      }
    },
    {
      type: "grid",
      name: "",
      schema: [
        { name: "max_events", selector: { number: { min: 1, max: 50, step: 1, mode: "box" } } },
        { name: "max_sent_events", selector: { number: { min: 1, max: 50, step: 1, mode: "box" } } }
      ]
    },
    ...heightSchema(config, text),
    {
      name: "pickup_code",
      selector: {
        select: {
          mode: "dropdown",
          options: [
            { value: "hidden", label: text("editor.pickup_code_hidden") },
            { value: "always", label: text("editor.pickup_code_always") },
            { value: "toggle", label: text("editor.pickup_code_toggle") }
          ]
        }
      }
    },
    {
      name: "tracking_link",
      selector: {
        select: {
          mode: "dropdown",
          options: [
            { value: "row", label: text("editor.tracking_link_row") },
            { value: "number", label: text("editor.tracking_link_number") },
            { value: "none", label: text("editor.tracking_link_none") }
          ]
        }
      }
    },
    {
      type: "grid",
      name: "",
      schema: [
        { name: "show_progress", selector: { boolean: {} } },
        { name: "show_details", selector: { boolean: {} } },
        { name: "wrap_text", selector: { boolean: {} } },
        { name: "show_latest_event", selector: { boolean: {} } },
        { name: "show_latest_event_message", selector: { boolean: {} } },
        { name: "show_latest_event_location", selector: { boolean: {} } },
        { name: "show_origin", selector: { boolean: {} } },
        { name: "show_destination", selector: { boolean: {} } },
        { name: "show_pickup", selector: { boolean: {} } },
        { name: "show_sensors", selector: { boolean: {} } }
      ]
    }
  ];
}
var PackageTrackerCardEditor = class extends i4 {
  constructor() {
    super(...arguments);
    this.config = { type: "custom:package-tracker-card", entity: [] };
  }
  setConfig(config) {
    this.config = withTitle(config);
  }
  render() {
    if (!this.hass) {
      return A;
    }
    const entity = typeof this.config.entity === "string" ? [this.config.entity] : this.config.entity;
    const statuses = (this.config.statuses?.length ? this.config.statuses : STATUSES).map(String);
    return b2`
            <ha-form
                .hass=${this.hass}
                .data=${{ ...DEFAULTS, ...heightData(this.config), entity, statuses }}
                .schema=${schema(this.hass, this.config, (key) => this.text(key))}
                .computeLabel=${(entry) => this.text(`editor.${entry.name}`)}
                .computeHelper=${(entry) => this.helper(entry.name)}
                @value-changed=${this.valueChanged}
            ></ha-form>
        `;
  }
  valueChanged(event) {
    const config = tidyHeight(event.detail.value);
    const chosen = (config.statuses ?? []).map(Number);
    const statuses = STATUSES.filter((status) => chosen.includes(status));
    if (statuses.length === 0 || statuses.length === STATUSES.length) {
      delete config.statuses;
    } else {
      config.statuses = statuses;
    }
    for (const key of ["max_events", "max_sent_events", "title"]) {
      const value = config[key];
      if (value === void 0 || value === null || String(value) === "") {
        delete config[key];
      }
    }
    for (const [key, value] of Object.entries(DEFAULTS)) {
      if (config[key] === value) {
        delete config[key];
      }
    }
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }
  text(key) {
    return translate(this.language(), key);
  }
  helper(name) {
    const key = `editor.${name}_helper`;
    const helper = translate(this.language(), key);
    return helper === key ? void 0 : helper;
  }
  language() {
    return this.hass?.locale?.language ?? this.hass?.language ?? browserLanguage();
  }
};
__decorateClass([
  n4({ attribute: false })
], PackageTrackerCardEditor.prototype, "hass", 2);
__decorateClass([
  r5()
], PackageTrackerCardEditor.prototype, "config", 2);
PackageTrackerCardEditor = __decorateClass([
  t3("package-tracker-card-editor")
], PackageTrackerCardEditor);

// src/fade.ts
var fadeStyles = i`
    .fades {
        --fade-length: min(24px, 25%);
        scroll-padding-block: calc(var(--fade-top-offset, 0px) + var(--fade-length, 24px)) var(--fade-length, 24px);
    }

    .fade-top {
        mask-image: linear-gradient(
            to bottom,
            #000 var(--fade-top-offset, 0px),
            transparent var(--fade-top-offset, 0px),
            #000 calc(var(--fade-top-offset, 0px) + var(--fade-length, 24px))
        );
    }

    .fade-bottom {
        mask-image: linear-gradient(to top, transparent, #000 var(--fade-length, 24px));
    }

    .fade-top.fade-bottom {
        mask-image: linear-gradient(
            to bottom,
            #000 var(--fade-top-offset, 0px),
            transparent var(--fade-top-offset, 0px),
            #000 calc(var(--fade-top-offset, 0px) + var(--fade-length, 24px)),
            #000 calc(100% - var(--fade-length, 24px)),
            transparent
        );
    }
`;
function markFade(part) {
  const hidden = part.scrollHeight - part.clientHeight;
  part.classList.toggle("fade-top", hidden > 1 && part.scrollTop > 1);
  part.classList.toggle("fade-bottom", hidden > 1 && hidden - part.scrollTop > 1);
}
var onScroll = (event) => markFade(event.currentTarget);
var ScrollFade = class {
  constructor(host, parts) {
    this.host = host;
    this.parts = parts;
    /** Each followed part with the children whose size it watches. */
    this.followed = /* @__PURE__ */ new Map();
    this.resized = typeof ResizeObserver === "undefined" ? void 0 : new ResizeObserver((entries) => {
      for (const { target } of entries) {
        const part = this.followed.has(target) ? target : target.parentElement;
        if (part && this.followed.has(part)) {
          markFade(part);
        }
      }
    });
    host.addController(this);
  }
  hostConnected() {
    if (this.host.hasUpdated) {
      this.follow();
    }
  }
  hostUpdated() {
    if (this.host.isConnected) {
      this.follow();
    }
  }
  hostDisconnected() {
    for (const part of [...this.followed.keys()]) {
      this.forget(part);
    }
  }
  follow() {
    const now = new Set(this.parts());
    for (const part of [...this.followed.keys()]) {
      if (!now.has(part)) {
        this.forget(part);
      }
    }
    for (const part of now) {
      if (!this.followed.has(part)) {
        part.addEventListener("scroll", onScroll, { passive: true });
        this.resized?.observe(part);
      }
      part.classList.add("fades");
      const before = this.followed.get(part) ?? [];
      const children = [...part.children];
      before.filter((child) => !children.includes(child)).forEach((child) => this.resized?.unobserve(child));
      children.filter((child) => !before.includes(child)).forEach((child) => this.resized?.observe(child));
      this.followed.set(part, children);
      markFade(part);
    }
  }
  forget(part) {
    this.followed.get(part)?.forEach((child) => this.resized?.unobserve(child));
    this.followed.delete(part);
    part.removeEventListener("scroll", onScroll);
    this.resized?.unobserve(part);
    part.classList.remove("fades", "fade-top", "fade-bottom");
  }
};

// src/packages.ts
var ICONS = [
  "mdi:checkbox-marked",
  "mdi:file-document",
  "mdi:clock",
  "mdi:truck-delivery",
  "mdi:human-dolly",
  "mdi:check-decagram",
  "mdi:arrow-u-left-top-bold",
  "mdi:help-circle"
];
var UNKNOWN_ICON = "mdi:help-circle";
function entities(entity) {
  return typeof entity === "string" ? [entity] : entity;
}
function packagesOf(hass, entity) {
  const found = /* @__PURE__ */ new Map();
  let dropped = 0;
  for (const id of entities(entity)) {
    const packages = hass.states[id]?.attributes?.packages;
    if (!Array.isArray(packages)) {
      continue;
    }
    for (const raw of packages) {
      const item = shipmentOf(raw);
      if (!item) {
        dropped++;
        continue;
      }
      const seen = found.get(item.shipment_number);
      if (!seen || moment(item.latest_event_date) > moment(seen.latest_event_date)) {
        found.set(item.shipment_number, item);
      }
    }
  }
  if (dropped > 0 && dropped !== lastDropped) {
    console.warn(`package-tracker-card: left out ${dropped} entries that are not packages in the format README.md describes`);
  }
  lastDropped = dropped;
  return [...found.values()];
}
var lastDropped = 0;
function sensorsOf(hass, entity) {
  return entities(entity).map((id) => {
    const state = hass.states[id];
    const name = state?.attributes?.friendly_name;
    const checked = state?.attributes?.last_checked;
    return {
      name: typeof name === "string" && name !== "" ? name : id,
      available: !!state && state.state !== "unavailable",
      checked: typeof checked === "string" && !Number.isNaN(Date.parse(checked)) ? checked : void 0
    };
  });
}
function ago(iso, language, now = Date.now()) {
  const minutes = Math.floor((now - Date.parse(iso)) / 6e4);
  if (!(minutes >= 1)) {
    return void 0;
  }
  const format = new Intl.RelativeTimeFormat(language, { numeric: "always", style: "short" });
  if (minutes < 60) {
    return format.format(-minutes, "minute");
  }
  const hours = Math.floor(minutes / 60);
  return hours < 48 ? format.format(-hours, "hour") : format.format(-Math.floor(hours / 24), "day");
}
var TEXTS = [
  "shipment_date",
  "raw_status",
  "direction",
  "origin",
  "recipient",
  "origin_city",
  "destination",
  "destination_city",
  "latest_event",
  "latest_event_city",
  "latest_event_country",
  "latest_event_date",
  "source",
  "tracking_url",
  "estimated_delivery",
  "pickup_deadline"
];
var NUMBERS = ["weight", "package_count"];
var POINT_TEXTS = ["name", "street", "postal_code", "city", "type", "available"];
function shipmentOf(raw) {
  if (!isRecord(raw) || typeof raw.shipment_number !== "string" || raw.shipment_number === "" || raw.status == null || raw.status === "") {
    return void 0;
  }
  const item = { shipment_number: raw.shipment_number, status: statusOf(raw.status) };
  for (const key of TEXTS) {
    if (typeof raw[key] === "string") {
      item[key] = raw[key];
    }
  }
  for (const key of NUMBERS) {
    if (typeof raw[key] === "number" && Number.isFinite(raw[key])) {
      item[key] = raw[key];
    }
  }
  item.pickup_code = textOf(raw.pickup_code);
  item.pickup_qr = textOf(raw.pickup_qr);
  if (isRecord(raw.pickup_point)) {
    const point = { compartment: textOf(raw.pickup_point.compartment) };
    for (const key of POINT_TEXTS) {
      if (typeof raw.pickup_point[key] === "string") {
        point[key] = raw.pickup_point[key];
      }
    }
    item.pickup_point = point;
  }
  return item;
}
function statusOf(status) {
  const value = typeof status === "string" && status.trim() !== "" ? Number(status) : status;
  return typeof value === "number" && Number.isInteger(value) && value >= DELIVERED && value <= UNKNOWN ? value : UNKNOWN;
}
function textOf(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return typeof value === "string" && value !== "" ? value : void 0;
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function missingEntities(hass, entity) {
  return entities(entity).filter((id) => hass.states[id] === void 0);
}
function withStatuses(packages, statuses) {
  return statuses && statuses.length > 0 ? packages.filter((item) => statuses.includes(item.status)) : packages;
}
function isOutgoing(item) {
  return item.direction?.toLowerCase() === "outgoing";
}
function withDirection(packages, direction) {
  if (!direction || direction === "all") {
    return packages;
  }
  return packages.filter((item) => isOutgoing(item) === (direction === "outgoing"));
}
function withinLimits(packages, maxIncoming, maxSent) {
  let incoming = 0;
  let sent = 0;
  return packages.filter((item) => {
    if (isOutgoing(item)) {
      sent++;
      return maxSent == null || sent <= maxSent;
    }
    incoming++;
    return maxIncoming == null || incoming <= maxIncoming;
  });
}
function sortPackages(packages) {
  return [...packages].sort((one, other) => {
    const oneDone = FINISHED.includes(one.status);
    const otherDone = FINISHED.includes(other.status);
    if (oneDone !== otherDone) {
      return oneDone ? 1 : -1;
    }
    return moment(other.latest_event_date) - moment(one.latest_event_date);
  });
}
function moment(date) {
  const parsed = date ? Date.parse(date) : NaN;
  return Number.isNaN(parsed) ? 0 : parsed;
}
function iconFor(status) {
  return ICONS[status] ?? UNKNOWN_ICON;
}
function formatDateTime(date) {
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const parsed2 = Date.parse(date);
    return !Number.isNaN(parsed2) && new Date(parsed2).toISOString().startsWith(date) ? date : "";
  }
  const parsed = date ? new Date(date) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return "";
  }
  const pad = (value) => String(value).padStart(2, "0");
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())} ${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
}
function progressOf(status) {
  return PROGRESS[status] ?? PROGRESS[UNKNOWN];
}
function trackingUrl(item) {
  if (typeof item.tracking_url !== "string") {
    return void 0;
  }
  try {
    const url = new URL(item.tracking_url);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : void 0;
  } catch {
    return void 0;
  }
}

// node_modules/qrcode-generator/dist/qrcode.mjs
var qrcode = function(typeNumber, errorCorrectionLevel) {
  const PAD0 = 236;
  const PAD1 = 17;
  let _typeNumber = typeNumber;
  const _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
  let _modules = null;
  let _moduleCount = 0;
  let _dataCache = null;
  const _dataList = [];
  const _this = {};
  const makeImpl = function(test, maskPattern) {
    _moduleCount = _typeNumber * 4 + 17;
    _modules = (function(moduleCount) {
      const modules = new Array(moduleCount);
      for (let row = 0; row < moduleCount; row += 1) {
        modules[row] = new Array(moduleCount);
        for (let col = 0; col < moduleCount; col += 1) {
          modules[row][col] = null;
        }
      }
      return modules;
    })(_moduleCount);
    setupPositionProbePattern(0, 0);
    setupPositionProbePattern(_moduleCount - 7, 0);
    setupPositionProbePattern(0, _moduleCount - 7);
    setupPositionAdjustPattern();
    setupTimingPattern();
    setupTypeInfo(test, maskPattern);
    if (_typeNumber >= 7) {
      setupTypeNumber(test);
    }
    if (_dataCache == null) {
      _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
    }
    mapData(_dataCache, maskPattern);
  };
  const setupPositionProbePattern = function(row, col) {
    for (let r6 = -1; r6 <= 7; r6 += 1) {
      if (row + r6 <= -1 || _moduleCount <= row + r6) continue;
      for (let c5 = -1; c5 <= 7; c5 += 1) {
        if (col + c5 <= -1 || _moduleCount <= col + c5) continue;
        if (0 <= r6 && r6 <= 6 && (c5 == 0 || c5 == 6) || 0 <= c5 && c5 <= 6 && (r6 == 0 || r6 == 6) || 2 <= r6 && r6 <= 4 && 2 <= c5 && c5 <= 4) {
          _modules[row + r6][col + c5] = true;
        } else {
          _modules[row + r6][col + c5] = false;
        }
      }
    }
  };
  const getBestMaskPattern = function() {
    let minLostPoint = 0;
    let pattern = 0;
    for (let i7 = 0; i7 < 8; i7 += 1) {
      makeImpl(true, i7);
      const lostPoint = QRUtil.getLostPoint(_this);
      if (i7 == 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint;
        pattern = i7;
      }
    }
    return pattern;
  };
  const setupTimingPattern = function() {
    for (let r6 = 8; r6 < _moduleCount - 8; r6 += 1) {
      if (_modules[r6][6] != null) {
        continue;
      }
      _modules[r6][6] = r6 % 2 == 0;
    }
    for (let c5 = 8; c5 < _moduleCount - 8; c5 += 1) {
      if (_modules[6][c5] != null) {
        continue;
      }
      _modules[6][c5] = c5 % 2 == 0;
    }
  };
  const setupPositionAdjustPattern = function() {
    const pos = QRUtil.getPatternPosition(_typeNumber);
    for (let i7 = 0; i7 < pos.length; i7 += 1) {
      for (let j2 = 0; j2 < pos.length; j2 += 1) {
        const row = pos[i7];
        const col = pos[j2];
        if (_modules[row][col] != null) {
          continue;
        }
        for (let r6 = -2; r6 <= 2; r6 += 1) {
          for (let c5 = -2; c5 <= 2; c5 += 1) {
            if (r6 == -2 || r6 == 2 || c5 == -2 || c5 == 2 || r6 == 0 && c5 == 0) {
              _modules[row + r6][col + c5] = true;
            } else {
              _modules[row + r6][col + c5] = false;
            }
          }
        }
      }
    }
  };
  const setupTypeNumber = function(test) {
    const bits = QRUtil.getBCHTypeNumber(_typeNumber);
    for (let i7 = 0; i7 < 18; i7 += 1) {
      const mod = !test && (bits >> i7 & 1) == 1;
      _modules[Math.floor(i7 / 3)][i7 % 3 + _moduleCount - 8 - 3] = mod;
    }
    for (let i7 = 0; i7 < 18; i7 += 1) {
      const mod = !test && (bits >> i7 & 1) == 1;
      _modules[i7 % 3 + _moduleCount - 8 - 3][Math.floor(i7 / 3)] = mod;
    }
  };
  const setupTypeInfo = function(test, maskPattern) {
    const data = _errorCorrectionLevel << 3 | maskPattern;
    const bits = QRUtil.getBCHTypeInfo(data);
    for (let i7 = 0; i7 < 15; i7 += 1) {
      const mod = !test && (bits >> i7 & 1) == 1;
      if (i7 < 6) {
        _modules[i7][8] = mod;
      } else if (i7 < 8) {
        _modules[i7 + 1][8] = mod;
      } else {
        _modules[_moduleCount - 15 + i7][8] = mod;
      }
    }
    for (let i7 = 0; i7 < 15; i7 += 1) {
      const mod = !test && (bits >> i7 & 1) == 1;
      if (i7 < 8) {
        _modules[8][_moduleCount - i7 - 1] = mod;
      } else if (i7 < 9) {
        _modules[8][15 - i7 - 1 + 1] = mod;
      } else {
        _modules[8][15 - i7 - 1] = mod;
      }
    }
    _modules[_moduleCount - 8][8] = !test;
  };
  const mapData = function(data, maskPattern) {
    let inc = -1;
    let row = _moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    const maskFunc = QRUtil.getMaskFunction(maskPattern);
    for (let col = _moduleCount - 1; col > 0; col -= 2) {
      if (col == 6) col -= 1;
      while (true) {
        for (let c5 = 0; c5 < 2; c5 += 1) {
          if (_modules[row][col - c5] == null) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = (data[byteIndex] >>> bitIndex & 1) == 1;
            }
            const mask = maskFunc(row, col - c5);
            if (mask) {
              dark = !dark;
            }
            _modules[row][col - c5] = dark;
            bitIndex -= 1;
            if (bitIndex == -1) {
              byteIndex += 1;
              bitIndex = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || _moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  };
  const createBytes = function(buffer, rsBlocks) {
    let offset = 0;
    let maxDcCount = 0;
    let maxEcCount = 0;
    const dcdata = new Array(rsBlocks.length);
    const ecdata = new Array(rsBlocks.length);
    for (let r6 = 0; r6 < rsBlocks.length; r6 += 1) {
      const dcCount = rsBlocks[r6].dataCount;
      const ecCount = rsBlocks[r6].totalCount - dcCount;
      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);
      dcdata[r6] = new Array(dcCount);
      for (let i7 = 0; i7 < dcdata[r6].length; i7 += 1) {
        dcdata[r6][i7] = 255 & buffer.getBuffer()[i7 + offset];
      }
      offset += dcCount;
      const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
      const rawPoly = qrPolynomial(dcdata[r6], rsPoly.getLength() - 1);
      const modPoly = rawPoly.mod(rsPoly);
      ecdata[r6] = new Array(rsPoly.getLength() - 1);
      for (let i7 = 0; i7 < ecdata[r6].length; i7 += 1) {
        const modIndex = i7 + modPoly.getLength() - ecdata[r6].length;
        ecdata[r6][i7] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
      }
    }
    let totalCodeCount = 0;
    for (let i7 = 0; i7 < rsBlocks.length; i7 += 1) {
      totalCodeCount += rsBlocks[i7].totalCount;
    }
    const data = new Array(totalCodeCount);
    let index = 0;
    for (let i7 = 0; i7 < maxDcCount; i7 += 1) {
      for (let r6 = 0; r6 < rsBlocks.length; r6 += 1) {
        if (i7 < dcdata[r6].length) {
          data[index] = dcdata[r6][i7];
          index += 1;
        }
      }
    }
    for (let i7 = 0; i7 < maxEcCount; i7 += 1) {
      for (let r6 = 0; r6 < rsBlocks.length; r6 += 1) {
        if (i7 < ecdata[r6].length) {
          data[index] = ecdata[r6][i7];
          index += 1;
        }
      }
    }
    return data;
  };
  const createData = function(typeNumber2, errorCorrectionLevel2, dataList) {
    const rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, errorCorrectionLevel2);
    const buffer = qrBitBuffer();
    for (let i7 = 0; i7 < dataList.length; i7 += 1) {
      const data = dataList[i7];
      buffer.put(data.getMode(), 4);
      buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
      data.write(buffer);
    }
    let totalDataCount = 0;
    for (let i7 = 0; i7 < rsBlocks.length; i7 += 1) {
      totalDataCount += rsBlocks[i7].dataCount;
    }
    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw "code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")";
    }
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }
    while (buffer.getLengthInBits() % 8 != 0) {
      buffer.putBit(false);
    }
    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD0, 8);
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD1, 8);
    }
    return createBytes(buffer, rsBlocks);
  };
  _this.addData = function(data, mode) {
    mode = mode || "Byte";
    let newData = null;
    switch (mode) {
      case "Numeric":
        newData = qrNumber(data);
        break;
      case "Alphanumeric":
        newData = qrAlphaNum(data);
        break;
      case "Byte":
        newData = qr8BitByte(data);
        break;
      case "Kanji":
        newData = qrKanji(data);
        break;
      default:
        throw "mode:" + mode;
    }
    _dataList.push(newData);
    _dataCache = null;
  };
  _this.isDark = function(row, col) {
    if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
      throw row + "," + col;
    }
    return _modules[row][col];
  };
  _this.getModuleCount = function() {
    return _moduleCount;
  };
  _this.make = function() {
    if (_typeNumber < 1) {
      let typeNumber2 = 1;
      for (; typeNumber2 < 40; typeNumber2++) {
        const rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, _errorCorrectionLevel);
        const buffer = qrBitBuffer();
        for (let i7 = 0; i7 < _dataList.length; i7++) {
          const data = _dataList[i7];
          buffer.put(data.getMode(), 4);
          buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
          data.write(buffer);
        }
        let totalDataCount = 0;
        for (let i7 = 0; i7 < rsBlocks.length; i7++) {
          totalDataCount += rsBlocks[i7].dataCount;
        }
        if (buffer.getLengthInBits() <= totalDataCount * 8) {
          break;
        }
      }
      _typeNumber = typeNumber2;
    }
    makeImpl(false, getBestMaskPattern());
  };
  _this.createTableTag = function(cellSize, margin) {
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    let qrHtml = "";
    qrHtml += '<table style="';
    qrHtml += " border-width: 0px; border-style: none;";
    qrHtml += " border-collapse: collapse;";
    qrHtml += " padding: 0px; margin: " + margin + "px;";
    qrHtml += '">';
    qrHtml += "<tbody>";
    for (let r6 = 0; r6 < _this.getModuleCount(); r6 += 1) {
      qrHtml += "<tr>";
      for (let c5 = 0; c5 < _this.getModuleCount(); c5 += 1) {
        qrHtml += '<td style="';
        qrHtml += " border-width: 0px; border-style: none;";
        qrHtml += " border-collapse: collapse;";
        qrHtml += " padding: 0px; margin: 0px;";
        qrHtml += " width: " + cellSize + "px;";
        qrHtml += " height: " + cellSize + "px;";
        qrHtml += " background-color: ";
        qrHtml += _this.isDark(r6, c5) ? "#000000" : "#ffffff";
        qrHtml += ";";
        qrHtml += '"/>';
      }
      qrHtml += "</tr>";
    }
    qrHtml += "</tbody>";
    qrHtml += "</table>";
    return qrHtml;
  };
  _this.createSvgTag = function(cellSize, margin, alt, title) {
    let opts = {};
    if (typeof arguments[0] == "object") {
      opts = arguments[0];
      cellSize = opts.cellSize;
      margin = opts.margin;
      alt = opts.alt;
      title = opts.title;
    }
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    alt = typeof alt === "string" ? { text: alt } : alt || {};
    alt.text = alt.text || null;
    alt.id = alt.text ? alt.id || "qrcode-description" : null;
    title = typeof title === "string" ? { text: title } : title || {};
    title.text = title.text || null;
    title.id = title.text ? title.id || "qrcode-title" : null;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    let c5, mc, r6, mr, qrSvg = "", rect;
    rect = "l" + cellSize + ",0 0," + cellSize + " -" + cellSize + ",0 0,-" + cellSize + "z ";
    qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
    qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : "";
    qrSvg += ' viewBox="0 0 ' + size + " " + size + '" ';
    qrSvg += ' preserveAspectRatio="xMinYMin meet"';
    qrSvg += title.text || alt.text ? ' role="img" aria-labelledby="' + escapeXml([title.id, alt.id].join(" ").trim()) + '"' : "";
    qrSvg += ">";
    qrSvg += title.text ? '<title id="' + escapeXml(title.id) + '">' + escapeXml(title.text) + "</title>" : "";
    qrSvg += alt.text ? '<description id="' + escapeXml(alt.id) + '">' + escapeXml(alt.text) + "</description>" : "";
    qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
    qrSvg += '<path d="';
    for (r6 = 0; r6 < _this.getModuleCount(); r6 += 1) {
      mr = r6 * cellSize + margin;
      for (c5 = 0; c5 < _this.getModuleCount(); c5 += 1) {
        if (_this.isDark(r6, c5)) {
          mc = c5 * cellSize + margin;
          qrSvg += "M" + mc + "," + mr + rect;
        }
      }
    }
    qrSvg += '" stroke="transparent" fill="black"/>';
    qrSvg += "</svg>";
    return qrSvg;
  };
  _this.createDataURL = function(cellSize, margin) {
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;
    return createDataURL(size, size, function(x2, y3) {
      if (min <= x2 && x2 < max && min <= y3 && y3 < max) {
        const c5 = Math.floor((x2 - min) / cellSize);
        const r6 = Math.floor((y3 - min) / cellSize);
        return _this.isDark(r6, c5) ? 0 : 1;
      } else {
        return 1;
      }
    });
  };
  _this.createImgTag = function(cellSize, margin, alt) {
    cellSize = cellSize || 2;
    margin = typeof margin == "undefined" ? cellSize * 4 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    let img = "";
    img += "<img";
    img += ' src="';
    img += _this.createDataURL(cellSize, margin);
    img += '"';
    img += ' width="';
    img += size;
    img += '"';
    img += ' height="';
    img += size;
    img += '"';
    if (alt) {
      img += ' alt="';
      img += escapeXml(alt);
      img += '"';
    }
    img += "/>";
    return img;
  };
  const escapeXml = function(s5) {
    let escaped = "";
    for (let i7 = 0; i7 < s5.length; i7 += 1) {
      const c5 = s5.charAt(i7);
      switch (c5) {
        case "<":
          escaped += "&lt;";
          break;
        case ">":
          escaped += "&gt;";
          break;
        case "&":
          escaped += "&amp;";
          break;
        case '"':
          escaped += "&quot;";
          break;
        default:
          escaped += c5;
          break;
      }
    }
    return escaped;
  };
  const _createHalfASCII = function(margin) {
    const cellSize = 1;
    margin = typeof margin == "undefined" ? cellSize * 2 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;
    let y3, x2, r1, r22, p4;
    const blocks = {
      "\u2588\u2588": "\u2588",
      "\u2588 ": "\u2580",
      " \u2588": "\u2584",
      "  ": " "
    };
    const blocksLastLineNoMargin = {
      "\u2588\u2588": "\u2580",
      "\u2588 ": "\u2580",
      " \u2588": " ",
      "  ": " "
    };
    let ascii = "";
    for (y3 = 0; y3 < size; y3 += 2) {
      r1 = Math.floor((y3 - min) / cellSize);
      r22 = Math.floor((y3 + 1 - min) / cellSize);
      for (x2 = 0; x2 < size; x2 += 1) {
        p4 = "\u2588";
        if (min <= x2 && x2 < max && min <= y3 && y3 < max && _this.isDark(r1, Math.floor((x2 - min) / cellSize))) {
          p4 = " ";
        }
        if (min <= x2 && x2 < max && min <= y3 + 1 && y3 + 1 < max && _this.isDark(r22, Math.floor((x2 - min) / cellSize))) {
          p4 += " ";
        } else {
          p4 += "\u2588";
        }
        ascii += margin < 1 && y3 + 1 >= max ? blocksLastLineNoMargin[p4] : blocks[p4];
      }
      ascii += "\n";
    }
    if (size % 2 && margin > 0) {
      return ascii.substring(0, ascii.length - size - 1) + Array(size + 1).join("\u2580");
    }
    return ascii.substring(0, ascii.length - 1);
  };
  _this.createASCII = function(cellSize, margin) {
    cellSize = cellSize || 1;
    if (cellSize < 2) {
      return _createHalfASCII(margin);
    }
    cellSize -= 1;
    margin = typeof margin == "undefined" ? cellSize * 2 : margin;
    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;
    let y3, x2, r6, p4;
    const white = Array(cellSize + 1).join("\u2588\u2588");
    const black = Array(cellSize + 1).join("  ");
    let ascii = "";
    let line = "";
    for (y3 = 0; y3 < size; y3 += 1) {
      r6 = Math.floor((y3 - min) / cellSize);
      line = "";
      for (x2 = 0; x2 < size; x2 += 1) {
        p4 = 1;
        if (min <= x2 && x2 < max && min <= y3 && y3 < max && _this.isDark(r6, Math.floor((x2 - min) / cellSize))) {
          p4 = 0;
        }
        line += p4 ? white : black;
      }
      for (r6 = 0; r6 < cellSize; r6 += 1) {
        ascii += line + "\n";
      }
    }
    return ascii.substring(0, ascii.length - 1);
  };
  _this.renderTo2dContext = function(context, cellSize) {
    cellSize = cellSize || 2;
    const length = _this.getModuleCount();
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        context.fillStyle = _this.isDark(row, col) ? "black" : "white";
        context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  };
  return _this;
};
qrcode.stringToBytes = function(s5) {
  const bytes = [];
  for (let i7 = 0; i7 < s5.length; i7 += 1) {
    const c5 = s5.charCodeAt(i7);
    bytes.push(c5 & 255);
  }
  return bytes;
};
qrcode.createStringToBytes = function(unicodeData, numChars) {
  const unicodeMap = (function() {
    const bin = base64DecodeInputStream(unicodeData);
    const read2 = function() {
      const b3 = bin.read();
      if (b3 == -1) throw "eof";
      return b3;
    };
    let count = 0;
    const unicodeMap2 = {};
    while (true) {
      const b0 = bin.read();
      if (b0 == -1) break;
      const b1 = read2();
      const b22 = read2();
      const b3 = read2();
      const k2 = String.fromCharCode(b0 << 8 | b1);
      const v3 = b22 << 8 | b3;
      unicodeMap2[k2] = v3;
      count += 1;
    }
    if (count != numChars) {
      throw count + " != " + numChars;
    }
    return unicodeMap2;
  })();
  const unknownChar = "?".charCodeAt(0);
  return function(s5) {
    const bytes = [];
    for (let i7 = 0; i7 < s5.length; i7 += 1) {
      const c5 = s5.charCodeAt(i7);
      if (c5 < 128) {
        bytes.push(c5);
      } else {
        const b3 = unicodeMap[s5.charAt(i7)];
        if (typeof b3 == "number") {
          if ((b3 & 255) == b3) {
            bytes.push(b3);
          } else {
            bytes.push(b3 >>> 8);
            bytes.push(b3 & 255);
          }
        } else {
          bytes.push(unknownChar);
        }
      }
    }
    return bytes;
  };
};
var QRMode = {
  MODE_NUMBER: 1 << 0,
  MODE_ALPHA_NUM: 1 << 1,
  MODE_8BIT_BYTE: 1 << 2,
  MODE_KANJI: 1 << 3
};
var QRErrorCorrectionLevel = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2
};
var QRMaskPattern = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7
};
var QRUtil = (function() {
  const PATTERN_POSITION_TABLE = [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170]
  ];
  const G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
  const G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
  const G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
  const _this = {};
  const getBCHDigit = function(data) {
    let digit = 0;
    while (data != 0) {
      digit += 1;
      data >>>= 1;
    }
    return digit;
  };
  _this.getBCHTypeInfo = function(data) {
    let d3 = data << 10;
    while (getBCHDigit(d3) - getBCHDigit(G15) >= 0) {
      d3 ^= G15 << getBCHDigit(d3) - getBCHDigit(G15);
    }
    return (data << 10 | d3) ^ G15_MASK;
  };
  _this.getBCHTypeNumber = function(data) {
    let d3 = data << 12;
    while (getBCHDigit(d3) - getBCHDigit(G18) >= 0) {
      d3 ^= G18 << getBCHDigit(d3) - getBCHDigit(G18);
    }
    return data << 12 | d3;
  };
  _this.getPatternPosition = function(typeNumber) {
    return PATTERN_POSITION_TABLE[typeNumber - 1];
  };
  _this.getMaskFunction = function(maskPattern) {
    switch (maskPattern) {
      case QRMaskPattern.PATTERN000:
        return function(i7, j2) {
          return (i7 + j2) % 2 == 0;
        };
      case QRMaskPattern.PATTERN001:
        return function(i7, j2) {
          return i7 % 2 == 0;
        };
      case QRMaskPattern.PATTERN010:
        return function(i7, j2) {
          return j2 % 3 == 0;
        };
      case QRMaskPattern.PATTERN011:
        return function(i7, j2) {
          return (i7 + j2) % 3 == 0;
        };
      case QRMaskPattern.PATTERN100:
        return function(i7, j2) {
          return (Math.floor(i7 / 2) + Math.floor(j2 / 3)) % 2 == 0;
        };
      case QRMaskPattern.PATTERN101:
        return function(i7, j2) {
          return i7 * j2 % 2 + i7 * j2 % 3 == 0;
        };
      case QRMaskPattern.PATTERN110:
        return function(i7, j2) {
          return (i7 * j2 % 2 + i7 * j2 % 3) % 2 == 0;
        };
      case QRMaskPattern.PATTERN111:
        return function(i7, j2) {
          return (i7 * j2 % 3 + (i7 + j2) % 2) % 2 == 0;
        };
      default:
        throw "bad maskPattern:" + maskPattern;
    }
  };
  _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
    let a3 = qrPolynomial([1], 0);
    for (let i7 = 0; i7 < errorCorrectLength; i7 += 1) {
      a3 = a3.multiply(qrPolynomial([1, QRMath.gexp(i7)], 0));
    }
    return a3;
  };
  _this.getLengthInBits = function(mode, type) {
    if (1 <= type && type < 10) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 10;
        case QRMode.MODE_ALPHA_NUM:
          return 9;
        case QRMode.MODE_8BIT_BYTE:
          return 8;
        case QRMode.MODE_KANJI:
          return 8;
        default:
          throw "mode:" + mode;
      }
    } else if (type < 27) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 12;
        case QRMode.MODE_ALPHA_NUM:
          return 11;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 10;
        default:
          throw "mode:" + mode;
      }
    } else if (type < 41) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 14;
        case QRMode.MODE_ALPHA_NUM:
          return 13;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 12;
        default:
          throw "mode:" + mode;
      }
    } else {
      throw "type:" + type;
    }
  };
  _this.getLostPoint = function(qrcode2) {
    const moduleCount = qrcode2.getModuleCount();
    let lostPoint = 0;
    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {
        let sameCount = 0;
        const dark = qrcode2.isDark(row, col);
        for (let r6 = -1; r6 <= 1; r6 += 1) {
          if (row + r6 < 0 || moduleCount <= row + r6) {
            continue;
          }
          for (let c5 = -1; c5 <= 1; c5 += 1) {
            if (col + c5 < 0 || moduleCount <= col + c5) {
              continue;
            }
            if (r6 == 0 && c5 == 0) {
              continue;
            }
            if (dark == qrcode2.isDark(row + r6, col + c5)) {
              sameCount += 1;
            }
          }
        }
        if (sameCount > 5) {
          lostPoint += 3 + sameCount - 5;
        }
      }
    }
    ;
    for (let row = 0; row < moduleCount - 1; row += 1) {
      for (let col = 0; col < moduleCount - 1; col += 1) {
        let count = 0;
        if (qrcode2.isDark(row, col)) count += 1;
        if (qrcode2.isDark(row + 1, col)) count += 1;
        if (qrcode2.isDark(row, col + 1)) count += 1;
        if (qrcode2.isDark(row + 1, col + 1)) count += 1;
        if (count == 0 || count == 4) {
          lostPoint += 3;
        }
      }
    }
    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount - 6; col += 1) {
        if (qrcode2.isDark(row, col) && !qrcode2.isDark(row, col + 1) && qrcode2.isDark(row, col + 2) && qrcode2.isDark(row, col + 3) && qrcode2.isDark(row, col + 4) && !qrcode2.isDark(row, col + 5) && qrcode2.isDark(row, col + 6)) {
          lostPoint += 40;
        }
      }
    }
    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount - 6; row += 1) {
        if (qrcode2.isDark(row, col) && !qrcode2.isDark(row + 1, col) && qrcode2.isDark(row + 2, col) && qrcode2.isDark(row + 3, col) && qrcode2.isDark(row + 4, col) && !qrcode2.isDark(row + 5, col) && qrcode2.isDark(row + 6, col)) {
          lostPoint += 40;
        }
      }
    }
    let darkCount = 0;
    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount; row += 1) {
        if (qrcode2.isDark(row, col)) {
          darkCount += 1;
        }
      }
    }
    const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;
    return lostPoint;
  };
  return _this;
})();
var QRMath = (function() {
  const EXP_TABLE = new Array(256);
  const LOG_TABLE = new Array(256);
  for (let i7 = 0; i7 < 8; i7 += 1) {
    EXP_TABLE[i7] = 1 << i7;
  }
  for (let i7 = 8; i7 < 256; i7 += 1) {
    EXP_TABLE[i7] = EXP_TABLE[i7 - 4] ^ EXP_TABLE[i7 - 5] ^ EXP_TABLE[i7 - 6] ^ EXP_TABLE[i7 - 8];
  }
  for (let i7 = 0; i7 < 255; i7 += 1) {
    LOG_TABLE[EXP_TABLE[i7]] = i7;
  }
  const _this = {};
  _this.glog = function(n5) {
    if (n5 < 1) {
      throw "glog(" + n5 + ")";
    }
    return LOG_TABLE[n5];
  };
  _this.gexp = function(n5) {
    while (n5 < 0) {
      n5 += 255;
    }
    while (n5 >= 256) {
      n5 -= 255;
    }
    return EXP_TABLE[n5];
  };
  return _this;
})();
var qrPolynomial = function(num, shift) {
  if (typeof num.length == "undefined") {
    throw num.length + "/" + shift;
  }
  const _num = (function() {
    let offset = 0;
    while (offset < num.length && num[offset] == 0) {
      offset += 1;
    }
    const _num2 = new Array(num.length - offset + shift);
    for (let i7 = 0; i7 < num.length - offset; i7 += 1) {
      _num2[i7] = num[i7 + offset];
    }
    return _num2;
  })();
  const _this = {};
  _this.getAt = function(index) {
    return _num[index];
  };
  _this.getLength = function() {
    return _num.length;
  };
  _this.multiply = function(e6) {
    const num2 = new Array(_this.getLength() + e6.getLength() - 1);
    for (let i7 = 0; i7 < _this.getLength(); i7 += 1) {
      for (let j2 = 0; j2 < e6.getLength(); j2 += 1) {
        num2[i7 + j2] ^= QRMath.gexp(QRMath.glog(_this.getAt(i7)) + QRMath.glog(e6.getAt(j2)));
      }
    }
    return qrPolynomial(num2, 0);
  };
  _this.mod = function(e6) {
    if (_this.getLength() - e6.getLength() < 0) {
      return _this;
    }
    const ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e6.getAt(0));
    const num2 = new Array(_this.getLength());
    for (let i7 = 0; i7 < _this.getLength(); i7 += 1) {
      num2[i7] = _this.getAt(i7);
    }
    for (let i7 = 0; i7 < e6.getLength(); i7 += 1) {
      num2[i7] ^= QRMath.gexp(QRMath.glog(e6.getAt(i7)) + ratio);
    }
    return qrPolynomial(num2, 0).mod(e6);
  };
  return _this;
};
var QRRSBlock = (function() {
  const RS_BLOCK_TABLE = [
    // L
    // M
    // Q
    // H
    // 1
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],
    // 2
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],
    // 3
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],
    // 4
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],
    // 5
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],
    // 6
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],
    // 7
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],
    // 8
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],
    // 9
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],
    // 10
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70, 44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],
    // 11
    [4, 101, 81],
    [1, 80, 50, 4, 81, 51],
    [4, 50, 22, 4, 51, 23],
    [3, 36, 12, 8, 37, 13],
    // 12
    [2, 116, 92, 2, 117, 93],
    [6, 58, 36, 2, 59, 37],
    [4, 46, 20, 6, 47, 21],
    [7, 42, 14, 4, 43, 15],
    // 13
    [4, 133, 107],
    [8, 59, 37, 1, 60, 38],
    [8, 44, 20, 4, 45, 21],
    [12, 33, 11, 4, 34, 12],
    // 14
    [3, 145, 115, 1, 146, 116],
    [4, 64, 40, 5, 65, 41],
    [11, 36, 16, 5, 37, 17],
    [11, 36, 12, 5, 37, 13],
    // 15
    [5, 109, 87, 1, 110, 88],
    [5, 65, 41, 5, 66, 42],
    [5, 54, 24, 7, 55, 25],
    [11, 36, 12, 7, 37, 13],
    // 16
    [5, 122, 98, 1, 123, 99],
    [7, 73, 45, 3, 74, 46],
    [15, 43, 19, 2, 44, 20],
    [3, 45, 15, 13, 46, 16],
    // 17
    [1, 135, 107, 5, 136, 108],
    [10, 74, 46, 1, 75, 47],
    [1, 50, 22, 15, 51, 23],
    [2, 42, 14, 17, 43, 15],
    // 18
    [5, 150, 120, 1, 151, 121],
    [9, 69, 43, 4, 70, 44],
    [17, 50, 22, 1, 51, 23],
    [2, 42, 14, 19, 43, 15],
    // 19
    [3, 141, 113, 4, 142, 114],
    [3, 70, 44, 11, 71, 45],
    [17, 47, 21, 4, 48, 22],
    [9, 39, 13, 16, 40, 14],
    // 20
    [3, 135, 107, 5, 136, 108],
    [3, 67, 41, 13, 68, 42],
    [15, 54, 24, 5, 55, 25],
    [15, 43, 15, 10, 44, 16],
    // 21
    [4, 144, 116, 4, 145, 117],
    [17, 68, 42],
    [17, 50, 22, 6, 51, 23],
    [19, 46, 16, 6, 47, 17],
    // 22
    [2, 139, 111, 7, 140, 112],
    [17, 74, 46],
    [7, 54, 24, 16, 55, 25],
    [34, 37, 13],
    // 23
    [4, 151, 121, 5, 152, 122],
    [4, 75, 47, 14, 76, 48],
    [11, 54, 24, 14, 55, 25],
    [16, 45, 15, 14, 46, 16],
    // 24
    [6, 147, 117, 4, 148, 118],
    [6, 73, 45, 14, 74, 46],
    [11, 54, 24, 16, 55, 25],
    [30, 46, 16, 2, 47, 17],
    // 25
    [8, 132, 106, 4, 133, 107],
    [8, 75, 47, 13, 76, 48],
    [7, 54, 24, 22, 55, 25],
    [22, 45, 15, 13, 46, 16],
    // 26
    [10, 142, 114, 2, 143, 115],
    [19, 74, 46, 4, 75, 47],
    [28, 50, 22, 6, 51, 23],
    [33, 46, 16, 4, 47, 17],
    // 27
    [8, 152, 122, 4, 153, 123],
    [22, 73, 45, 3, 74, 46],
    [8, 53, 23, 26, 54, 24],
    [12, 45, 15, 28, 46, 16],
    // 28
    [3, 147, 117, 10, 148, 118],
    [3, 73, 45, 23, 74, 46],
    [4, 54, 24, 31, 55, 25],
    [11, 45, 15, 31, 46, 16],
    // 29
    [7, 146, 116, 7, 147, 117],
    [21, 73, 45, 7, 74, 46],
    [1, 53, 23, 37, 54, 24],
    [19, 45, 15, 26, 46, 16],
    // 30
    [5, 145, 115, 10, 146, 116],
    [19, 75, 47, 10, 76, 48],
    [15, 54, 24, 25, 55, 25],
    [23, 45, 15, 25, 46, 16],
    // 31
    [13, 145, 115, 3, 146, 116],
    [2, 74, 46, 29, 75, 47],
    [42, 54, 24, 1, 55, 25],
    [23, 45, 15, 28, 46, 16],
    // 32
    [17, 145, 115],
    [10, 74, 46, 23, 75, 47],
    [10, 54, 24, 35, 55, 25],
    [19, 45, 15, 35, 46, 16],
    // 33
    [17, 145, 115, 1, 146, 116],
    [14, 74, 46, 21, 75, 47],
    [29, 54, 24, 19, 55, 25],
    [11, 45, 15, 46, 46, 16],
    // 34
    [13, 145, 115, 6, 146, 116],
    [14, 74, 46, 23, 75, 47],
    [44, 54, 24, 7, 55, 25],
    [59, 46, 16, 1, 47, 17],
    // 35
    [12, 151, 121, 7, 152, 122],
    [12, 75, 47, 26, 76, 48],
    [39, 54, 24, 14, 55, 25],
    [22, 45, 15, 41, 46, 16],
    // 36
    [6, 151, 121, 14, 152, 122],
    [6, 75, 47, 34, 76, 48],
    [46, 54, 24, 10, 55, 25],
    [2, 45, 15, 64, 46, 16],
    // 37
    [17, 152, 122, 4, 153, 123],
    [29, 74, 46, 14, 75, 47],
    [49, 54, 24, 10, 55, 25],
    [24, 45, 15, 46, 46, 16],
    // 38
    [4, 152, 122, 18, 153, 123],
    [13, 74, 46, 32, 75, 47],
    [48, 54, 24, 14, 55, 25],
    [42, 45, 15, 32, 46, 16],
    // 39
    [20, 147, 117, 4, 148, 118],
    [40, 75, 47, 7, 76, 48],
    [43, 54, 24, 22, 55, 25],
    [10, 45, 15, 67, 46, 16],
    // 40
    [19, 148, 118, 6, 149, 119],
    [18, 75, 47, 31, 76, 48],
    [34, 54, 24, 34, 55, 25],
    [20, 45, 15, 61, 46, 16]
  ];
  const qrRSBlock = function(totalCount, dataCount) {
    const _this2 = {};
    _this2.totalCount = totalCount;
    _this2.dataCount = dataCount;
    return _this2;
  };
  const _this = {};
  const getRsBlockTable = function(typeNumber, errorCorrectionLevel) {
    switch (errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default:
        return void 0;
    }
  };
  _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {
    const rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);
    if (typeof rsBlock == "undefined") {
      throw "bad rs block @ typeNumber:" + typeNumber + "/errorCorrectionLevel:" + errorCorrectionLevel;
    }
    const length = rsBlock.length / 3;
    const list = [];
    for (let i7 = 0; i7 < length; i7 += 1) {
      const count = rsBlock[i7 * 3 + 0];
      const totalCount = rsBlock[i7 * 3 + 1];
      const dataCount = rsBlock[i7 * 3 + 2];
      for (let j2 = 0; j2 < count; j2 += 1) {
        list.push(qrRSBlock(totalCount, dataCount));
      }
    }
    return list;
  };
  return _this;
})();
var qrBitBuffer = function() {
  const _buffer = [];
  let _length = 0;
  const _this = {};
  _this.getBuffer = function() {
    return _buffer;
  };
  _this.getAt = function(index) {
    const bufIndex = Math.floor(index / 8);
    return (_buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
  };
  _this.put = function(num, length) {
    for (let i7 = 0; i7 < length; i7 += 1) {
      _this.putBit((num >>> length - i7 - 1 & 1) == 1);
    }
  };
  _this.getLengthInBits = function() {
    return _length;
  };
  _this.putBit = function(bit) {
    const bufIndex = Math.floor(_length / 8);
    if (_buffer.length <= bufIndex) {
      _buffer.push(0);
    }
    if (bit) {
      _buffer[bufIndex] |= 128 >>> _length % 8;
    }
    _length += 1;
  };
  return _this;
};
var qrNumber = function(data) {
  const _mode = QRMode.MODE_NUMBER;
  const _data = data;
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return _data.length;
  };
  _this.write = function(buffer) {
    const data2 = _data;
    let i7 = 0;
    while (i7 + 2 < data2.length) {
      buffer.put(strToNum(data2.substring(i7, i7 + 3)), 10);
      i7 += 3;
    }
    if (i7 < data2.length) {
      if (data2.length - i7 == 1) {
        buffer.put(strToNum(data2.substring(i7, i7 + 1)), 4);
      } else if (data2.length - i7 == 2) {
        buffer.put(strToNum(data2.substring(i7, i7 + 2)), 7);
      }
    }
  };
  const strToNum = function(s5) {
    let num = 0;
    for (let i7 = 0; i7 < s5.length; i7 += 1) {
      num = num * 10 + chatToNum(s5.charAt(i7));
    }
    return num;
  };
  const chatToNum = function(c5) {
    if ("0" <= c5 && c5 <= "9") {
      return c5.charCodeAt(0) - "0".charCodeAt(0);
    }
    throw "illegal char :" + c5;
  };
  return _this;
};
var qrAlphaNum = function(data) {
  const _mode = QRMode.MODE_ALPHA_NUM;
  const _data = data;
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return _data.length;
  };
  _this.write = function(buffer) {
    const s5 = _data;
    let i7 = 0;
    while (i7 + 1 < s5.length) {
      buffer.put(
        getCode(s5.charAt(i7)) * 45 + getCode(s5.charAt(i7 + 1)),
        11
      );
      i7 += 2;
    }
    if (i7 < s5.length) {
      buffer.put(getCode(s5.charAt(i7)), 6);
    }
  };
  const getCode = function(c5) {
    if ("0" <= c5 && c5 <= "9") {
      return c5.charCodeAt(0) - "0".charCodeAt(0);
    } else if ("A" <= c5 && c5 <= "Z") {
      return c5.charCodeAt(0) - "A".charCodeAt(0) + 10;
    } else {
      switch (c5) {
        case " ":
          return 36;
        case "$":
          return 37;
        case "%":
          return 38;
        case "*":
          return 39;
        case "+":
          return 40;
        case "-":
          return 41;
        case ".":
          return 42;
        case "/":
          return 43;
        case ":":
          return 44;
        default:
          throw "illegal char :" + c5;
      }
    }
  };
  return _this;
};
var qr8BitByte = function(data) {
  const _mode = QRMode.MODE_8BIT_BYTE;
  const _data = data;
  const _bytes = qrcode.stringToBytes(data);
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return _bytes.length;
  };
  _this.write = function(buffer) {
    for (let i7 = 0; i7 < _bytes.length; i7 += 1) {
      buffer.put(_bytes[i7], 8);
    }
  };
  return _this;
};
var qrKanji = function(data) {
  const _mode = QRMode.MODE_KANJI;
  const _data = data;
  const stringToBytes2 = qrcode.stringToBytes;
  !(function(c5, code) {
    const test = stringToBytes2(c5);
    if (test.length != 2 || (test[0] << 8 | test[1]) != code) {
      throw "sjis not supported.";
    }
  })("\u53CB", 38726);
  const _bytes = stringToBytes2(data);
  const _this = {};
  _this.getMode = function() {
    return _mode;
  };
  _this.getLength = function(buffer) {
    return ~~(_bytes.length / 2);
  };
  _this.write = function(buffer) {
    const data2 = _bytes;
    let i7 = 0;
    while (i7 + 1 < data2.length) {
      let c5 = (255 & data2[i7]) << 8 | 255 & data2[i7 + 1];
      if (33088 <= c5 && c5 <= 40956) {
        c5 -= 33088;
      } else if (57408 <= c5 && c5 <= 60351) {
        c5 -= 49472;
      } else {
        throw "illegal char at " + (i7 + 1) + "/" + c5;
      }
      c5 = (c5 >>> 8 & 255) * 192 + (c5 & 255);
      buffer.put(c5, 13);
      i7 += 2;
    }
    if (i7 < data2.length) {
      throw "illegal char at " + (i7 + 1);
    }
  };
  return _this;
};
var byteArrayOutputStream = function() {
  const _bytes = [];
  const _this = {};
  _this.writeByte = function(b3) {
    _bytes.push(b3 & 255);
  };
  _this.writeShort = function(i7) {
    _this.writeByte(i7);
    _this.writeByte(i7 >>> 8);
  };
  _this.writeBytes = function(b3, off, len) {
    off = off || 0;
    len = len || b3.length;
    for (let i7 = 0; i7 < len; i7 += 1) {
      _this.writeByte(b3[i7 + off]);
    }
  };
  _this.writeString = function(s5) {
    for (let i7 = 0; i7 < s5.length; i7 += 1) {
      _this.writeByte(s5.charCodeAt(i7));
    }
  };
  _this.toByteArray = function() {
    return _bytes;
  };
  _this.toString = function() {
    let s5 = "";
    s5 += "[";
    for (let i7 = 0; i7 < _bytes.length; i7 += 1) {
      if (i7 > 0) {
        s5 += ",";
      }
      s5 += _bytes[i7];
    }
    s5 += "]";
    return s5;
  };
  return _this;
};
var base64EncodeOutputStream = function() {
  let _buffer = 0;
  let _buflen = 0;
  let _length = 0;
  let _base64 = "";
  const _this = {};
  const writeEncoded = function(b3) {
    _base64 += String.fromCharCode(encode(b3 & 63));
  };
  const encode = function(n5) {
    if (n5 < 0) {
      throw "n:" + n5;
    } else if (n5 < 26) {
      return 65 + n5;
    } else if (n5 < 52) {
      return 97 + (n5 - 26);
    } else if (n5 < 62) {
      return 48 + (n5 - 52);
    } else if (n5 == 62) {
      return 43;
    } else if (n5 == 63) {
      return 47;
    } else {
      throw "n:" + n5;
    }
  };
  _this.writeByte = function(n5) {
    _buffer = _buffer << 8 | n5 & 255;
    _buflen += 8;
    _length += 1;
    while (_buflen >= 6) {
      writeEncoded(_buffer >>> _buflen - 6);
      _buflen -= 6;
    }
  };
  _this.flush = function() {
    if (_buflen > 0) {
      writeEncoded(_buffer << 6 - _buflen);
      _buffer = 0;
      _buflen = 0;
    }
    if (_length % 3 != 0) {
      const padlen = 3 - _length % 3;
      for (let i7 = 0; i7 < padlen; i7 += 1) {
        _base64 += "=";
      }
    }
  };
  _this.toString = function() {
    return _base64;
  };
  return _this;
};
var base64DecodeInputStream = function(str) {
  const _str = str;
  let _pos = 0;
  let _buffer = 0;
  let _buflen = 0;
  const _this = {};
  _this.read = function() {
    while (_buflen < 8) {
      if (_pos >= _str.length) {
        if (_buflen == 0) {
          return -1;
        }
        throw "unexpected end of file./" + _buflen;
      }
      const c5 = _str.charAt(_pos);
      _pos += 1;
      if (c5 == "=") {
        _buflen = 0;
        return -1;
      } else if (c5.match(/^\s$/)) {
        continue;
      }
      _buffer = _buffer << 6 | decode(c5.charCodeAt(0));
      _buflen += 6;
    }
    const n5 = _buffer >>> _buflen - 8 & 255;
    _buflen -= 8;
    return n5;
  };
  const decode = function(c5) {
    if (65 <= c5 && c5 <= 90) {
      return c5 - 65;
    } else if (97 <= c5 && c5 <= 122) {
      return c5 - 97 + 26;
    } else if (48 <= c5 && c5 <= 57) {
      return c5 - 48 + 52;
    } else if (c5 == 43) {
      return 62;
    } else if (c5 == 47) {
      return 63;
    } else {
      throw "c:" + c5;
    }
  };
  return _this;
};
var gifImage = function(width, height) {
  const _width = width;
  const _height = height;
  const _data = new Array(width * height);
  const _this = {};
  _this.setPixel = function(x2, y3, pixel) {
    _data[y3 * _width + x2] = pixel;
  };
  _this.write = function(out) {
    out.writeString("GIF87a");
    out.writeShort(_width);
    out.writeShort(_height);
    out.writeByte(128);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(0);
    out.writeByte(255);
    out.writeByte(255);
    out.writeByte(255);
    out.writeString(",");
    out.writeShort(0);
    out.writeShort(0);
    out.writeShort(_width);
    out.writeShort(_height);
    out.writeByte(0);
    const lzwMinCodeSize = 2;
    const raster = getLZWRaster(lzwMinCodeSize);
    out.writeByte(lzwMinCodeSize);
    let offset = 0;
    while (raster.length - offset > 255) {
      out.writeByte(255);
      out.writeBytes(raster, offset, 255);
      offset += 255;
    }
    out.writeByte(raster.length - offset);
    out.writeBytes(raster, offset, raster.length - offset);
    out.writeByte(0);
    out.writeString(";");
  };
  const bitOutputStream = function(out) {
    const _out = out;
    let _bitLength = 0;
    let _bitBuffer = 0;
    const _this2 = {};
    _this2.write = function(data, length) {
      if (data >>> length != 0) {
        throw "length over";
      }
      while (_bitLength + length >= 8) {
        _out.writeByte(255 & (data << _bitLength | _bitBuffer));
        length -= 8 - _bitLength;
        data >>>= 8 - _bitLength;
        _bitBuffer = 0;
        _bitLength = 0;
      }
      _bitBuffer = data << _bitLength | _bitBuffer;
      _bitLength = _bitLength + length;
    };
    _this2.flush = function() {
      if (_bitLength > 0) {
        _out.writeByte(_bitBuffer);
      }
    };
    return _this2;
  };
  const getLZWRaster = function(lzwMinCodeSize) {
    const clearCode = 1 << lzwMinCodeSize;
    const endCode = (1 << lzwMinCodeSize) + 1;
    let bitLength = lzwMinCodeSize + 1;
    const table = lzwTable();
    for (let i7 = 0; i7 < clearCode; i7 += 1) {
      table.add(String.fromCharCode(i7));
    }
    table.add(String.fromCharCode(clearCode));
    table.add(String.fromCharCode(endCode));
    const byteOut = byteArrayOutputStream();
    const bitOut = bitOutputStream(byteOut);
    bitOut.write(clearCode, bitLength);
    let dataIndex = 0;
    let s5 = String.fromCharCode(_data[dataIndex]);
    dataIndex += 1;
    while (dataIndex < _data.length) {
      const c5 = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;
      if (table.contains(s5 + c5)) {
        s5 = s5 + c5;
      } else {
        bitOut.write(table.indexOf(s5), bitLength);
        if (table.size() < 4095) {
          if (table.size() == 1 << bitLength) {
            bitLength += 1;
          }
          table.add(s5 + c5);
        }
        s5 = c5;
      }
    }
    bitOut.write(table.indexOf(s5), bitLength);
    bitOut.write(endCode, bitLength);
    bitOut.flush();
    return byteOut.toByteArray();
  };
  const lzwTable = function() {
    const _map = {};
    let _size = 0;
    const _this2 = {};
    _this2.add = function(key) {
      if (_this2.contains(key)) {
        throw "dup key:" + key;
      }
      _map[key] = _size;
      _size += 1;
    };
    _this2.size = function() {
      return _size;
    };
    _this2.indexOf = function(key) {
      return _map[key];
    };
    _this2.contains = function(key) {
      return typeof _map[key] != "undefined";
    };
    return _this2;
  };
  return _this;
};
var createDataURL = function(width, height, getPixel) {
  const gif = gifImage(width, height);
  for (let y3 = 0; y3 < height; y3 += 1) {
    for (let x2 = 0; x2 < width; x2 += 1) {
      gif.setPixel(x2, y3, getPixel(x2, y3));
    }
  }
  const b3 = byteArrayOutputStream();
  gif.write(b3);
  const base64 = base64EncodeOutputStream();
  const bytes = b3.toByteArray();
  for (let i7 = 0; i7 < bytes.length; i7 += 1) {
    base64.writeByte(bytes[i7]);
  }
  base64.flush();
  return "data:image/gif;base64," + base64;
};
var qrcode_default = qrcode;
var stringToBytes = qrcode.stringToBytes;

// src/qr.ts
var QUIET_ZONE = 4;
function qrPath(text) {
  const code = qrcode_default(0, "M");
  code.addData(text);
  code.make();
  const count = code.getModuleCount();
  const parts = [];
  for (let row = 0; row < count; row++) {
    for (let column = 0; column < count; column++) {
      if (code.isDark(row, column)) {
        parts.push(`M${column + QUIET_ZONE} ${row + QUIET_ZONE}h1v1h-1z`);
      }
    }
  }
  return { size: count + 2 * QUIET_ZONE, path: parts.join("") };
}

// src/package-tracker-card.ts
console.info(
  `%c  PACKAGE-TRACKER-CARD 
%c  ${CARD_VERSION}    `,
  "color: orange; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: dimgray"
);
var CARD_EDGES = 26;
var TITLE = 41;
var ITEM_PADDING = 12;
var PROGRESS_MARGIN = 6;
var LINE = 16;
var HELD_MINIMUM = {
  wide: { line: 32, lineOneBadge: 32, progress: 22, status: 18, bar: 18 },
  narrow: { line: 49, lineOneBadge: 49, progress: 40, status: 30, bar: 18 },
  veryNarrow: { line: 82, lineOneBadge: 65, progress: 52, status: 42, bar: 18 }
};
var registry = window;
registry.customCards = registry.customCards ?? [];
registry.customCards.push({
  type: "package-tracker-card",
  name: translate(browserLanguage(), "common.name"),
  description: translate(browserLanguage(), "common.description"),
  documentationURL: "https://github.com/jesmak/package-tracker-card",
  preview: true
});
var PackageTrackerCard = class extends i4 {
  constructor() {
    super();
    this.revealed = /* @__PURE__ */ new Set();
    this.filled = 0;
    this.resizes = typeof ResizeObserver === "undefined" ? void 0 : new ResizeObserver(() => this.measureSoon());
    new ScrollFade(this, () => this.heightStyle() ? this.renderRoot.querySelectorAll(".list") : []);
  }
  static getConfigElement() {
    return document.createElement("package-tracker-card-editor");
  }
  /** Offers the tracking sensors that are there when the card is added from the picker. */
  static getStubConfig(hass) {
    return { entity: hass ? trackingEntities(hass) : [] };
  }
  setConfig(config) {
    const noEntity = !config || !config.entity || Array.isArray(config.entity) && config.entity.length === 0;
    const badCount = [config?.max_events, config?.max_sent_events].some(
      (limit) => limit != null && !(Number.isInteger(limit) && limit > 0)
    );
    const badStatuses = config?.statuses != null && !(Array.isArray(config.statuses) && config.statuses.every((status) => STATUSES.includes(status)));
    const badLink = config?.tracking_link != null && !["row", "number", "none"].includes(config.tracking_link);
    const badDirection = config?.direction != null && !["all", "incoming", "outgoing"].includes(config.direction);
    if (noEntity || badCount || badStatuses || badLink || badDirection) {
      throw new Error(translate(browserLanguage(), "common.invalid_configuration"));
    }
    if (!validHeight(config)) {
      throw new Error(translate(browserLanguage(), "common.invalid_height"));
    }
    this.config = withTitle(config);
  }
  getCardSize() {
    const packages = this.hass && this.config ? this.shown(this.hass, this.config) : [];
    return heightCardSize(this.config ?? {}, 1 + packages.length * 2, this.minimumHeight());
  }
  /**
   * In a sections view the card takes a whole section by default and is never narrower than three quarters of one,
   * nor lower than its minimum. Home Assistant holds rows set in the layout tab to that minimum.
   */
  getGridOptions() {
    return { columns: 12, rows: "auto", min_columns: 9, min_rows: gridMinRows(this.minimumHeight()) };
  }
  /**
   * Held to a height, the title and one whole package still fit while every sensor answers: its number, its progress
   * line and the lines the configuration shows, each on one line. At the narrowest its columns can be, or at the width
   * it is measured to have, whichever needs more: a whole section counts as wide, 11 columns or fewer as narrow. The
   * number is counted as long as Posti's, and the badge of the service it came from as there, since only the data
   * says whether it is. A longer number scrolls the rest of the package with the list.
   */
  minimumHeight() {
    const byColumns = this.minimumFor(this.columns() <= 11 ? "narrow" : "wide");
    return Math.max(byColumns, this.widthClass ? this.minimumFor(this.widthClass) : 0);
  }
  minimumFor(widthClass) {
    const config = this.config;
    if (!config) {
      return 0;
    }
    const sizes = HELD_MINIMUM[widthClass];
    const bar = config.show_progress !== false;
    const status = config.show_latest_event !== false;
    const progress = bar && status ? sizes.progress : status ? sizes.status : bar ? sizes.bar : 0;
    const message = config.show_latest_event_message !== false;
    const destination = config.show_destination !== false || config.show_pickup !== false || !message && (config.pickup_code ?? "hidden") !== "hidden";
    const lines = [
      config.show_details === true,
      message,
      config.show_latest_event_location !== false,
      config.show_origin !== false,
      destination
    ].filter(Boolean).length;
    return CARD_EDGES + (config.title ? TITLE : 0) + ITEM_PADDING + ((config.direction ?? "all") === "all" ? sizes.line : sizes.lineOneBadge) + (progress ? progress + PROGRESS_MARGIN : 0) + lines * LINE;
  }
  /** The columns set in the layout tab, in either form Home Assistant has saved them, or a whole section. */
  columns() {
    const config = this.config;
    const columns = config?.grid_options ? config.grid_options.columns : typeof config?.layout_options?.grid_columns === "number" ? config.layout_options.grid_columns * 3 : void 0;
    return typeof columns === "number" ? columns : 12;
  }
  /** Back on the page, such as from another view, the card is followed and measured again without waiting for its data. */
  connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated) {
      this.requestUpdate();
    }
    this.clock = setInterval(() => {
      if (this.renderRoot.querySelector(".sensor")) {
        this.requestUpdate();
      }
    }, 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.clock);
    this.resizes?.disconnect();
    this.observed = void 0;
    cancelAnimationFrame(this.frame ?? 0);
  }
  measureSoon() {
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
  measureWidth() {
    const card = this.renderRoot.querySelector("ha-card");
    if (!card?.clientWidth) {
      return;
    }
    const style = getComputedStyle(card);
    const width = card.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
    const widthClass = width <= 170 ? "veryNarrow" : width <= 240 ? "narrow" : "wide";
    if (widthClass !== this.widthClass) {
      this.widthClass = widthClass;
    }
  }
  /**
   * On automatic rows in a sections view, the card takes the whole rows its content needs, so the cards under it stay
   * on the rows. Measured to the end of the list's last child, as the list grows to whatever height the card is given.
   */
  fillRows() {
    const card = this.renderRoot.querySelector("ha-card");
    const last = card && (card.querySelector(".list")?.lastElementChild ?? card.querySelector(".message"));
    if (!card || !last || !card.clientWidth || this.layout !== "grid" || this.heightStyle()) {
      if (this.filled) {
        this.filled = 0;
      }
      return;
    }
    const style = getComputedStyle(card);
    const content = last.getBoundingClientRect().bottom - card.getBoundingClientRect().top + (parseFloat(style.paddingBottom) || 0) + (parseFloat(style.borderBottomWidth) || 0);
    const filled = gridMinRows(Math.round(content)) * 64 - 8;
    if (filled !== this.filled) {
      this.filled = filled;
    }
  }
  shouldUpdate(changed) {
    if (!this.config || [...changed.keys()].some((key) => key !== "hass")) {
      return true;
    }
    const previous = changed.get("hass");
    if (!previous || this.language() !== (previous.locale?.language ?? previous.language ?? browserLanguage())) {
      return true;
    }
    return entities(this.config.entity).some((id) => previous.states[id] !== this.hass?.states[id]);
  }
  render() {
    if (!this.hass || !this.config) {
      return A;
    }
    const missing = missingEntities(this.hass, this.config.entity);
    if (missing.length === entities(this.config.entity).length) {
      return b2`<ha-card style="${this.cardStyle()}"
                ><div class="message">${this.text("common.no_entity")} ${missing.join(", ")}</div></ha-card
            >`;
    }
    const packages = this.shown(this.hass, this.config);
    const sensors = sensorsOf(this.hass, this.config.entity);
    const marked = (this.config.direction ?? "all") === "all";
    const title = this.config.title;
    const held = !!this.heightStyle();
    return b2`
            <ha-card class="${this.config.wrap_text ? "wrap" : ""} ${held ? "held" : ""}" style="${this.cardStyle()}">
                ${title ? b2`<div class="header" title="${held ? title : A}">${title}</div>` : A}
                <div class="list">
                    ${packages.length === 0 ? this.empty(sensors, held) : b2`${sensors.filter((sensor) => !sensor.available).map((sensor) => this.sensor(sensor))}${c4(
      packages,
      (item) => item.shipment_number,
      (item) => this.shipment(item, marked)
    )}`}
                </div>
                ${this.qrDialog()}
            </ha-card>
        `;
  }
  updated(changed) {
    if (changed.has("qr") && this.qr) {
      this.renderRoot.querySelector("dialog.qr")?.showModal();
    }
    if (!this.isConnected) {
      return;
    }
    const card = this.renderRoot.querySelector("ha-card") ?? void 0;
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
  heightStyle() {
    return heightStyle(this.config ?? {}, this.layout, this.minimumHeight());
  }
  cardStyle() {
    return this.heightStyle() || (this.filled ? `min-height: ${this.filled}px` : "");
  }
  /**
   * With nothing to list, the card says so and shows that each of its sensors still answers, so an empty card can be
   * told apart from a broken one. With `show_sensors` off, only a sensor that doesn't answer is named. Held to a
   * height, an icon fills some of the room, centred with the rest.
   */
  empty(sensors, held) {
    return b2`<div class="empty">
            ${held ? b2`<ha-icon class="empty-icon" icon="mdi:package-variant-closed-check"></ha-icon>` : A}
            <div class="no-packages">${this.text("common.no_packages")}</div>
            ${(this.config?.show_sensors === false ? sensors.filter((sensor) => !sensor.available) : sensors).map(
      (sensor) => this.sensor(sensor)
    )}
        </div>`;
  }
  /** A sensor's name, and when it last read its packages, or that it doesn't answer. */
  sensor(sensor) {
    const state = !sensor.available ? this.text("common.unavailable") : sensor.checked ? `${this.text("common.checked")} ${ago(sensor.checked, this.language()) ?? this.text("common.just_now")}` : "";
    return b2`<div class="sensor ${sensor.available ? "" : "down"}">
            <ha-icon icon="${sensor.available ? "mdi:check-circle-outline" : "mdi:alert-circle-outline"}"></ha-icon>
            <span>${state ? `${sensor.name} \xB7 ${state}` : sensor.name}</span>
        </div>`;
  }
  /** The packages listed: the chosen ones in order, up to the most of each direction. */
  shown(hass, config) {
    return withinLimits(sortPackages(this.chosen(hass, config)), config.max_events, config.max_sent_events);
  }
  /** The packages of the card's sensors with the chosen statuses, going the chosen way. */
  chosen(hass, config) {
    return withDirection(withStatuses(packagesOf(hass, config.entity), config.statuses), config.direction);
  }
  shipment(item, marked) {
    const moving = !FINISHED.includes(item.status);
    const message = this.config?.show_latest_event_message !== false && moving && !!item.latest_event;
    const link = this.config?.tracking_link ?? "row";
    const url = link === "none" ? void 0 : trackingUrl(item);
    const row = link === "row" && !!url;
    const sender = item.origin || item.origin_city;
    const outgoing = isOutgoing(item);
    return b2`
            <div
                class="item status-${item.status} ${row ? "clickable" : ""}"
                title="${row ? url : ""}"
                @click=${() => row && this.openTracking(url)}
            >
                <div class="line">
                    <ha-icon icon="${iconFor(item.status)}"></ha-icon>
                    <span
                        class="number ${url && !row ? "link" : ""}"
                        title="${url && !row ? url : A}"
                        role="${url ? "link" : A}"
                        tabindex="${url ? 0 : A}"
                        @click=${() => !row && this.openTracking(url)}
                        @keydown=${(event) => activate(event, () => this.openTracking(url))}
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
      message ? this.code(item) : A
    )}
                ${this.row("mdi:map-marker", this.config?.show_latest_event_location, moving, [item.latest_event_city])}
                ${outgoing ? this.row("mdi:account-arrow-right", this.config?.show_origin, true, [item.recipient]) : this.row("mdi:arrow-up-bold-box", this.config?.show_origin, true, [
      sender,
      sender && item.shipment_date ? ` (${formatDateTime(item.shipment_date)})` : ""
    ])}
                ${this.destination(item, !message)}
            </div>
        `;
  }
  /** Which way the package goes, when the list shows both ways, and which service it came from. */
  badges(item, marked) {
    if (!marked && !item.source) {
      return A;
    }
    const direction = this.text(isOutgoing(item) ? "direction.outgoing" : "direction.incoming");
    return b2`
            <span class="badges">
                ${marked ? b2`<span class="badge direction">${direction}</span>` : A}
                ${item.source ? b2`<span class="badge source">${item.source}</span>` : A}
            </span>
        `;
  }
  /** How far the package has got, with its status and when it last moved. */
  progress(item) {
    if (this.config?.show_latest_event === false && this.config?.show_progress === false) {
      return A;
    }
    const percent = (progressOf(item.status) * 100).toFixed(0);
    return b2`
            <div class="progress-row">
                ${this.config?.show_progress === false ? A : b2`<div
                              class="track"
                              role="progressbar"
                              aria-label="${this.text(`statuses.${item.status}`)}"
                              aria-valuenow="${percent}"
                              aria-valuemin="0"
                              aria-valuemax="100"
                          >
                              <div class="bar" style="width:${percent}%"></div>
                          </div>`}
                ${this.config?.show_latest_event === false ? A : b2`<span class="latest">
                              <span class="status-text">${this.text(`statuses.${item.status}`)}</span>
                              <span class="when">${formatDateTime(item.latest_event_date)}</span>
                          </span>`}
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
  destination(item, withCode) {
    const place = this.config?.show_destination === false ? "" : placeOf(item.pickup_point) || item.destination || item.destination_city || "";
    const waiting = AT_PICKUP_POINT.includes(item.status);
    const time = this.config?.show_pickup === false || FINISHED.includes(item.status) ? "" : waiting ? item.pickup_deadline : item.estimated_delivery;
    const label = waiting ? this.text("common.pickup_by") : this.text("common.estimated");
    const code = withCode ? this.code(item) : A;
    if (!place && !time && code === A) {
      return A;
    }
    return b2`
            <div class="row secondary">
                <ha-icon icon="${item.pickup_point ? "mdi:map-marker-radius" : "mdi:arrow-down-bold-box"}"></ha-icon>
                <div class="text-content">${[place, time ? `${label} ${formatDateTime(time)}` : ""].filter(Boolean).join(" \xB7 ")}</div>
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
  code(item) {
    const setting = this.config?.pickup_code ?? "hidden";
    const shelf = item.pickup_code ? void 0 : item.pickup_point?.compartment;
    if (setting === "hidden" || !item.pickup_code && !item.pickup_qr && !shelf || FINISHED.includes(item.status) || isOutgoing(item)) {
      return A;
    }
    return b2`
            <span class="pickup">
                ${item.pickup_code ? this.codeField(item) : A}
                ${shelf ? b2`<span class="shelf">${this.text("common.shelf")} ${shelf}</span>` : A}
                ${item.pickup_qr ? b2`<button
                              type="button"
                              class="qr-button"
                              title="${this.text("common.show_qr")}"
                              aria-label="${this.text("common.show_qr")}"
                              @click=${(event) => this.showQr(event, item)}
                          >
                              <ha-icon icon="mdi:qrcode"></ha-icon>
                          </button>` : A}
            </span>
        `;
  }
  codeField(item) {
    const setting = this.config?.pickup_code ?? "hidden";
    const shown = setting === "always" || this.revealed.has(item.shipment_number);
    const compartment = item.pickup_point?.compartment;
    const title = !shown ? this.text("common.show_code") : compartment ? `${this.text("common.compartment")} ${compartment}` : "";
    const toggles = setting === "toggle";
    return b2`
            <span
                class="code ${shown ? "" : "covered"} ${toggles ? "toggles" : ""}"
                title="${title}"
                role="${toggles ? "button" : A}"
                tabindex="${toggles ? 0 : A}"
                aria-label="${toggles && !shown ? this.text("common.show_code") : A}"
                aria-pressed="${toggles ? String(shown) : A}"
                @click=${(event) => this.reveal(event, item)}
                @keydown=${(event) => activate(event, () => this.reveal(event, item))}
            >
                <ha-icon icon="mdi:key-variant"></ha-icon>
                ${shown ? [compartment, item.pickup_code].filter(Boolean).join(" \xB7 ") : "\u2022\u2022\u2022\u2022"}
            </span>
        `;
  }
  /** The QR code is its own button, like the code, so the package under it stays put. */
  showQr(event, item) {
    event.stopPropagation();
    this.qr = item;
  }
  closeQr() {
    this.renderRoot.querySelector("dialog.qr")?.close();
    this.qr = void 0;
  }
  /**
   * The QR code large enough to scan off the screen, with the code under it for a counter that types it in.
   * A modal dialog of the card's own, in the browser's top layer, so no card or view around it can clip it.
   * Esc, the close button and a click outside it close it.
   */
  qrDialog() {
    const item = this.qr;
    if (!item?.pickup_qr) {
      return A;
    }
    const { size, path } = qrPath(item.pickup_qr);
    const place = placeOf(item.pickup_point) || item.destination || item.destination_city;
    const deadline = AT_PICKUP_POINT.includes(item.status) ? item.pickup_deadline : void 0;
    return b2`
            <dialog
                class="qr"
                aria-labelledby="qr-title"
                @close=${() => this.qr = void 0}
                @click=${(event) => event.target === event.currentTarget && this.closeQr()}
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
                    ${item.pickup_code ? b2`<div class="qr-number">${item.pickup_code}</div>` : A}
                    ${place ? b2`<div class="qr-detail">${place}</div>` : A}
                    ${deadline ? b2`<div class="qr-detail">${this.text("common.pickup_by")} ${formatDateTime(deadline)}</div>` : A}
                </div>
            </dialog>
        `;
  }
  reveal(event, item) {
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
  details(item) {
    if (this.config?.show_details !== true) {
      return A;
    }
    const parts = [
      item.weight ? `${this.number(item.weight, 3)} kg` : "",
      item.package_count && item.package_count > 1 ? `${item.package_count} ${this.text("common.parcels")}` : ""
    ].filter(Boolean);
    if (parts.length === 0) {
      return A;
    }
    return b2`
            <div class="row secondary">
                <ha-icon icon="mdi:weight-kilogram"></ha-icon>
                <div class="text-content">${parts.join(" \xB7 ")}</div>
            </div>
        `;
  }
  number(value, digits) {
    return new Intl.NumberFormat(this.language(), { maximumFractionDigits: digits }).format(value);
  }
  /** A line of the package, left out when the configuration hides it or there is nothing to write. */
  row(icon, shown, relevant, parts, extra = A) {
    const text = parts.filter((part) => part !== null && part !== void 0 && part !== "").join("");
    if (shown === false || !relevant || text === "") {
      return A;
    }
    return b2`
            <div class="row secondary">
                <ha-icon icon="${icon}"></ha-icon>
                <div class="text-content">${text}</div>
                ${extra}
            </div>
        `;
  }
  openTracking(url) {
    if (url) {
      window.open(url, "_blank", "noopener");
    }
  }
  text(key) {
    return translate(this.language(), key);
  }
  language() {
    return this.hass?.locale?.language ?? this.hass?.language ?? browserLanguage();
  }
  static get styles() {
    return [
      i`
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

                .list {
                    flex: 1 1 auto;
                    min-height: 0;
                    overflow-y: auto;
                    overscroll-behavior: contain;
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
      fadeStyles
    ];
  }
};
__decorateClass([
  n4({ attribute: false })
], PackageTrackerCard.prototype, "hass", 2);
__decorateClass([
  n4({ attribute: false })
], PackageTrackerCard.prototype, "layout", 2);
__decorateClass([
  r5()
], PackageTrackerCard.prototype, "config", 2);
__decorateClass([
  r5()
], PackageTrackerCard.prototype, "revealed", 2);
__decorateClass([
  r5()
], PackageTrackerCard.prototype, "qr", 2);
__decorateClass([
  r5()
], PackageTrackerCard.prototype, "filled", 2);
__decorateClass([
  r5()
], PackageTrackerCard.prototype, "widthClass", 2);
PackageTrackerCard = __decorateClass([
  t3("package-tracker-card")
], PackageTrackerCard);
function activate(event, action) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
}
function placeOf(point) {
  if (!point) {
    return "";
  }
  const name = point.name ?? "";
  const city = point.city ?? "";
  return [name, city && city.toLowerCase() !== name.toLowerCase() ? city : ""].filter(Boolean).join(", ");
}
export {
  PackageTrackerCard
};
