/*! package-tracker-card 2.0.0 | MIT License */
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
var CARD_VERSION = "2.0.0";
var DELIVERED = 0;
var WAITING = 1;
var RECEIVED = 2;
var IN_TRANSPORT = 3;
var IN_DELIVERY = 4;
var READY_FOR_PICKUP = 5;
var RETURNED = 6;
var UNKNOWN = 7;
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
var TRACKING_URLS = {
  posti: "https://www.posti.fi/fi/seuranta#/lahetys/{number}",
  matkahuolto: "https://www.matkahuolto.fi/seuranta?parcelNumber={number}"
};

// src/localize/languages/en.json
var en_default = {
  common: {
    version: "Version",
    invalid_configuration: "Invalid configuration",
    description: "Package tracker card for tracking parcels",
    name: "Package tracker card",
    no_packages: "No packages to track at the moment",
    no_entity: "There is no entity",
    pickup_by: "Pick up by",
    estimated: "Estimated",
    show_code: "Show the pickup code",
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
  editor: {
    entity: "Tracking sensors",
    entity_helper: "The accounts whose packages are shown. Packages from several are listed together.",
    title: "Title",
    max_events: "Most packages shown",
    height: "Height",
    height_helper: "A fixed height in pixels. The list scrolls inside the card. Leave empty and the card follows its packages.",
    max_height: "Maximum height",
    max_height_helper: "A height the card never grows past. Leave empty for no limit.",
    hide_when_nothing_to_show: "Hide when empty",
    hide_when_nothing_to_show_helper: "Leaves the card out of the dashboard entirely while there is nothing to track.",
    show_progress: "Progress bar",
    show_latest_event: "Status and time",
    show_latest_event_message: "Latest event",
    show_latest_event_location: "Where it last was",
    show_origin: "Sender",
    show_destination: "Destination",
    show_destination_helper: "Where the package is going \u2014 the pickup point when the carrier names one.",
    show_pickup: "Pickup time",
    show_pickup_helper: "Adds the pickup deadline to that row, or the estimated delivery while the package is still on its way.",
    show_details: "Weight and parcels",
    show_details_helper: "The package's weight and how many parcels it has.",
    pickup_code: "Pickup code",
    pickup_code_helper: "The code that collects the package. It comes from the integration's own setting, which is off by default.",
    pickup_code_hidden: "Never shown",
    pickup_code_always: "Always shown",
    pickup_code_toggle: "Revealed when clicked"
  }
};

// src/localize/languages/fi.json
var fi_default = {
  common: {
    version: "Versio",
    invalid_configuration: "Virheellinen konfiguraatio",
    description: "Kortti pakettil\xE4hetysten seuraamiseen",
    name: "L\xE4hetysten seuranta",
    no_packages: "Ei seurattavia paketteja t\xE4ll\xE4 hetkell\xE4",
    no_entity: "Entiteetti\xE4 ei ole:",
    pickup_by: "Nouda viimeist\xE4\xE4n",
    estimated: "Arvio",
    show_code: "N\xE4yt\xE4 noutokoodi",
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
  editor: {
    entity: "Seurannan sensorit",
    entity_helper: "Tilit, joiden paketit n\xE4ytet\xE4\xE4n. Useamman tilin paketit listataan yhdess\xE4.",
    title: "Otsikko",
    max_events: "Enint\xE4\xE4n paketteja",
    height: "Korkeus",
    height_helper: "Kiinte\xE4 korkeus pikselein\xE4. Lista vierii kortin sis\xE4ll\xE4. J\xE4t\xE4 tyhj\xE4ksi, niin kortti seuraa pakettien m\xE4\xE4r\xE4\xE4.",
    max_height: "Enimm\xE4iskorkeus",
    max_height_helper: "Korkeus, jota kortti ei ylit\xE4. J\xE4t\xE4 tyhj\xE4ksi, jos rajaa ei tarvita.",
    hide_when_nothing_to_show: "Piilota tyhj\xE4n\xE4",
    hide_when_nothing_to_show_helper: "J\xE4tt\xE4\xE4 kortin kokonaan pois n\xE4kym\xE4st\xE4, kun seurattavaa ei ole.",
    show_progress: "Edistymispalkki",
    show_latest_event: "Tila ja aika",
    show_latest_event_message: "Viimeisin tapahtuma",
    show_latest_event_location: "Miss\xE4 viimeksi",
    show_origin: "L\xE4hett\xE4j\xE4",
    show_destination: "M\xE4\xE4r\xE4np\xE4\xE4",
    show_destination_helper: "Minne paketti on menossa \u2013 noutopaikka, jos kuljetusyhti\xF6 kertoo sen.",
    show_pickup: "Noutoaika",
    show_pickup_helper: "Lis\xE4\xE4 samalle riville noudon m\xE4\xE4r\xE4ajan, tai arvioidun toimituksen kun paketti on viel\xE4 matkalla.",
    show_details: "Paino ja kollit",
    show_details_helper: "Paketin paino ja kollien m\xE4\xE4r\xE4.",
    pickup_code: "Noutokoodi",
    pickup_code_helper: "Koodi, jolla paketin noutaa. Se tulee integraation omasta asetuksesta, joka on oletuksena pois p\xE4\xE4lt\xE4.",
    pickup_code_hidden: "Ei n\xE4ytet\xE4",
    pickup_code_always: "N\xE4ytet\xE4\xE4n aina",
    pickup_code_toggle: "Paljastuu napsauttamalla"
  }
};

// src/localize/localize.ts
var LANGUAGES = { en: en_default, fi: fi_default };
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
  pickup_code: "hidden",
  show_latest_event: true,
  show_latest_event_message: true,
  show_latest_event_location: true,
  show_origin: true,
  show_destination: true,
  hide_when_nothing_to_show: false
};
function trackingEntities(hass) {
  return Object.keys(hass.states).filter((id) => Array.isArray(hass.states[id]?.attributes?.packages)).sort();
}
function schema(hass, text) {
  return [
    {
      name: "entity",
      required: true,
      selector: { entity: { multiple: true, include_entities: trackingEntities(hass) } }
    },
    { name: "title", selector: { text: {} } },
    {
      type: "grid",
      name: "",
      schema: [
        { name: "max_events", selector: { number: { min: 1, max: 50, step: 1, mode: "box" } } },
        {
          name: "height",
          selector: { number: { min: 100, max: 1200, step: 10, unit_of_measurement: "px", mode: "box" } }
        },
        {
          name: "max_height",
          selector: { number: { min: 100, max: 1200, step: 10, unit_of_measurement: "px", mode: "box" } }
        }
      ]
    },
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
      type: "grid",
      name: "",
      schema: [
        { name: "show_progress", selector: { boolean: {} } },
        { name: "show_details", selector: { boolean: {} } },
        { name: "show_latest_event", selector: { boolean: {} } },
        { name: "show_latest_event_message", selector: { boolean: {} } },
        { name: "show_latest_event_location", selector: { boolean: {} } },
        { name: "show_origin", selector: { boolean: {} } },
        { name: "show_destination", selector: { boolean: {} } },
        { name: "show_pickup", selector: { boolean: {} } },
        { name: "hide_when_nothing_to_show", selector: { boolean: {} } }
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
    this.config = { ...config };
  }
  render() {
    if (!this.hass) {
      return A;
    }
    const entity = typeof this.config.entity === "string" ? [this.config.entity] : this.config.entity;
    return b2`
      <ha-form
        .hass=${this.hass}
        .data=${{ ...DEFAULTS, ...this.config, entity }}
        .schema=${schema(this.hass, (key) => this.text(key))}
        .computeLabel=${(entry) => this.text(`editor.${entry.name}`)}
        .computeHelper=${(entry) => this.helper(entry.name)}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }
  valueChanged(event) {
    const config = { ...event.detail.value };
    for (const key of ["max_events", "height", "max_height", "title"]) {
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
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true })
    );
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
  const found = [];
  for (const id of entities(entity)) {
    const packages = hass.states[id]?.attributes?.packages;
    if (Array.isArray(packages)) {
      found.push(...packages);
    }
  }
  return found;
}
function missingEntities(hass, entity) {
  return entities(entity).filter((id) => hass.states[id] === void 0);
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
  const pattern = TRACKING_URLS[String(item.source ?? "").toLowerCase()];
  if (!pattern || !item.shipment_number) {
    return void 0;
  }
  return pattern.replace("{number}", encodeURIComponent(item.shipment_number));
}

// src/package-tracker-card.ts
console.info(
  `%c  PACKAGE-TRACKER-CARD 
%c  ${CARD_VERSION}    `,
  "color: orange; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: dimgray"
);
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
    super(...arguments);
    this.revealed = /* @__PURE__ */ new Set();
  }
  static getConfigElement() {
    return document.createElement("package-tracker-card-editor");
  }
  /** Offers the tracking sensors that are there when the card is added from the picker. */
  static getStubConfig(hass) {
    const found = Object.keys(hass?.states ?? {}).filter(
      (id) => Array.isArray(hass?.states[id]?.attributes?.packages)
    );
    return { entity: found };
  }
  setConfig(config) {
    if (!config || !config.entity || Array.isArray(config.entity) && config.entity.length === 0) {
      throw new Error(translate(browserLanguage(), "common.invalid_configuration"));
    }
    this.config = { ...config };
  }
  getCardSize() {
    const packages = this.hass && this.config ? packagesOf(this.hass, this.config.entity) : [];
    return 1 + Math.min(packages.length, this.config?.max_events ?? packages.length) * 2;
  }
  shouldUpdate(changed) {
    if (changed.has("config") || !this.config) {
      return true;
    }
    const previous = changed.get("hass");
    if (!previous) {
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
      this.toggleAttribute("hidden", false);
      return b2`<ha-card
        ><div class="message">${this.text("common.no_entity")} ${missing.join(", ")}</div></ha-card
      >`;
    }
    let packages = sortPackages(packagesOf(this.hass, this.config.entity));
    if (this.config.max_events !== void 0 && this.config.max_events < packages.length) {
      packages = packages.slice(0, this.config.max_events);
    }
    const hide = packages.length === 0 && this.config.hide_when_nothing_to_show === true;
    this.toggleAttribute("hidden", hide);
    if (hide) {
      return A;
    }
    const title = this.config.title ?? this.config.name;
    return b2`
      <ha-card style="${this.heights()}">
        ${title ? b2`<div class="header">${title}</div>` : A}
        <div class="list">
          ${packages.length === 0 ? b2`<div class="no-packages">${this.text("common.no_packages")}</div>` : c4(
      packages,
      (item) => item.shipment_number,
      (item) => this.shipment(item)
    )}
        </div>
      </ha-card>
    `;
  }
  /** A fixed height, a limit, or neither. The list scrolls inside whatever the card gets. */
  heights() {
    const { height, max_height: maxHeight } = this.config ?? {};
    return [
      height === void 0 ? "" : `height:${height}px;`,
      maxHeight === void 0 ? "" : `max-height:${maxHeight}px;`
    ].join("");
  }
  shipment(item) {
    const moving = !FINISHED.includes(item.status);
    const message = this.config?.show_latest_event_message !== false && moving && !!item.latest_event;
    const url = trackingUrl(item);
    return b2`
      <div
        class="item status-${item.status} ${url ? "clickable" : ""}"
        @click=${() => this.openTracking(url)}
        title="${url ?? ""}"
      >
        <div class="line">
          <ha-icon icon="${iconFor(item.status)}"></ha-icon>
          <span class="number">${item.shipment_number}</span>
          ${item.source ? b2`<span class="source">${item.source}</span>` : A}
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
        ${this.row("mdi:arrow-up-bold-box", this.config?.show_origin, true, [
      item.origin || item.origin_city,
      item.shipment_date ? ` (${formatDateTime(item.shipment_date)})` : ""
    ])}
        ${this.destination(item, !message)}
      </div>
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
                aria-valuenow="${percent}"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div class="bar" style="width:${percent}%"></div>
              </div>`}
        ${this.config?.show_latest_event === false ? A : b2`<span class="status-text">${this.text(`statuses.${item.status}`)}</span>
                <span class="when">${formatDateTime(item.latest_event_date)}</span>`}
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
    if (!place && !time) {
      return A;
    }
    return b2`
      <div class="row secondary">
        <ha-icon icon="${item.pickup_point ? "mdi:map-marker-radius" : "mdi:arrow-down-bold-box"}"></ha-icon>
        <div class="text-content">
          ${[place, time ? `${label} ${formatDateTime(time)}` : ""].filter(Boolean).join(" \xB7 ")}
        </div>
        ${withCode ? this.code(item) : A}
      </div>
    `;
  }
  /** The code that collects the package: never, always, or once the field is clicked. */
  code(item) {
    const setting = this.config?.pickup_code ?? "hidden";
    if (setting === "hidden" || !item.pickup_code) {
      return A;
    }
    const shown = setting === "always" || this.revealed.has(item.shipment_number);
    return b2`
      <span
        class="code ${shown ? "" : "covered"}"
        title="${shown ? "" : this.text("common.show_code")}"
        @click=${(event) => this.reveal(event, item)}
      >
        <ha-icon icon="mdi:key-variant"></ha-icon>
        ${shown ? item.pickup_code : "\u2022\u2022\u2022\u2022"}
      </span>
    `;
  }
  reveal(event, item) {
    if ((this.config?.pickup_code ?? "hidden") !== "toggle") {
      return;
    }
    event.stopPropagation();
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
    return i`
      :host([hidden]) {
        display: none;
      }

      /* The header stays put and the packages scroll under it, so a card given a
         height never spills its text outside. */
      ha-card {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 12px;
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

      .line {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }

      .number {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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

      .row {
        display: flex;
        align-items: center;
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

      .text-content {
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
};
__decorateClass([
  n4({ attribute: false })
], PackageTrackerCard.prototype, "hass", 2);
__decorateClass([
  r5()
], PackageTrackerCard.prototype, "config", 2);
__decorateClass([
  r5()
], PackageTrackerCard.prototype, "revealed", 2);
PackageTrackerCard = __decorateClass([
  t3("package-tracker-card")
], PackageTrackerCard);
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
