function t(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}const e=window,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;class o{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}}const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new o(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var l;const c=window,h=c.trustedTypes,d=h?h.emptyScript:"",u=c.reactiveElementPolyfillSupport,p={toAttribute(t,e){switch(e){case Boolean:t=t?d:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>e!==t&&(e==e||t==t),f={attribute:!0,type:String,converter:p,reflect:!1,hasChanged:v};class m extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;null!==(e=this.h)&&void 0!==e||(this.h=[]),this.h.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))})),t}static createProperty(t,e=f){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const n=this[t];this[e]=s,this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||f}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{i?t.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):s.forEach((i=>{const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}))})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=f){var s;const n=this.constructor._$Ep(t,i);if(void 0!==n&&!0===i.reflect){const o=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:p).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,n=s._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=s.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:p;this._$El=n,this[n]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||v)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _;m.finalized=!0,m.elementProperties=new Map,m.elementStyles=[],m.shadowRootOptions={mode:"open"},null==u||u({ReactiveElement:m}),(null!==(l=c.reactiveElementVersions)&&void 0!==l?l:c.reactiveElementVersions=[]).push("1.4.1");const g=window,$=g.trustedTypes,y=$?$.createPolicy("lit-html",{createHTML:t=>t}):void 0,A=`lit$${(Math.random()+"").slice(9)}$`,b="?"+A,w=`<${b}>`,E=document,S=(t="")=>E.createComment(t),x=t=>null===t||"object"!=typeof t&&"function"!=typeof t,C=Array.isArray,k=t=>C(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,T=/>/g,O=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),N=/'/g,H=/"/g,R=/^(?:script|style|textarea|title)$/i,M=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),D=Symbol.for("lit-noChange"),L=Symbol.for("lit-nothing"),z=new WeakMap,j=E.createTreeWalker(E,129,null,!1),B=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":"",r=P;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(r.lastIndex=h,l=r.exec(i),null!==l);)h=r.lastIndex,r===P?"!--"===l[1]?r=U:void 0!==l[1]?r=T:void 0!==l[2]?(R.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=O):void 0!==l[3]&&(r=O):r===O?">"===l[0]?(r=null!=n?n:P,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?O:'"'===l[3]?H:N):r===H||r===N?r=O:r===U||r===T?r=P:(r=O,n=void 0);const d=r===O&&t[e+1].startsWith("/>")?" ":"";o+=r===P?i+w:c>=0?(s.push(a),i.slice(0,c)+"$lit$"+i.slice(c)+A+d):i+A+(-2===c?(s.push(void 0),e):d)}const a=o+(t[i]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==y?y.createHTML(a):a,s]};class I{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[l,c]=B(t,e);if(this.el=I.createElement(l,i),j.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=j.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith(A)){const i=c[o++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+"$lit$").split(A),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?J:"?"===e[1]?Z:"@"===e[1]?G:F})}else a.push({type:6,index:n})}for(const e of t)s.removeAttribute(e)}if(R.test(s.tagName)){const t=s.textContent.split(A),e=t.length-1;if(e>0){s.textContent=$?$.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],S()),j.nextNode(),a.push({type:2,index:++n});s.append(t[e],S())}}}else if(8===s.nodeType)if(s.data===b)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(A,t+1));)a.push({type:7,index:n}),t+=A.length-1}n++}}static createElement(t,e){const i=E.createElement("template");return i.innerHTML=t,i}}function V(t,e,i=t,s){var n,o,r,a;if(e===D)return e;let l=void 0!==s?null===(n=i._$Co)||void 0===n?void 0:n[s]:i._$Cl;const c=x(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,i,s)),void 0!==s?(null!==(r=(a=i)._$Co)&&void 0!==r?r:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=V(t,l._$AS(t,e.values),l,s)),e}class K{constructor(t,e){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var e;const{el:{content:i},parts:s}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:E).importNode(i,!0);j.currentNode=n;let o=j.nextNode(),r=0,a=0,l=s[0];for(;void 0!==l;){if(r===l.index){let e;2===l.type?e=new W(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new Q(o,this,t)),this.u.push(e),l=s[++a]}r!==(null==l?void 0:l.index)&&(o=j.nextNode(),r++)}return n}p(t){let e=0;for(const i of this.u)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class W{constructor(t,e,i,s){var n;this.type=2,this._$AH=L,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cm=null===(n=null==s?void 0:s.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=V(this,t,e),x(t)?t===L||null==t||""===t?(this._$AH!==L&&this._$AR(),this._$AH=L):t!==this._$AH&&t!==D&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):k(t)?this.k(t):this.g(t)}O(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}g(t){this._$AH!==L&&x(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:s}=t,n="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=I.createElement(s.h,this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.p(i);else{const t=new K(n,this),e=t.v(this.options);t.p(i),this.T(e),this._$AH=t}}_$AC(t){let e=z.get(t.strings);return void 0===e&&z.set(t.strings,e=new I(t)),e}k(t){C(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new W(this.O(S()),this.O(S()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cm=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class F{constructor(t,e,i,s,n){this.type=1,this._$AH=L,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=L}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=V(this,t,e,0),o=!x(t)||t!==this._$AH&&t!==D,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=V(this,s[i+r],e,r),a===D&&(a=this._$AH[r]),o||(o=!x(a)||a!==this._$AH[r]),a===L?t=L:t!==L&&(t+=(null!=a?a:"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===L?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class J extends F{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===L?void 0:t}}const q=$?$.emptyScript:"";class Z extends F{constructor(){super(...arguments),this.type=4}j(t){t&&t!==L?this.element.setAttribute(this.name,q):this.element.removeAttribute(this.name)}}class G extends F{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=V(this,t,e,0))&&void 0!==i?i:L)===D)return;const s=this._$AH,n=t===L&&s!==L||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==L&&(s===L||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class Q{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){V(this,t)}}const Y={P:"$lit$",A:A,M:b,C:1,L:B,R:K,D:k,V:V,I:W,H:F,N:Z,U:G,B:J,F:Q},X=g.litHtmlPolyfillSupport;null==X||X(I,W),(null!==(_=g.litHtmlVersions)&&void 0!==_?_:g.litHtmlVersions=[]).push("2.4.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var tt,et;class it extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,n;const o=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let r=o._$litPart$;if(void 0===r){const t=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;o._$litPart$=r=new W(e.insertBefore(S(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return D}}it.finalized=!0,it._$litElement$=!0,null===(tt=globalThis.litElementHydrateSupport)||void 0===tt||tt.call(globalThis,{LitElement:it});const st=globalThis.litElementPolyfillSupport;null==st||st({LitElement:it}),(null!==(et=globalThis.litElementVersions)&&void 0!==et?et:globalThis.litElementVersions=[]).push("3.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt=2;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const{I:ot}=Y,rt=()=>document.createComment(""),at=(t,e,i)=>{var s;const n=t._$AA.parentNode,o=void 0===e?t._$AB:e._$AA;if(void 0===i){const e=n.insertBefore(rt(),o),s=n.insertBefore(rt(),o);i=new ot(e,s,t,t.options)}else{const e=i._$AB.nextSibling,r=i._$AM,a=r!==t;if(a){let e;null===(s=i._$AQ)||void 0===s||s.call(i,t),i._$AM=t,void 0!==i._$AP&&(e=t._$AU)!==r._$AU&&i._$AP(e)}if(e!==o||a){let t=i._$AA;for(;t!==e;){const e=t.nextSibling;n.insertBefore(t,o),t=e}}}return i},lt=(t,e,i=t)=>(t._$AI(e,i),t),ct={},ht=t=>{var e;null===(e=t._$AP)||void 0===e||e.call(t,!1,!0);let i=t._$AA;const s=t._$AB.nextSibling;for(;i!==s;){const t=i.nextSibling;i.remove(),i=t}},dt=(t,e,i)=>{const s=new Map;for(let n=e;n<=i;n++)s.set(t[n],n);return s},ut=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}{constructor(t){if(super(t),t.type!==nt)throw Error("repeat() can only be used in text expressions")}ht(t,e,i){let s;void 0===i?i=e:void 0!==e&&(s=e);const n=[],o=[];let r=0;for(const e of t)n[r]=s?s(e,r):r,o[r]=i(e,r),r++;return{values:o,keys:n}}render(t,e,i){return this.ht(t,e,i).values}update(t,[e,i,s]){var n;const o=(t=>t._$AH)(t),{values:r,keys:a}=this.ht(e,i,s);if(!Array.isArray(o))return this.ut=a,r;const l=null!==(n=this.ut)&&void 0!==n?n:this.ut=[],c=[];let h,d,u=0,p=o.length-1,v=0,f=r.length-1;for(;u<=p&&v<=f;)if(null===o[u])u++;else if(null===o[p])p--;else if(l[u]===a[v])c[v]=lt(o[u],r[v]),u++,v++;else if(l[p]===a[f])c[f]=lt(o[p],r[f]),p--,f--;else if(l[u]===a[f])c[f]=lt(o[u],r[f]),at(t,c[f+1],o[u]),u++,f--;else if(l[p]===a[v])c[v]=lt(o[p],r[v]),at(t,o[u],o[p]),p--,v++;else if(void 0===h&&(h=dt(a,v,f),d=dt(l,u,p)),h.has(l[u]))if(h.has(l[p])){const e=d.get(a[v]),i=void 0!==e?o[e]:null;if(null===i){const e=at(t,o[u]);lt(e,r[v]),c[v]=e}else c[v]=lt(i,r[v]),at(t,o[u],i),o[e]=null;v++}else ht(o[p]),p--;else ht(o[u]),u++;for(;v<=f;){const e=at(t,c[f+1]);lt(e,r[v]),c[v++]=e}for(;u<=p;){const t=o[u++];null!==t&&ht(t)}return this.ut=a,((t,e=ct)=>{t._$AH=e})(t,c),D}}),pt=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function vt(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):pt(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var ft;null===(ft=window.HTMLSlotElement)||void 0===ft||ft.prototype.assignedElements;var mt="[^\\s]+";function _t(t,e){for(var i=[],s=0,n=t.length;s<n;s++)i.push(t[s].substr(0,e));return i}var gt=function(t){return function(e,i){var s=i[t].map((function(t){return t.toLowerCase()})),n=s.indexOf(e.toLowerCase());return n>-1?n:null}};function $t(t){for(var e=[],i=1;i<arguments.length;i++)e[i-1]=arguments[i];for(var s=0,n=e;s<n.length;s++){var o=n[s];for(var r in o)t[r]=o[r]}return t}var yt=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],At=["January","February","March","April","May","June","July","August","September","October","November","December"],bt=_t(At,3),wt={dayNamesShort:_t(yt,3),dayNames:yt,monthNamesShort:bt,monthNames:At,amPm:["am","pm"],DoFn:function(t){return t+["th","st","nd","rd"][t%10>3?0:(t-t%10!=10?1:0)*t%10]}},Et=($t({},wt),function(t){return+t-1}),St=[null,"[1-9]\\d?"],xt=[null,mt],Ct=["isPm",mt,function(t,e){var i=t.toLowerCase();return i===e.amPm[0]?0:i===e.amPm[1]?1:null}],kt=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(t){var e=(t+"").match(/([+-]|\d\d)/gi);if(e){var i=60*+e[1]+parseInt(e[2],10);return"+"===e[0]?i:-i}return 0}];gt("monthNamesShort"),gt("monthNames");var Pt,Ut;!function(){try{(new Date).toLocaleDateString("i")}catch(t){return"RangeError"===t.name}}(),function(){try{(new Date).toLocaleString("i")}catch(t){return"RangeError"===t.name}}(),function(){try{(new Date).toLocaleTimeString("i")}catch(t){return"RangeError"===t.name}}(),function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(Pt||(Pt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(Ut||(Ut={}));var Tt={version:"Version",invalid_configuration:"Invalid configuration",description:"Package tracker card for tracking parcels",name:"Package tracker card",no_packages:"No packages to track at the moment"},Ot={0:"Delivered",1:"Info received",2:"Pending",3:"In transit",4:"Being delivered",5:"Ready for pickup",6:"Returned to sender",7:"Exception"},Nt={common:Tt,statuses:Ot},Ht={version:"Versio",invalid_configuration:"Virheellinen konfiguraatio",description:"Kortti pakettilähetysten seuraamiseen",name:"Lähetysten seuranta",no_packages:"Ei seurattavia paketteja tällä hetkellä"},Rt={0:"Toimitettu",1:"Tieto vastaanotettu",2:"Odottaa",3:"Kuljetuksessa",4:"Toimituksessa",5:"Noudettavissa",6:"Palautettu lähettäjälle",7:"Poikkeama"},Mt={common:Ht,statuses:Rt};const Dt={en:Object.freeze({__proto__:null,common:Tt,statuses:Ot,default:Nt}),fi:Object.freeze({__proto__:null,common:Ht,statuses:Rt,default:Mt})};function Lt(t,e="",i=""){var s;let n,o=null===(s=localStorage.getItem("selectedLanguage"))||void 0===s?void 0:s.replace(/['"]+/g,"").replace("-","_");if(!o||"null"===o){const t=document.querySelector("home-assistant").hass;o=t.selectedLanguage||t.language||"en"}try{n=t.split(".").reduce(((t,e)=>t[e]),Dt[o])}catch(e){n=t.split(".").reduce(((t,e)=>t[e]),Dt.en)}return void 0===n&&(n=t.split(".").reduce(((t,e)=>t[e]),Dt.en)),""!==e&&""!==i&&(n=n.replace(e,i)),n}console.info(`%c  PACKAGE-TRACKER-CARD \n%c  ${Lt("common.version")} 1.1.4    `,"color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray");const zt=["mdi:checkbox-marked","mdi:file-document","mdi:clock","mdi:truck-delivery","mdi:human-dolly","mdi:check-decagram","mdi:arrow-u-left-top-bold","mdi:help-circle"];function jt(t){return t.getFullYear()+"-"+Bt(t.getMonth()+1)+"-"+Bt(t.getDate())+" "+Bt(t.getHours())+":"+Bt(t.getMinutes())}function Bt(t){return t<10?"0"+t:String(t)}window.customCards=window.customCards||[],window.customCards.push({type:"package-tracker-card",name:Lt("common.name"),description:Lt("common.description")});let It=class extends it{constructor(){super(...arguments),this.latestTimestap="1970-01-01"}static getStubConfig(){return{}}setConfig(t){if(!t||!t.entity)throw new Error(Lt("common.invalid_configuration"));this.config=Object.assign({name:Lt("common.name")},t)}shouldUpdate(t){if(!this.config)return!1;let e=!1;return"string"==typeof this.config.entity?this.hass.states[this.config.entity].last_changed>this.latestTimestap&&(this.latestTimestap=this.hass.states[this.config.entity].last_changed,e=!0):this.config.entity.forEach((t=>{this.hass.states[t].last_changed>this.latestTimestap&&(this.latestTimestap=this.hass.states[t].last_changed,e=!0)})),e||function(t,e,i){if(e.has("config")||i)return!0;if(t.config.entity){var s=e.get("hass");return!s||s.states[t.config.entity]!==t.hass.states[t.config.entity]}return!1}(this,t,!1)}render(){let t=[];return"string"==typeof this.config.entity?t=this.hass.states[this.config.entity].attributes.packages:this.config.entity.forEach((e=>{t=t.concat(this.hass.states[e].attributes.packages)})),t.sort(((t,e)=>0!==t.status&&0!==e.status||0===t.status&&0===e.status?new Date(t.latest_event_date)>new Date(e.latest_event_date)?-1:1:0!==t.status?-1:1)),this.config.max_events&&this.config.max_events<t.length&&(t=t.slice(0,this.config.max_events)),M`
      <ha-card>
        <div class="header">${this.config.title}</div>
        ${ut(t,(t=>t.shipment_number),(t=>M`
              <div class="item">
                <div class="row">
                  <ha-icon icon="${zt[t.status]}" class="status-${t.status}"></ha-icon>
                  <div>
                    <div class="tracking-number">${t.shipment_number}</div>
                  </div>
                </div>
                <div class="row secondary ${!1===this.config.show_latest_event?"hidden":""}">
                  <ha-icon icon="mdi:calendar"></ha-icon>
                  <div class="text-content">
                    ${Lt("statuses."+t.status)} (${jt(new Date(t.latest_event_date))})
                  </div>
                </div>
                <div
                  class="row secondary ${!1!==this.config.show_latest_event_message&&t.latest_event&&0!==t.status?"":"hidden"}"
                >
                  <ha-icon icon="mdi:text-box"></ha-icon>
                  <div class="text-content">${t.latest_event}</div>
                </div>
                <div
                  class="row secondary ${!1!==this.config.show_latest_event_location&&t.latest_event_city&&0!==t.status?"":"hidden"}"
                >
                  <ha-icon icon="mdi:map-marker"></ha-icon>
                  <div class="text-content">${t.latest_event_city}</div>
                </div>
                <div class="row secondary ${!1===this.config.show_origin?"hidden":""}">
                  <ha-icon icon="mdi:arrow-up-bold-box"></ha-icon>
                  <div class="text-content">
                    ${t.origin||t.origin_city} (${jt(new Date(t.shipment_date))})
                  </div>
                </div>
                <div class="row secondary ${!1===this.config.show_destination?"hidden":""}">
                  <ha-icon icon="mdi:arrow-down-bold-box"></ha-icon>
                  <div class="text-content">${t.destination||t.destination_city}</div>
                </div>
              </div>
            `))}
        ${0===t.length?M` <div class="no-packages">${Lt("common.no_packages")}</div> `:null}
      </ha-card>
    `}static get styles(){return r`
      .header {
        font-size: 24px;
        margin: 20px 20px 30px 12px;
      }

      .tracking-number {
        font-size: 16px;
      }

      .no-packages {
        font-size: 16px;
        margin: 12px;
      }

      .hidden {
        display: none;
      }

      ha-card {
        padding: 10px;
      }

      ha-icon {
        margin-right: 3px;
      }

      ha-svg-icon {
        display: block;
      }

      .status-0,
      .row.secondary {
        color: var(--secondary-text-color);
      }

      .status-1,
      .status-2 {
        color: cornflowerblue;
      }

      .status-3,
      .status-4,
      .status-5 {
        color: green;
      }

      .status-6,
      .status-7 {
        color: red;
      }

      .row > * {
        display: inline-block;
        vertical-align: middle;
      }

      .row.secondary {
        margin-left: 4px;
        font-size: 12px;
        line-height: 16px;
      }

      .row.secondary ha-icon {
        --mdc-icon-size: 16px;
      }

      .item {
        margin: 10px;
      }

      .text-content {
        max-width: calc(100% - 50px);
        margin-left: 4px;
      }
    `}};t([vt()],It.prototype,"hass",void 0),t([function(t){return vt({...t,state:!0})}()],It.prototype,"config",void 0),It=t([(t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){customElements.define(t,e)}}})(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */)("package-tracker-card")],It);export{It as PackageTrackerCard};
