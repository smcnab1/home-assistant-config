(function () {
  "use strict";
  function a() {
    var b = q(["<th>Route</th>"]);
    return (
      (a = function () {
        return b;
      }),
      b
    );
  }
  function b() {
    var a = q(["<th>Distance</th>"]);
    return (
      (b = function () {
        return a;
      }),
      a
    );
  }
  function c() {
    var a = q(["<th>Duration</th>"]);
    return (
      (c = function () {
        return a;
      }),
      a
    );
  }
  function d() {
    var a = q(["<th>Name</th>"]);
    return (
      (d = function () {
        return a;
      }),
      a
    );
  }
  function e() {
    var a = q([
      "\n      <thead>\n        <tr>\n          ",
      "\n          ",
      "\n          ",
      "\n          ",
      "\n        </tr>\n        <thead></thead>\n      </thead>\n    ",
    ]);
    return (
      (e = function () {
        return a;
      }),
      a
    );
  }
  function f() {
    var a = q([
      "\n      <table>\n        ",
      "\n        <tbody>\n          ",
      "\n        </tbody>\n      </table>\n    ",
    ]);
    return (
      (f = function () {
        return a;
      }),
      a
    );
  }
  function g() {
    var a = q(["<td>", "</td>"]);
    return (
      (g = function () {
        return a;
      }),
      a
    );
  }
  function h() {
    var a = q(["<td>", " ", "</td>"]);
    return (
      (h = function () {
        return a;
      }),
      a
    );
  }
  function i() {
    var a = q(["<td>", " ", "</td>"]);
    return (
      (i = function () {
        return a;
      }),
      a
    );
  }
  function j() {
    var a = q(["<td>", "</td>"]);
    return (
      (j = function () {
        return a;
      }),
      a
    );
  }
  function k() {
    var a = q([
      '\n        <tr class="pointer" @click=',
      ">\n          ",
      "\n          ",
      "\n          ",
      "\n          ",
      "\n        </tr>\n\n        <tr></tr>\n      ",
    ]);
    return (
      (k = function () {
        return a;
      }),
      a
    );
  }
  function l() {
    var a = q([' <div class="header">', "</div> "]);
    return (
      (l = function () {
        return a;
      }),
      a
    );
  }
  function m() {
    var a = q([
      '\n      <ha-card class="travel-time-card">\n        <style>\n          ',
      "\n        </style>\n        ",
      '\n        <div class="body">',
      "</div>\n      </ha-card>\n    ",
    ]);
    return (
      (m = function () {
        return a;
      }),
      a
    );
  }
  function p() {
    var a = q([
      "\n    .travel-time-card {\n        display: flex;\n        padding: 0 16px 4px;\n        flex-direction: column;\n    }\n\n    .travel-time-card .header {\n        font-family: var(--paper-font-headline_-_font-family);\n        -webkit-font-smoothing: var(--paper-font-headline_-_-webkit-font-smoothing);\n        font-size: var(--paper-font-headline_-_font-size);\n        font-weight: var(--paper-font-headline_-_font-weight);\n        letter-spacing: var(--paper-font-headline_-_letter-spacing);\n        line-height: var(--paper-font-headline_-_line-height);\n        text-rendering: var(--paper-font-common-expensive-kerning_-_text-rendering);\n        opacity: var(--dark-primary-opacity);\n        padding: 24px 0px 0px;    \n    }\n\n    .travel-time-card .body {\n        margin-bottom: 10px;\n        margin-top: 10px;\n    }\n\n    .travel-time-card .body table {\n\n    }\n\n    .travel-time-card .body table th,\n    .travel-time-card .body table td {\n        padding: 10px 10px 10px 10px;\n    }\n\n    .travel-time-card .body table thead {\n        text-align: left;\n    }\n\n    .travel-time-card .body table tbody {\n        text-align: left;\n    }\n\n    .pointer {\n        cursor: pointer; \n    }\n",
    ]);
    return (
      (p = function () {
        return a;
      }),
      a
    );
  }
  function q(a, b) {
    return (
      b || (b = a.slice(0)),
      Object.freeze(
        Object.defineProperties(a, { raw: { value: Object.freeze(b) } })
      )
    );
  }
  function r(a, b) {
    var c = Object.keys(a);
    if (Object.getOwnPropertySymbols) {
      var d = Object.getOwnPropertySymbols(a);
      b &&
        (d = d.filter(function (b) {
          return Object.getOwnPropertyDescriptor(a, b).enumerable;
        })),
        c.push.apply(c, d);
    }
    return c;
  }
  function s(a) {
    for (var b, c = 1; c < arguments.length; c++)
      (b = null == arguments[c] ? {} : arguments[c]),
        c % 2
          ? r(b, !0).forEach(function (c) {
              t(a, c, b[c]);
            })
          : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(a, Object.getOwnPropertyDescriptors(b))
          : r(b).forEach(function (c) {
              Object.defineProperty(
                a,
                c,
                Object.getOwnPropertyDescriptor(b, c)
              );
            });
    return a;
  }
  function t(a, b, c) {
    return (
      b in a
        ? Object.defineProperty(a, b, {
            value: c,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (a[b] = c),
      a
    );
  }
  function u(a, b, c, d, e, f, g) {
    try {
      var h = a[f](g),
        i = h.value;
    } catch (a) {
      return void c(a);
    }
    h.done ? b(i) : Promise.resolve(i).then(d, e);
  }
  function v(a) {
    return function () {
      var b = this,
        c = arguments;
      return new Promise(function (d, e) {
        function f(a) {
          u(h, d, e, f, g, "next", a);
        }
        function g(a) {
          u(h, d, e, f, g, "throw", a);
        }
        var h = a.apply(b, c);
        f(void 0);
      });
    };
  }
  (function (a, b) {
    "object" == typeof exports && "undefined" != typeof module
      ? b()
      : "function" == typeof define && define.amd
      ? define(b)
      : b();
  })(this, function () {
    function q(a, b) {
      var c,
        f,
        g,
        j,
        k = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : a,
        m = 3 < arguments.length ? arguments[3] : void 0;
      if (b === $) return b;
      var e =
          void 0 === m
            ? k._$Cu
            : null === (c = k._$Cl) || void 0 === c
            ? void 0
            : c[m],
        p = la(b) ? void 0 : b._$litDirective$;
      return (
        (null == e ? void 0 : e.constructor) !== p &&
          (null === (f = null == e ? void 0 : e._$AO) ||
            void 0 === f ||
            f.call(e, !1),
          void 0 === p ? (e = void 0) : ((e = new p(a)), e._$AT(a, k, m)),
          void 0 === m
            ? (k._$Cu = e)
            : ((null !== (g = (j = k)._$Cl) && void 0 !== g
                ? g
                : (j._$Cl = []))[m] = e)),
        void 0 !== e && (b = q(a, e._$AS(a, b.values), e, m)),
        b
      );
    }
    function r(a) {
      return class extends a {
        createRenderRoot() {
          var a = this.constructor,
            { registry: b, elementDefinitions: c, shadowRootOptions: d } = a;
          c &&
            !b &&
            ((a.registry = new CustomElementRegistry()),
            Object.entries(c).forEach((b) => {
              var [c, d] = b;
              return a.registry.define(c, d);
            }));
          var e = (this.renderOptions.creationScope = this.attachShadow(
            s({}, d, { customElements: a.registry })
          ));
          return o(e, this.constructor.elementStyles), e;
        }
      };
    }
    function y(a, b, c) {
      var d = Number.isNaN,
        e = a.attributes.distance || 0;
      if (
        (e.replace && (e = e.replace(/[A-Za-z ]/g, "")),
        (e = parseInt(a.attributes.distance, 10)),
        (e = d(e) ? 0 : e.toFixed(1)),
        (e = parseInt(e, 10)),
        d(e))
      )
        return 0;
      if (b.distance_units) {
        var f = B(a, c);
        "mi" === f && "km" === b.distance_units && (e *= 1.60934),
          "ft" === f && "km" === b.distance_units && (e *= 0.3048),
          "km" === f && "mi" === b.distance_units && (e *= 0.621371),
          "m" === f && "mi" === b.distance_units && (e *= 3.28084);
      }
      return parseInt(e, 10);
    }
    function B(a, b) {
      return (
        "".concat(a.attributes.distance).replace(/[^a-z]/g, "") ||
        b.config.unit_system.length ||
        ""
      );
    }
    function D(a, b, c) {
      return b.distance_units ? b.distance_units : B(a, c);
    }
    function F(a) {
      return a.attributes.destination_addresses;
    }
    function G(a) {
      return /Powered by Waze/i.test(a.attributes.attribution);
    }
    function J(a) {
      return /Powered by Here/i.test(a.attributes.attribution);
    }
    function K(a) {
      var b = "",
        c = "",
        d = "";
      F(a)
        ? ((b = "https://maps.google.com/?"), (c = "daddr="), (d = "daddr="))
        : J(a)
        ? ((b = "https://wego.here.com/directions/mix/"), (c = ""), (d = ""))
        : G(a) &&
          ((b = "https://www.waze.com/ul?navigate=yes&"),
          (c = "latlng="),
          (d = "q="));
      var e = "",
        f = O(a);
      if (
        (a.attributes.destination
          ? (e = "".concat(b).concat(c).concat(a.attributes.destination))
          : f && (e = "".concat(b).concat(d).concat(f)),
        !e)
      )
        throw Error("Could not find an address for ".concat(a.entity_id));
      window.open(e);
    }
    function O(a) {
      return a.attributes.destination_addresses &&
        a.attributes.destination_addresses.length
        ? a.attributes.destination_addresses[0]
        : a.attributes.destination_name
        ? a.attributes.destination_name
        : a.attributes.destination_address || "";
    }
    var P =
        window.ShadowRoot &&
        (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow) &&
        "adoptedStyleSheets" in Document.prototype &&
        "replace" in CSSStyleSheet.prototype,
      Q = Symbol(),
      t = new Map();
    class R {
      constructor(a, b) {
        if (((this._$cssResult$ = !0), b !== Q))
          throw Error(
            "CSSResult is not constructable. Use `unsafeCSS` or `css` instead."
          );
        this.cssText = a;
      }
      get styleSheet() {
        var a = t.get(this.cssText);
        return (
          P &&
            void 0 === a &&
            (t.set(this.cssText, (a = new CSSStyleSheet())),
            a.replaceSync(this.cssText)),
          a
        );
      }
      toString() {
        return this.cssText;
      }
    }
    var n,
      U = (a) => new R("string" == typeof a ? a : a + "", Q),
      o = (a, b) => {
        P
          ? (a.adoptedStyleSheets = b.map((a) =>
              a instanceof CSSStyleSheet ? a : a.styleSheet
            ))
          : b.forEach((b) => {
              var c = document.createElement("style"),
                d = window.litNonce;
              void 0 !== d && c.setAttribute("nonce", d),
                (c.textContent = b.cssText),
                a.appendChild(c);
            });
      },
      W = P
        ? (a) => a
        : (a) =>
            a instanceof CSSStyleSheet
              ? ((a) => {
                  var b = "";
                  for (var c of a.cssRules) b += c.cssText;
                  return U(b);
                })(a)
              : a,
      S = window.trustedTypes,
      X = S ? S.emptyScript : "",
      Y = window.reactiveElementPolyfillSupport,
      Z = {
        toAttribute(a, b) {
          return (
            b === Boolean
              ? (a = a ? X : null)
              : b === Object || b === Array
              ? (a = null == a ? a : JSON.stringify(a))
              : void 0,
            a
          );
        },
        fromAttribute(a, b) {
          var c = a;
          switch (b) {
            case Boolean:
              c = null !== a;
              break;
            case Number:
              c = null === a ? null : +a;
              break;
            case Object:
            case Array:
              try {
                c = JSON.parse(a);
              } catch (a) {
                c = null;
              }
          }
          return c;
        },
      },
      aa = (a, b) => b !== a && (b == b || a == a),
      ba = {
        attribute: !0,
        type: String,
        converter: Z,
        reflect: !1,
        hasChanged: aa,
      };
    class ca extends HTMLElement {
      constructor() {
        super(),
          (this._$Et = new Map()),
          (this.isUpdatePending = !1),
          (this.hasUpdated = !1),
          (this._$Ei = null),
          this.o();
      }
      static addInitializer(a) {
        var b;
        (null !== (b = this.l) && void 0 !== b) || (this.l = []),
          this.l.push(a);
      }
      static get observedAttributes() {
        this.finalize();
        var a = [];
        return (
          this.elementProperties.forEach((b, c) => {
            var d = this._$Eh(c, b);
            void 0 !== d && (this._$Eu.set(d, c), a.push(d));
          }),
          a
        );
      }
      static createProperty(a) {
        var b =
          1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : ba;
        if (
          (b.state && (b.attribute = !1),
          this.finalize(),
          this.elementProperties.set(a, b),
          !b.noAccessor && !this.prototype.hasOwnProperty(a))
        ) {
          var c = "symbol" == typeof a ? Symbol() : "__" + a,
            d = this.getPropertyDescriptor(a, c, b);
          void 0 !== d && Object.defineProperty(this.prototype, a, d);
        }
      }
      static getPropertyDescriptor(a, b, c) {
        return {
          get() {
            return this[b];
          },
          set(d) {
            var e = this[a];
            (this[b] = d), this.requestUpdate(a, e, c);
          },
          configurable: !0,
          enumerable: !0,
        };
      }
      static getPropertyOptions(a) {
        return this.elementProperties.get(a) || ba;
      }
      static finalize() {
        if (this.hasOwnProperty("finalized")) return !1;
        this.finalized = !0;
        var a = Object.getPrototypeOf(this);
        if (
          (a.finalize(),
          (this.elementProperties = new Map(a.elementProperties)),
          (this._$Eu = new Map()),
          this.hasOwnProperty("properties"))
        ) {
          var b = this.properties,
            c = [
              ...Object.getOwnPropertyNames(b),
              ...Object.getOwnPropertySymbols(b),
            ];
          for (var d of c) this.createProperty(d, b[d]);
        }
        return (this.elementStyles = this.finalizeStyles(this.styles)), !0;
      }
      static finalizeStyles(a) {
        var b = [];
        if (Array.isArray(a)) {
          var c = new Set(a.flat(1 / 0).reverse());
          for (var d of c) b.unshift(W(d));
        } else void 0 !== a && b.push(W(a));
        return b;
      }
      static _$Eh(a, b) {
        var c = b.attribute;
        return !1 === c
          ? void 0
          : "string" == typeof c
          ? c
          : "string" == typeof a
          ? a.toLowerCase()
          : void 0;
      }
      o() {
        var a;
        (this._$Ep = new Promise((a) => (this.enableUpdating = a))),
          (this._$AL = new Map()),
          this._$Em(),
          this.requestUpdate(),
          null === (a = this.constructor.l) ||
            void 0 === a ||
            a.forEach((a) => a(this));
      }
      addController(a) {
        var b, c;
        (null !== (b = this._$Eg) && void 0 !== b ? b : (this._$Eg = [])).push(
          a
        ),
          void 0 !== this.renderRoot &&
            this.isConnected &&
            (null === (c = a.hostConnected) || void 0 === c || c.call(a));
      }
      removeController(a) {
        var b;
        null === (b = this._$Eg) ||
          void 0 === b ||
          b.splice(this._$Eg.indexOf(a) >>> 0, 1);
      }
      _$Em() {
        this.constructor.elementProperties.forEach((a, b) => {
          this.hasOwnProperty(b) && (this._$Et.set(b, this[b]), delete this[b]);
        });
      }
      createRenderRoot() {
        var a,
          b =
            null !== (a = this.shadowRoot) && void 0 !== a
              ? a
              : this.attachShadow(this.constructor.shadowRootOptions);
        return o(b, this.constructor.elementStyles), b;
      }
      connectedCallback() {
        var a;
        void 0 === this.renderRoot &&
          (this.renderRoot = this.createRenderRoot()),
          this.enableUpdating(!0),
          null === (a = this._$Eg) ||
            void 0 === a ||
            a.forEach((a) => {
              var b;
              return null === (b = a.hostConnected) || void 0 === b
                ? void 0
                : b.call(a);
            });
      }
      enableUpdating(a) {}
      disconnectedCallback() {
        var a;
        null === (a = this._$Eg) ||
          void 0 === a ||
          a.forEach((a) => {
            var b;
            return null === (b = a.hostDisconnected) || void 0 === b
              ? void 0
              : b.call(a);
          });
      }
      attributeChangedCallback(a, b, c) {
        this._$AK(a, c);
      }
      _$ES(a, b) {
        var c,
          d,
          f =
            2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : ba,
          g = this.constructor._$Eh(a, f);
        if (void 0 !== g && !0 === f.reflect) {
          var h = (
            null !==
              (d =
                null === (c = f.converter) || void 0 === c
                  ? void 0
                  : c.toAttribute) && void 0 !== d
              ? d
              : Z.toAttribute
          )(b, f.type);
          (this._$Ei = a),
            null == h ? this.removeAttribute(g) : this.setAttribute(g, h),
            (this._$Ei = null);
        }
      }
      _$AK(a, b) {
        var c,
          d,
          f,
          g = this.constructor,
          h = g._$Eu.get(a);
        if (void 0 !== h && this._$Ei !== h) {
          var i = g.getPropertyOptions(h),
            j = i.converter,
            k =
              null !==
                (f =
                  null !==
                    (d =
                      null === (c = j) || void 0 === c
                        ? void 0
                        : c.fromAttribute) && void 0 !== d
                    ? d
                    : "function" == typeof j
                    ? j
                    : null) && void 0 !== f
                ? f
                : Z.fromAttribute;
          (this._$Ei = h), (this[h] = k(b, i.type)), (this._$Ei = null);
        }
      }
      requestUpdate(a, b, c) {
        var d = !0;
        void 0 !== a &&
          (((c = c || this.constructor.getPropertyOptions(a)).hasChanged || aa)(
            this[a],
            b
          )
            ? (this._$AL.has(a) || this._$AL.set(a, b),
              !0 === c.reflect &&
                this._$Ei !== a &&
                (void 0 === this._$EC && (this._$EC = new Map()),
                this._$EC.set(a, c)))
            : (d = !1)),
          !this.isUpdatePending && d && (this._$Ep = this._$E_());
      }
      _$E_() {
        var a = this;
        return v(function* () {
          a.isUpdatePending = !0;
          try {
            yield a._$Ep;
          } catch (a) {
            Promise.reject(a);
          }
          var b = a.scheduleUpdate();
          return null != b && (yield b), !a.isUpdatePending;
        })();
      }
      scheduleUpdate() {
        return this.performUpdate();
      }
      performUpdate() {
        var a;
        if (this.isUpdatePending) {
          this.hasUpdated,
            this._$Et &&
              (this._$Et.forEach((a, b) => (this[b] = a)),
              (this._$Et = void 0));
          var b = !1,
            c = this._$AL;
          try {
            (b = this.shouldUpdate(c)),
              b
                ? (this.willUpdate(c),
                  null === (a = this._$Eg) ||
                    void 0 === a ||
                    a.forEach((a) => {
                      var b;
                      return null === (b = a.hostUpdate) || void 0 === b
                        ? void 0
                        : b.call(a);
                    }),
                  this.update(c))
                : this._$EU();
          } catch (a) {
            throw ((b = !1), this._$EU(), a);
          }
          b && this._$AE(c);
        }
      }
      willUpdate(a) {}
      _$AE(a) {
        var b;
        null === (b = this._$Eg) ||
          void 0 === b ||
          b.forEach((a) => {
            var b;
            return null === (b = a.hostUpdated) || void 0 === b
              ? void 0
              : b.call(a);
          }),
          this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(a)),
          this.updated(a);
      }
      _$EU() {
        (this._$AL = new Map()), (this.isUpdatePending = !1);
      }
      get updateComplete() {
        return this.getUpdateComplete();
      }
      getUpdateComplete() {
        return this._$Ep;
      }
      shouldUpdate(a) {
        return !0;
      }
      update(a) {
        void 0 !== this._$EC &&
          (this._$EC.forEach((a, b) => this._$ES(b, this[b], a)),
          (this._$EC = void 0)),
          this._$EU();
      }
      updated(a) {}
      firstUpdated(a) {}
    }
    (ca.finalized = !0),
      (ca.elementProperties = new Map()),
      (ca.elementStyles = []),
      (ca.shadowRootOptions = { mode: "open" }),
      null == Y || Y({ ReactiveElement: ca }),
      (null !== (n = globalThis.reactiveElementVersions) && void 0 !== n
        ? n
        : (globalThis.reactiveElementVersions = [])
      ).push("1.3.1");
    var da,
      ea = globalThis.trustedTypes,
      fa = ea ? ea.createPolicy("lit-html", { createHTML: (a) => a }) : void 0,
      ga = "lit$".concat((Math.random() + "").slice(9), "$"),
      ha = "?" + ga,
      ia = "<".concat(ha, ">"),
      ja = document,
      ka = function () {
        var a =
          0 < arguments.length && arguments[0] !== void 0 ? arguments[0] : "";
        return ja.createComment(a);
      },
      la = (a) =>
        null === a || ("object" != typeof a && "function" != typeof a),
      ma = Array.isArray,
      na = (a) => {
        var b;
        return (
          ma(a) ||
          "function" ==
            typeof (null === (b = a) || void 0 === b
              ? void 0
              : b[Symbol.iterator])
        );
      },
      u = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
      oa = /-->/g,
      pa = />/g,
      qa =
        />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,
      ra = /'/g,
      _ = /"/g,
      sa = /^(?:script|style|textarea|title)$/i,
      ta = ((a) =>
        function (b) {
          for (
            var c = arguments.length, d = Array(1 < c ? c - 1 : 0), e = 1;
            e < c;
            e++
          )
            d[e - 1] = arguments[e];
          return { _$litType$: a, strings: b, values: d };
        })(1),
      $ = Symbol.for("lit-noChange"),
      ua = Symbol.for("lit-nothing"),
      w = new WeakMap(),
      T = (a, b, c) => {
        var d,
          f,
          g =
            null !== (d = null == c ? void 0 : c.renderBefore) && void 0 !== d
              ? d
              : b,
          h = g._$litPart$;
        if (void 0 === h) {
          var i =
            null !== (f = null == c ? void 0 : c.renderBefore) && void 0 !== f
              ? f
              : null;
          g._$litPart$ = h = new V(
            b.insertBefore(ka(), i),
            i,
            void 0,
            null == c ? {} : c
          );
        }
        return h._$AI(a), h;
      },
      x = ja.createTreeWalker(ja, 129, null, !1),
      A = (a, b) => {
        for (
          var c,
            e = a.length - 1,
            f = [],
            g = 2 === b ? "<svg>" : "",
            i = u,
            j = 0;
          j < e;
          j++
        ) {
          for (
            var k = a[j], l = void 0, m = void 0, n = -1, o = 0;
            o < k.length && ((i.lastIndex = o), (m = i.exec(k)), null !== m);

          )
            (o = i.lastIndex),
              i === u
                ? "!--" === m[1]
                  ? (i = oa)
                  : void 0 === m[1]
                  ? void 0 === m[2]
                    ? void 0 !== m[3] && (i = qa)
                    : (sa.test(m[2]) && (c = RegExp("</" + m[2], "g")),
                      (i = qa))
                  : (i = pa)
                : i === qa
                ? ">" === m[0]
                  ? ((i = null == c ? u : c), (n = -1))
                  : void 0 === m[1]
                  ? (n = -2)
                  : ((n = i.lastIndex - m[2].length),
                    (l = m[1]),
                    (i = void 0 === m[3] ? qa : '"' === m[3] ? _ : ra))
                : i === _ || i === ra
                ? (i = qa)
                : i === oa || i === pa
                ? (i = u)
                : ((i = qa), (c = void 0));
          var q = i === qa && a[j + 1].startsWith("/>") ? " " : "";
          g +=
            i === u
              ? k + ia
              : 0 <= n
              ? (f.push(l), k.slice(0, n) + "$lit$" + k.slice(n) + ga + q)
              : k + ga + (-2 === n ? (f.push(void 0), j) : q);
        }
        var p = g + (a[e] || "<?>") + (2 === b ? "</svg>" : "");
        if (!Array.isArray(a) || !a.hasOwnProperty("raw"))
          throw Error("invalid template strings array");
        return [void 0 === fa ? p : fa.createHTML(p), f];
      };
    class C {
      constructor(b, e) {
        var f,
          { strings: g, _$litType$: h } = b;
        this.parts = [];
        var i = 0,
          j = 0,
          k = g.length - 1,
          m = this.parts,
          [c, n] = A(g, h);
        if (
          ((this.el = C.createElement(c, e)),
          (x.currentNode = this.el.content),
          2 === h)
        ) {
          var a = this.el.content,
            o = a.firstChild;
          o.remove(), a.append(...o.childNodes);
        }
        for (; null !== (f = x.nextNode()) && m.length < k; ) {
          if (1 === f.nodeType) {
            if (f.hasAttributes()) {
              var p = [];
              for (var q of f.getAttributeNames())
                if (q.endsWith("$lit$") || q.startsWith(ga)) {
                  var s = n[j++];
                  if ((p.push(q), void 0 !== s)) {
                    var t = f.getAttribute(s.toLowerCase() + "$lit$").split(ga),
                      u = /([.?@])?(.*)/.exec(s);
                    m.push({
                      type: 1,
                      index: i,
                      name: u[2],
                      strings: t,
                      ctor:
                        "." === u[1]
                          ? va
                          : "?" === u[1]
                          ? wa
                          : "@" === u[1]
                          ? H
                          : N,
                    });
                  } else m.push({ type: 6, index: i });
                }
              for (var v of p) f.removeAttribute(v);
            }
            if (sa.test(f.tagName)) {
              var w = f.textContent.split(ga),
                y = w.length - 1;
              if (0 < y) {
                f.textContent = ea ? ea.emptyScript : "";
                for (var z = 0; z < y; z++)
                  f.append(w[z], ka()),
                    x.nextNode(),
                    m.push({ type: 2, index: ++i });
                f.append(w[y], ka());
              }
            }
          } else if (8 === f.nodeType)
            if (f.data === ha) m.push({ type: 2, index: i });
            else
              for (var B = -1; -1 !== (B = f.data.indexOf(ga, B + 1)); )
                m.push({ type: 7, index: i }), (B += ga.length - 1);
          i++;
        }
      }
      static createElement(a, b) {
        var c = ja.createElement("template");
        return (c.innerHTML = a), c;
      }
    }
    class E {
      constructor(a, b) {
        (this.v = []), (this._$AN = void 0), (this._$AD = a), (this._$AM = b);
      }
      get parentNode() {
        return this._$AM.parentNode;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      p(a) {
        var b,
          {
            el: { content: e },
            parts: c,
          } = this._$AD,
          f = (
            null !== (b = null == a ? void 0 : a.creationScope) && void 0 !== b
              ? b
              : ja
          ).importNode(e, !0);
        x.currentNode = f;
        for (var g = x.nextNode(), j = 0, h = 0, k = c[0]; void 0 !== k; ) {
          if (j === k.index) {
            var d = void 0;
            2 === k.type
              ? (d = new V(g, g.nextSibling, this, a))
              : 1 === k.type
              ? (d = new k.ctor(g, k.name, k.strings, this, a))
              : 6 === k.type && (d = new I(g, this, a)),
              this.v.push(d),
              (k = c[++h]);
          }
          j !== (null == k ? void 0 : k.index) && ((g = x.nextNode()), j++);
        }
        return f;
      }
      m(a) {
        var b = 0;
        for (var c of this.v)
          void 0 !== c &&
            (void 0 === c.strings
              ? c._$AI(a[b])
              : (c._$AI(a, c, b), (b += c.strings.length - 2))),
            b++;
      }
    }
    class V {
      constructor(a, b, c, d) {
        var e;
        (this.type = 2),
          (this._$AH = ua),
          (this._$AN = void 0),
          (this._$AA = a),
          (this._$AB = b),
          (this._$AM = c),
          (this.options = d),
          (this._$Cg =
            null === (e = null == d ? void 0 : d.isConnected) ||
            void 0 === e ||
            e);
      }
      get _$AU() {
        var a, b;
        return null !==
          (b = null === (a = this._$AM) || void 0 === a ? void 0 : a._$AU) &&
          void 0 !== b
          ? b
          : this._$Cg;
      }
      get parentNode() {
        var a = this._$AA.parentNode,
          b = this._$AM;
        return void 0 !== b && 11 === a.nodeType && (a = b.parentNode), a;
      }
      get startNode() {
        return this._$AA;
      }
      get endNode() {
        return this._$AB;
      }
      _$AI(a) {
        var b =
          1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : this;
        (a = q(this, a, b)),
          la(a)
            ? a === ua || null == a || "" === a
              ? (this._$AH !== ua && this._$AR(), (this._$AH = ua))
              : a !== this._$AH && a !== $ && this.$(a)
            : void 0 === a._$litType$
            ? void 0 === a.nodeType
              ? na(a)
                ? this.S(a)
                : this.$(a)
              : this.k(a)
            : this.T(a);
      }
      M(a) {
        var b =
          1 < arguments.length && arguments[1] !== void 0
            ? arguments[1]
            : this._$AB;
        return this._$AA.parentNode.insertBefore(a, b);
      }
      k(a) {
        this._$AH !== a && (this._$AR(), (this._$AH = this.M(a)));
      }
      $(a) {
        this._$AH !== ua && la(this._$AH)
          ? (this._$AA.nextSibling.data = a)
          : this.k(ja.createTextNode(a)),
          (this._$AH = a);
      }
      T(a) {
        var b,
          { values: c, _$litType$: d } = a,
          e =
            "number" == typeof d
              ? this._$AC(a)
              : (void 0 === d.el && (d.el = C.createElement(d.h, this.options)),
                d);
        if ((null === (b = this._$AH) || void 0 === b ? void 0 : b._$AD) === e)
          this._$AH.m(c);
        else {
          var f = new E(e, this),
            g = f.p(this.options);
          f.m(c), this.k(g), (this._$AH = f);
        }
      }
      _$AC(a) {
        var b = w.get(a.strings);
        return void 0 === b && w.set(a.strings, (b = new C(a))), b;
      }
      S(a) {
        ma(this._$AH) || ((this._$AH = []), this._$AR());
        var b,
          c = this._$AH,
          d = 0;
        for (var f of a)
          d === c.length
            ? c.push(
                (b = new V(this.M(ka()), this.M(ka()), this, this.options))
              )
            : (b = c[d]),
            b._$AI(f),
            d++;
        d < c.length && (this._$AR(b && b._$AB.nextSibling, d), (c.length = d));
      }
      _$AR() {
        var a,
          b =
            0 < arguments.length && arguments[0] !== void 0
              ? arguments[0]
              : this._$AA.nextSibling,
          c = 1 < arguments.length ? arguments[1] : void 0;
        for (
          null === (a = this._$AP) || void 0 === a || a.call(this, !1, !0, c);
          b && b !== this._$AB;

        ) {
          var d = b.nextSibling;
          b.remove(), (b = d);
        }
      }
      setConnected(a) {
        var b;
        void 0 === this._$AM &&
          ((this._$Cg = a),
          null === (b = this._$AP) || void 0 === b || b.call(this, a));
      }
    }
    class N {
      constructor(a, b, c, d, e) {
        (this.type = 1),
          (this._$AH = ua),
          (this._$AN = void 0),
          (this.element = a),
          (this.name = b),
          (this._$AM = d),
          (this.options = e),
          2 < c.length || "" !== c[0] || "" !== c[1]
            ? ((this._$AH = Array(c.length - 1).fill(new String())),
              (this.strings = c))
            : (this._$AH = ua);
      }
      get tagName() {
        return this.element.tagName;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      _$AI(a) {
        var b =
            1 < arguments.length && arguments[1] !== void 0
              ? arguments[1]
              : this,
          c = 2 < arguments.length ? arguments[2] : void 0,
          d = 3 < arguments.length ? arguments[3] : void 0,
          e = this.strings,
          f = !1;
        if (void 0 === e)
          (a = q(this, a, b, 0)),
            (f = !la(a) || (a !== this._$AH && a !== $)),
            f && (this._$AH = a);
        else {
          var g,
            h,
            i = a;
          for (a = e[0], g = 0; g < e.length - 1; g++)
            (h = q(this, i[c + g], b, g)),
              h === $ && (h = this._$AH[g]),
              f || (f = !la(h) || h !== this._$AH[g]),
              h === ua
                ? (a = ua)
                : a !== ua && (a += (null == h ? "" : h) + e[g + 1]),
              (this._$AH[g] = h);
        }
        f && !d && this.C(a);
      }
      C(a) {
        a === ua
          ? this.element.removeAttribute(this.name)
          : this.element.setAttribute(this.name, null == a ? "" : a);
      }
    }
    class va extends N {
      constructor() {
        super(...arguments), (this.type = 3);
      }
      C(a) {
        this.element[this.name] = a === ua ? void 0 : a;
      }
    }
    var M = ea ? ea.emptyScript : "";
    class wa extends N {
      constructor() {
        super(...arguments), (this.type = 4);
      }
      C(a) {
        a && a !== ua
          ? this.element.setAttribute(this.name, M)
          : this.element.removeAttribute(this.name);
      }
    }
    class H extends N {
      constructor(a, b, c, d, e) {
        super(a, b, c, d, e), (this.type = 5);
      }
      _$AI(a) {
        var b,
          c =
            1 < arguments.length && arguments[1] !== void 0
              ? arguments[1]
              : this;
        if (
          (a = null !== (b = q(this, a, c, 0)) && void 0 !== b ? b : ua) !== $
        ) {
          var d = this._$AH,
            e =
              (a === ua && d !== ua) ||
              a.capture !== d.capture ||
              a.once !== d.once ||
              a.passive !== d.passive,
            f = a !== ua && (d === ua || e);
          e && this.element.removeEventListener(this.name, this, d),
            f && this.element.addEventListener(this.name, this, a),
            (this._$AH = a);
        }
      }
      handleEvent(a) {
        var b, c;
        "function" == typeof this._$AH
          ? this._$AH.call(
              null !==
                (c =
                  null === (b = this.options) || void 0 === b
                    ? void 0
                    : b.host) && void 0 !== c
                ? c
                : this.element,
              a
            )
          : this._$AH.handleEvent(a);
      }
    }
    class I {
      constructor(a, b, c) {
        (this.element = a),
          (this.type = 6),
          (this._$AN = void 0),
          (this._$AM = b),
          (this.options = c);
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      _$AI(a) {
        q(this, a);
      }
    }
    var L = window.litHtmlPolyfillSupport;
    null == L || L(C, V),
      (null !== (da = globalThis.litHtmlVersions) && void 0 !== da
        ? da
        : (globalThis.litHtmlVersions = [])
      ).push("2.2.2");
    var z, xa;
    class ya extends ca {
      constructor() {
        super(...arguments),
          (this.renderOptions = { host: this }),
          (this._$Dt = void 0);
      }
      createRenderRoot() {
        var a,
          b,
          c = super.createRenderRoot();
        return (
          (null !== (a = (b = this.renderOptions).renderBefore) &&
            void 0 !== a) ||
            (b.renderBefore = c.firstChild),
          c
        );
      }
      update(a) {
        var b = this.render();
        this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
          super.update(a),
          (this._$Dt = T(b, this.renderRoot, this.renderOptions));
      }
      connectedCallback() {
        var a;
        super.connectedCallback(),
          null === (a = this._$Dt) || void 0 === a || a.setConnected(!0);
      }
      disconnectedCallback() {
        var a;
        super.disconnectedCallback(),
          null === (a = this._$Dt) || void 0 === a || a.setConnected(!1);
      }
      render() {
        return $;
      }
    }
    (ya.finalized = !0),
      (ya._$litElement$ = !0),
      null === (z = globalThis.litElementHydrateSupport) ||
        void 0 === z ||
        z.call(globalThis, { LitElement: ya });
    var za = globalThis.litElementPolyfillSupport;
    null == za || za({ LitElement: ya }),
      (null !== (xa = globalThis.litElementVersions) && void 0 !== xa
        ? xa
        : (globalThis.litElementVersions = [])
      ).push("3.2.0");
    var Aa = (function r(a) {
        for (
          var b = arguments.length, c = Array(1 < b ? b - 1 : 0), d = 1;
          d < b;
          d++
        )
          c[d - 1] = arguments[d];
        var e =
          1 === a.length
            ? a[0]
            : c.reduce(
                (b, c, d) =>
                  b +
                  ((a) => {
                    if (!0 === a._$cssResult$) return a.cssText;
                    if ("number" == typeof a) return a;
                    throw Error(
                      "Value passed to 'css' function must be a 'css' function result: " +
                        a +
                        ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security."
                    );
                  })(c) +
                  a[d + 1],
                a[0]
              );
        return new R(e, Q);
      })(p()),
      Ba = {
        show_header: !0,
        title: "Travel Times",
        columns: ["name", "duration", "distance", "route"],
        entites: [],
        distance_units: "",
      };
    console.info(
      "%c TRAVEL-TIME-CARD \n%c  Version ".concat(
        {
          name: "travel-time-card",
          version: "2.0.0",
          description: "Travel time card for Home Assistant",
          keywords: [
            "home-assistant",
            "homeassistant",
            "hass",
            "automation",
            "Google Maps",
            "Travel Time",
            "custom-cards",
          ],
          repository: "git@github.com:ljmerza/travel-time-card.git",
          author: "Leonardo Merza <ljmerza@gmail.com>",
          license: "MIT",
          dependencies: {
            "@lit-labs/scoped-registry-mixin": "^1.0.0",
            "core-js": "^2.6.5",
            lit: "^2.1.2",
          },
          devDependencies: {
            "@rollup/plugin-json": "^4.0.3",
            eslint: "^5.16.0",
            "eslint-config-airbnb-base": "^13.1.0",
            "eslint-plugin-import": "2.16.0",
            rollup: "^0.66.6",
            "rollup-plugin-node-resolve": "^3.4.0",
          },
          resolutions: {
            lit: "^2.1.2",
            "lit-html": "2.1.2",
            "lit-element": "3.1.2",
            "@lit/reactive-element": "1.2.1",
          },
          scripts: {
            build: "npm run rollup && npm run babel",
            rollup: "rollup -c",
            babel:
              "babel dist/travel-time-card.js --out-file dist/travel-time-card.js",
            lint: "eslint src/* --ext .js",
            watch: "rollup -c --watch",
            start: "rollup -c --watch",
          },
        }.version,
        "   "
      ),
      "color: orange; font-weight: bold; background: black",
      "color: white; font-weight: bold; background: dimgray"
    );
    class Ca extends r(ya) {
      static get properties() {
        return { hass: Object, config: Object };
      }
      setConfig(a) {
        if (!a.entities) throw Error("entities required.");
        this.config = s({}, Ba, {}, a);
      }
      getCardSize() {
        var a = this.config && this.config.header ? 1 : 0,
          b = this.config && this.config.entities.length ? 1 : 0;
        return a + b;
      }
      static get styles() {
        return Aa;
      }
      render() {
        return ta(
          m(),
          Ca.styles,
          this.config.show_header ? this.renderHeader() : null,
          this.renderBody()
        );
      }
      renderHeader() {
        return ta(l(), this.config.title);
      }
      renderBody() {
        var a = this.config.entities.map((a) => {
          var b = a.entity || a,
            c = this.hass.states[b],
            { attributes: d } = c,
            e = y(c, this.config, this.hass),
            f = D(c, this.config, this.hass);
          return ta(
            k(),
            () => K(c),
            this.config.columns.includes("name")
              ? ta(j(), d.friendly_name || c.entity_id)
              : null,
            this.config.columns.includes("duration")
              ? ta(i(), parseInt(d.duration, 10), d.unit_of_measurement)
              : null,
            this.config.columns.includes("distance") ? ta(h(), e, f) : null,
            this.config.columns.includes("route") ? ta(g(), d.route) : null
          );
        });
        return ta(f(), this.renderBodyHeader(), a);
      }
      renderBodyHeader() {
        return ta(
          e(),
          this.config.columns.includes("name") ? ta(d()) : null,
          this.config.columns.includes("duration") ? ta(c()) : null,
          this.config.columns.includes("distance") ? ta(b()) : null,
          this.config.columns.includes("route") ? ta(a()) : null
        );
      }
    }
    customElements.define("travel-time-card", Ca),
      (window.customCards = window.customCards || []),
      window.customCards.push({
        type: "travel-time-card",
        name: "Travel Time Card",
        description: "Show Travel Times",
      });
  });
})();
