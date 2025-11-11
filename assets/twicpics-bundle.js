(() => {
  // node_modules/@twicpics/components/webcomponents/module.mjs
  var t = (e2) => {
    if (!e2) return;
    const { attributes: s2, element: r2, elementName: n2, value: i2 } = e2, o2 = r2 || document.createElement(n2 || "div");
    if (s2 && o2 instanceof HTMLElement) for (const [t2, e3] of Object.entries(s2)) o2.setAttribute(t2, String(e3));
    if (i2) if ("string" == typeof i2) o2.innerHTML = i2;
    else for (const e3 of Array.isArray(i2) ? i2 : [i2]) {
      const s3 = t(e3);
      s3 && o2.appendChild(s3);
    }
    return o2;
  };
  var e = /px$/;
  var s = (t2) => Number(t2.replace(e, ""));
  var r = () => {
  };
  var n = (t2, { filter: e2, defaultValue: s2 } = {}) => (r2) => {
    let n2;
    return r2 && `${r2}`.replace(t2, ((t3, e3) => n2 = e3)), (e2 ? e2(n2) : n2) || s2;
  };
  var i = (t2) => {
    throw new Error(((t3) => `twicpics-components ${t3}`)(t2));
  };
  var o = (t2, { border: e2 = "\\s", regExpFlags: s2 } = {}) => new RegExp(`^(?:${e2})*(${Array.isArray(t2) ? t2.join("|") : t2})(?:${e2})*$`, s2);
  var a = { breakpoints: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 }, class: "twic", domain: void 0, env: "production", handleShadowDom: r, maxDPR: void 0, path: "", step: void 0 };
  var c = window;
  var $ = c["~ TPCC"] || (c["~ TPCC"] = a);
  var l = () => `.twic-w>.${$.class}-background-done+div,.twic-w>.${$.class}-done+div,.twic-w>.${$.class}-poster-done+div{opacity:0 !important}.twic-w>.${$.class}-done,.twic-w>.${$.class}-poster-done{transform:none !important}`;
  var d = (t2) => `data-${$.class}-${t2}`;
  var u = /^(?:(auth|placeholder|rel)|(image|media|video)|[^:]*):(\/*)((v[0-9]+(?=[/?]))?[^?]*(\?.*)?)$/;
  var f = (t2) => {
    const e2 = t2 && u.exec(t2), { domain: s2 = "" } = $;
    return { isAbsolute: t2.slice(0, s2.length + 1) === `${s2}/`, isSpecial: e2 && void 0 !== e2[1] };
  };
  var h = ({ context: t2, inspect: e2, output: s2, quality: r2, src: n2, transform: i2 }) => {
    const { domain: o2 } = $, { isAbsolute: a2 } = f(n2), c2 = a2 ? `media:${n2.slice(`${o2}/`.length)}` : n2, l2 = u.exec(c2), d2 = l2 && l2[2], h2 = s2 ? `/output=${s2}` : "", p2 = d2 ? l2[4] : c2, m2 = r2 ? `/quality=${r2}` : "", g2 = e2 ? "/inspect" : "", y2 = (({ height: t3, mode: e3 = "cover", width: s3 }, r3) => {
      if (r3 && (s3 || t3)) {
        const n3 = t3 || "-", i3 = s3 || "-";
        return r3.replace(/(\/*\*)/g, `/${e3}=${i3}x${n3}`).replace(/WxH/g, `${i3}x${n3}`);
      }
      return r3;
    })(t2, i2);
    return `${o2}/${l2 && (l2[1] || l2[5]) ? `v1${y2}${h2}${m2}${g2}/${d2 ? `${l2[2]}:${p2}` : p2}` : `${p2}${l2 && l2[6] ? "&" : "?"}twic=v1${y2}${h2}${g2}${m2}`}`;
  };
  var p = (t2, e2) => "cover" === (t2 || "cover") && void 0 !== e2 ? "" : "/*";
  var m = ["center"];
  for (const t2 of ["", "bottom", "top"]) for (const e2 of ["", "left", "right"]) (e2 || t2) && m.push(t2 ? e2 ? `${t2}-${e2}` : t2 : e2);
  var g = /\?|^\/*$/;
  o(m), o(["none", "disk", "memory", "memory-disk"]);
  var y = /(^https?:\/\/[^/]+)\/*$/;
  var b = o(["debug", "offline", "production"]);
  var v = o(["high", "low", "auto"]);
  var x = o("\\s*(\\d+)\\s*[x]\\s*(\\d+)\\s*");
  var w = o(["contain", "cover"]);
  var O = o(["maincolor", "meancolor", "none", "preview"]);
  var k = /^\/*(.+?)\/*$/;
  var j = o("(\\d+(?:\\.\\d+)?)(?:\\s*[\\/:]\\s*(\\d+(?:\\.\\d+)?))?|(none)");
  var E = o("(\\d+\\.?\\d*)|(css)", { regExpFlags: "i" });
  var z = (t2) => !isNaN(t2) && t2 > 0;
  var P = /^((image|media|video):)?\/*/;
  var S = n(o("(?:.|\n)*?"));
  var N = o(".+?", { border: "[\\s\\/]" });
  var _ = { true: true, false: false, "": true };
  var T = (t2) => "boolean" == typeof t2 ? t2 : void 0 !== t2 && _[t2.trim()];
  var A = /(?:§(?<breakpoint>xs|sm|md|lg|xl|2xl|\d*)\s+)?(?<value>[^§]+)/gm;
  var M = (t2, e2) => (s2) => {
    const r2 = { 0: t2(e2) }, n2 = (s2 || "").toString().trim().replace(/(?:^|\s|,)@/g, "\xA7");
    if (n2) {
      let s3;
      for (; null !== (s3 = A.exec(n2)); ) {
        const { breakpoint: n3, value: i2 } = s3.groups || {}, o2 = Number(n3 || "0");
        r2[isNaN(o2) ? $.breakpoints[n3] : o2] = t2(i2 ? i2.replace(/\s*,+\s*$/g, "") : e2);
      }
    }
    return r2;
  };
  var C = (t2) => {
    if ("number" != typeof t2) {
      const e2 = S(t2);
      t2 = e2 && Number(e2);
    }
    return z(t2) ? t2 : void 0;
  };
  var D = /\b(?:(left|right)|(bottom|top))\b/g;
  var F = (t2) => {
    const e2 = S(t2);
    let s2, r2;
    if (e2) {
      let t3;
      for (; t3 = D.exec(e2); ) t3[1] ? s2 = t3[1] : r2 = t3[2];
    }
    return { x: s2, y: r2 };
  };
  var R = M(F);
  var L = (t2) => S(t2) || "";
  var H = S;
  var B = (t2) => {
    const e2 = S(t2);
    return y.test(e2) ? e2.replace(y, "$1") : void 0;
  };
  var W = C;
  var q = T;
  var I = n(v);
  var Y = n(b);
  var J = (t2) => {
    const e2 = S(t2);
    return "none" === e2 ? "" : e2;
  };
  var V = M(J);
  var X = C;
  var Z = n(w);
  var G = M(Z, "cover");
  var K = (t2) => {
    const e2 = S(t2);
    return e2 ? e2.replace(k, "$1/") : "";
  };
  var Q = S;
  var U = M(Q);
  var tt = (t2) => {
    const e2 = n(N, { filter: (t3) => t3 && t3.replace(/^\/*(.*[^/])\/*$/, "$1") })(t2);
    return "none" === e2 ? "" : e2;
  };
  var et = M(tt);
  var st = (t2) => {
    if ("none" === t2) return 0;
    let e2;
    if (t2) if ("number" == typeof t2) e2 = 1 / t2;
    else {
      const s2 = j.exec(t2);
      if (s2) {
        const [, , t3, r2] = s2;
        e2 = (r2 ? Number(r2) : 1) / Number(t3);
      } else e2 = 1;
    }
    return z(e2) ? e2 : void 0;
  };
  var rt = M(st, 1);
  var nt = (t2) => {
    const e2 = T(t2);
    if (void 0 === e2) {
      const e3 = S((t2 || "").toString());
      return e3 && e3.replace(/\s/g, "");
    }
    return e2 ? "" : void 0;
  };
  var it = (t2) => S(t2) || null;
  var ot = M(((t2) => {
    const e2 = S(t2);
    return e2 && e2.replace(/\n\s*/g, "");
  }));
  var at = (t2) => {
    if ("offline" === $.env) return "";
    const e2 = S(t2) || "placeholder:red", { isAbsolute: s2, isSpecial: r2 } = f(e2);
    return r2 ? e2 : s2 ? `media:${e2.slice(`${$.domain}/`.length)}` : e2.replace(P, `media:${$.path}`);
  };
  var ct = C;
  var $t = (t2) => t2 ? "string" == typeof t2 ? t2.split(";").reduce(((t3, e2) => {
    const [s2, r2] = e2.split(":").map(((t4) => t4 && t4.trim()));
    return s2 && r2 && (t3[s2] = r2), t3;
  }), {}) : t2 : {};
  var lt = C;
  var dt = (t2) => t2 && t2.trim();
  var ut = { true: "fade", false: "none", fade: "fade", zoom: "zoom", none: "none" };
  var ft = S;
  var ht = S;
  var pt = S;
  var mt = ({ x: t2, y: e2 }, s2, r2) => "contain" === s2 && (r2 || (e2 ? t2 ? `${e2} ${t2}` : e2 : t2));
  var gt = ({ anchor: { x: t2, y: e2 }, debug: s2, focus: r2, mode: n2, preTransform: i2, refit: o2 }) => {
    const a2 = e2 ? t2 ? `${e2}-${t2}` : e2 : t2, c2 = "contain" !== n2 && void 0 === o2 && (r2 || a2), $2 = ((t3, e3, s3) => void 0 !== s3 && `${"contain" === e3 ? "auto" : "WxH"}${s3 ? `(${s3})` : ""}${t3 && "contain" !== e3 ? `@${t3}` : ""}`)(a2, n2, o2);
    return `${s2 ? "/debug" : ""}${i2 ? `/${i2}` : ""}${c2 ? `/focus=${c2}` : ""}${$2 ? `/refit=${$2}` : ""}`;
  };
  var yt = (t2, e2, s2) => {
    const r2 = {};
    return e2 && (r2.transitionDuration = e2), t2 && (r2.transitionDelay = t2), s2 && (r2.transitionTimingFunction = s2), r2;
  };
  var bt = (t2, e2, s2, r2, n2) => Object.assign(Object.assign(Object.assign(Object.assign({}, "img" === r2 && { alt: t2 || "" }), ("img" === r2 || "video" === r2) && { crossOrigin: e2 }), "img" === r2 && { decoding: s2 }), "img" === r2 && { referrerPolicy: n2 });
  var vt = { img: "objectPosition", video: "objectPosition" };
  var xt = { img: "objectFit", video: "objectFit" };
  var wt = (t2, e2, s2) => {
    const r2 = ["twic-w"];
    return t2 && r2.push(t2), s2.hasOwnProperty("none") || (s2.hasOwnProperty("fade") && r2.push("twic-tf"), s2.hasOwnProperty("zoom") && r2.push("twic-tz")), "offline" === $.env && (r2.push("twic-offline"), e2 || r2.push("twic-nosrc")), r2.join(" ");
  };
  var Ot = [["anticipation", "anticipation"], ["class", "class"], ["maxDPR", "max-dpr"], ["step", "step"]];
  var kt = (e2) => {
    ((t2) => {
      t2 || i("install options not provided");
      const { domain: e3, env: s3, path: r2 } = t2;
      e3 && y.test(e3) || i(`install domain "${e3}" is invalid`), r2 && g.test(r2) && i(`install path "${r2}" is invalid`), s3 && !b.test(s3) && i(`install env "${s3}" is invalid`);
    })(e2);
    const { domain: s2, env: n2, path: o2 } = e2;
    ((e3) => {
      const { breakpoints: s3 = {}, debug: n3, domain: i2, class: o3, env: a2, handleShadowDom: c2, maxDPR: u2, path: f2 } = e3;
      $.breakpoints = Object.assign(Object.assign({}, $.breakpoints), s3), $.class = o3 || $.class, $.domain = i2, $.env = n3 ? "debug" : a2, $.maxDPR = Math.max(1, u2 || 2), $.path = f2, $.handleShadowDom = c2 ? /* @__PURE__ */ ((e4) => {
        const s4 = /* @__PURE__ */ new WeakSet();
        return (r2) => {
          for (; r2 && !s4.has(r2); ) {
            s4.add(r2);
            const { parentNode: n4 } = r2;
            if (!n4 && r2 instanceof ShadowRoot) {
              if ("closed" === r2.mode) throw new Error("cannot use TwicPics components in closed ShadowRoot");
              t({ element: r2, value: { elementName: "style", value: `.twic-i{overflow:hidden}.twic-w,.twic-w *{border:none;margin:0;overflow:hidden;padding:0}.twic-w{overflow:hidden;position:relative;padding-top:100%;width:100%;padding-top:calc(100% / var(--twic-ratio,1))}.twic-w>*{display:block;height:100%;left:0;position:absolute;top:0;width:100%;transition-property:opacity,transform;will-change:opacity,transform;background-size:cover;background-position:center;background-repeat:no-repeat;object-fit:cover;object-position:center;transition-delay:0s;transition-duration:.4s;transition-timing-function:ease;object-fit:var(--twic-mode,cover);object-position:var(--twic-position,center);transition-delay:var(--twic-transition-delay,0s);transition-duration:var(--twic-transition-duration,400ms);transition-timing-function:var(--twic-transition-timing-function,ease)}.twic-w>div{background-repeat:no-repeat;background-size:cover;background-position:center;background-size:var(--twic-mode,cover);background-position:var(--twic-position,center);font-size:calc(1px / var(--twic-ratio,1))}.twic-w>img:not([src]),.twic-w>img[src=""]{visibility:hidden}.twic-w.twic-tz>img{transform:scale(0)}.twic-w.twic-tf>div{opacity:1}.twic-d{display:block}.twic-offline{background-color:#ccc}.twic-offline.twic-nosrc{background-color:#fd0016}.twic-offline>*{display:none}:root{--twic-zoom:0}.twic-z{position:relative}.twic-m{left:0;position:absolute;top:0;z-index:1}.twic-m>*{display:none;transition:none;width:calc(max(var(--twic-zoom),1) * 100%);height:calc(max(var(--twic-zoom),1) * 100%);transform:translate3d(calc((1 - max(var(--twic-zoom),1)) * var(--twic-xr,0) * 1px),calc((1 - max(var(--twic-zoom),1)) * var(--twic-yr,0) * 1px),0)}.twic-m:hover>*{display:block}.twic-m:hover+div,twicmedia:hover+twicmedia{opacity:0}.twic-p{border:none;margin:0;overflow:hidden;padding:0}.twic-p>img{display:block;object-fit:cover;object-position:center;width:100%;height:100%}${l()}` } }), (r2 = r2.host) && r2.setAttribute(e4, "");
            } else r2 = n4;
          }
        };
      })(d("component")) : r;
    })(Object.assign(Object.assign({}, e2), { domain: B(s2), env: Y(n2), path: K(o2) })), ((e3) => {
      {
        const s3 = [`${$.domain}/?v1`];
        Ot.forEach(((t2) => {
          const [r3, n4] = t2;
          e3.hasOwnProperty(r3) && e3[r3] && s3.push(`${n4}=${e3[r3]}`);
        }));
        const { scriptElementId: r2 } = e3;
        t({ element: document.head, value: [{ attributes: { rel: "preconnect", href: $.domain }, elementName: "link" }, { attributes: Object.assign(Object.assign({ async: "", defer: "" }, r2 && { id: r2 }), { src: s3.join("&") }), elementName: "script" }] });
        const n3 = t({ elementName: "style", value: l() });
        document.head.appendChild(n3), document.addEventListener("astro:after-swap", (() => document.head.appendChild(n3)));
      }
    })(e2);
  };
  var jt = (t2, e2) => {
    if (t2 < 0 || t2 > e2) return Math.min(Math.max(0, t2), e2);
    let s2 = 2 * t2 / e2;
    return s2 < 1 ? e2 / 2 * s2 ** 3 : (s2 -= 2, e2 / 2 * (s2 ** 3 + 2));
  };
  var Et = (t2) => {
    t2.preventDefault(), t2.stopPropagation();
    const e2 = t2.currentTarget, { left: s2, top: r2, right: n2, bottom: i2 } = e2.getBoundingClientRect(), { clientX: o2, clientY: a2 } = t2 instanceof MouseEvent ? t2 : t2.touches[0];
    e2.style.setProperty("--twic-xr", jt(o2 - s2, n2 - s2).toString()), e2.style.setProperty("--twic-yr", jt(a2 - r2, i2 - r2).toString());
  };
  var zt = /* @__PURE__ */ new WeakMap();
  var Pt = "undefined" != typeof MutationObserver && new MutationObserver(((t2) => {
    for (const { target: e2 } of t2) {
      const t3 = zt.get(e2);
      t3 && t3.handleState();
    }
  }));
  var St = "undefined" != typeof ResizeObserver && new ResizeObserver(((t2) => {
    for (const { target: e2 } of t2) {
      const t3 = zt.get(e2);
      t3 && t3.refreshBackground();
    }
  }));
  var Nt = new RegExp(`(?:\\s*)(?:${$.class}(?:-background)*-)(done|error|loading)`);
  var _t = class {
    constructor(t2 = void 0) {
      this.handleState = () => {
        if (this.stateHandler) {
          let t3 = "new";
          const { className: e2 } = this.media, s2 = Nt.exec(e2);
          s2 && ([, t3] = s2), this.stateHandler(t3);
        }
      }, this.refreshBackground = ((t3) => {
        let e2;
        const s2 = Object.assign({ leading: true, ms: 0, trailing: true }, { ms: 100 });
        return (...r2) => {
          !e2 && s2.leading && t3(...r2), clearTimeout(e2), e2 = setTimeout((() => {
            e2 = void 0, s2.trailing && t3(...r2);
          }), s2.ms);
        };
      })((() => {
        if (this.media && this.placeholderData) {
          const t3 = this.media.nextElementSibling, e2 = ((t4, { anchor: e3, focus: r2, mode: n2, placeholder: i2, preTransform: o2, src: a2, ratio: c2, refit: l2, transitions: d2, videoOptions: u2 }) => {
            if (!$.domain || !t4 || !i2 || d2.hasOwnProperty("zoom")) return "";
            const f2 = getComputedStyle(t4), m2 = n2 || Z(f2.backgroundSize) || "cover";
            let g2;
            g2 = 0 === c2 ? "contain" === m2 ? 1 : s(f2.height) / Math.max(1, s(f2.width)) : null != c2 ? c2 : s(f2.fontSize);
            let y2 = 1e3, b2 = 1e3;
            g2 < 1 ? y2 *= g2 : b2 /= g2;
            const { videoTransform: v2 } = u2 || {}, x2 = `${gt({ anchor: e3, focus: r2, mode: n2, preTransform: o2, refit: l2 })}${v2 || ""}${p(m2, l2) || ""}`;
            return h({ context: { height: Math.max(1, Math.round(y2)), mode: m2, width: Math.max(1, Math.round(b2)) }, transform: x2, src: a2, output: i2 });
          })(t3, this.placeholderData);
          e2 && e2 !== this.savedWrapperBackground && (this.savedWrapperBackground = e2, t3.style.backgroundImage = `url(${JSON.stringify(e2)})`);
        }
      })), this.setMedia = (t3) => {
        t3 && ($.handleShadowDom(t3), this.media = t3, zt.set(this.media, this), Pt && (Pt.observe(this.media, { attributes: true, attributeFilter: ["class"] }), this.handleState()), St && St.observe(this.media));
      }, this.setPlaceholderData = (t3) => {
        this.placeholderData = t3, this.media && this.refreshBackground();
      }, this.destroy = () => {
        this.media && this.media && St && St.unobserve(this.media);
      }, this.stateHandler = t2;
    }
  };
  function Tt() {
  }
  function At(t2, e2) {
    for (const s2 in e2) t2[s2] = e2[s2];
    return t2;
  }
  function Mt(t2) {
    return t2();
  }
  function Ct() {
    return /* @__PURE__ */ Object.create(null);
  }
  function Dt(t2) {
    t2.forEach(Mt);
  }
  function Ft(t2) {
    return "function" == typeof t2;
  }
  function Rt(t2, e2) {
    return t2 != t2 ? e2 == e2 : t2 !== e2 || t2 && "object" == typeof t2 || "function" == typeof t2;
  }
  function Lt(t2) {
    const e2 = {};
    for (const s2 in t2) "$" !== s2[0] && (e2[s2] = t2[s2]);
    return e2;
  }
  function Bt(t2, e2) {
    t2.appendChild(e2);
  }
  function Wt(t2, e2, s2) {
    t2.insertBefore(e2, s2 || null);
  }
  function qt(t2) {
    t2.parentNode && t2.parentNode.removeChild(t2);
  }
  function It(t2) {
    return document.createElement(t2);
  }
  function Yt(t2) {
    return document.createTextNode(t2);
  }
  function Jt() {
    return Yt(" ");
  }
  function Vt() {
    return Yt("");
  }
  function Xt(t2, e2, s2) {
    null == s2 ? t2.removeAttribute(e2) : t2.getAttribute(e2) !== s2 && t2.setAttribute(e2, s2);
  }
  var Zt = ["width", "height"];
  function Gt(t2, e2) {
    const s2 = Object.getOwnPropertyDescriptors(t2.__proto__);
    for (const r2 in e2) null == e2[r2] ? t2.removeAttribute(r2) : "style" === r2 ? t2.style.cssText = e2[r2] : "__value" === r2 ? t2.value = t2[r2] = e2[r2] : s2[r2] && s2[r2].set && -1 === Zt.indexOf(r2) ? t2[r2] = e2[r2] : Xt(t2, r2, e2[r2]);
  }
  function Kt(t2, e2) {
    Object.keys(e2).forEach(((s2) => {
      !(function(t3, e3, s3) {
        e3 in t3 ? t3[e3] = "boolean" == typeof t3[e3] && "" === s3 || s3 : Xt(t3, e3, s3);
      })(t2, s2, e2[s2]);
    }));
  }
  function Qt(t2) {
    return /-/.test(t2) ? Kt : Gt;
  }
  function Ut(t2) {
    const e2 = {};
    for (const s2 of t2) e2[s2.name] = s2.value;
    return e2;
  }
  var te;
  function ee(t2) {
    te = t2;
  }
  function se() {
    if (!te) throw new Error("Function called outside component initialization");
    return te;
  }
  function re(t2) {
    se().$$.on_mount.push(t2);
  }
  function ne(t2, e2) {
    const s2 = t2.$$.callbacks[e2.type];
    s2 && s2.slice().forEach(((t3) => t3.call(this, e2)));
  }
  var ie = [];
  var oe = [];
  var ae = [];
  var ce = [];
  var $e = Promise.resolve();
  var le = false;
  function de(t2) {
    ae.push(t2);
  }
  function ue(t2) {
    ce.push(t2);
  }
  var fe = /* @__PURE__ */ new Set();
  var he = 0;
  function pe() {
    if (0 !== he) return;
    const t2 = te;
    do {
      try {
        for (; he < ie.length; ) {
          const t3 = ie[he];
          he++, ee(t3), me(t3.$$);
        }
      } catch (t3) {
        throw ie.length = 0, he = 0, t3;
      }
      for (ee(null), ie.length = 0, he = 0; oe.length; ) oe.pop()();
      for (let t3 = 0; t3 < ae.length; t3 += 1) {
        const e2 = ae[t3];
        fe.has(e2) || (fe.add(e2), e2());
      }
      ae.length = 0;
    } while (ie.length);
    for (; ce.length; ) ce.pop()();
    le = false, fe.clear(), ee(t2);
  }
  function me(t2) {
    if (null !== t2.fragment) {
      t2.update(), Dt(t2.before_update);
      const e2 = t2.dirty;
      t2.dirty = [-1], t2.fragment && t2.fragment.p(t2.ctx, e2), t2.after_update.forEach(de);
    }
  }
  var ge = /* @__PURE__ */ new Set();
  var ye;
  var be;
  function ve() {
    ye = { r: 0, c: [], p: ye };
  }
  function xe() {
    ye.r || Dt(ye.c), ye = ye.p;
  }
  function we(t2, e2) {
    t2 && t2.i && (ge.delete(t2), t2.i(e2));
  }
  function Oe(t2, e2, s2, r2) {
    if (t2 && t2.o) {
      if (ge.has(t2)) return;
      ge.add(t2), ye.c.push((() => {
        ge.delete(t2), r2 && (s2 && t2.d(1), r2());
      })), t2.o(e2);
    } else r2 && r2();
  }
  function ke(t2, e2) {
    const s2 = {}, r2 = {}, n2 = { $$scope: 1 };
    let i2 = t2.length;
    for (; i2--; ) {
      const o2 = t2[i2], a2 = e2[i2];
      if (a2) {
        for (const t3 in o2) t3 in a2 || (r2[t3] = 1);
        for (const t3 in a2) n2[t3] || (s2[t3] = a2[t3], n2[t3] = 1);
        t2[i2] = a2;
      } else for (const t3 in o2) n2[t3] = 1;
    }
    for (const t3 in r2) t3 in s2 || (s2[t3] = void 0);
    return s2;
  }
  function je(t2) {
    return "object" == typeof t2 && null !== t2 ? t2 : {};
  }
  function Ee(t2, e2, s2) {
    const r2 = t2.$$.props[e2];
    void 0 !== r2 && (t2.$$.bound[r2] = s2, s2(t2.$$.ctx[r2]));
  }
  function ze(t2) {
    t2 && t2.c();
  }
  function Pe(t2, e2, s2, r2) {
    const { fragment: n2, after_update: i2 } = t2.$$;
    n2 && n2.m(e2, s2), r2 || de((() => {
      const e3 = t2.$$.on_mount.map(Mt).filter(Ft);
      t2.$$.on_destroy ? t2.$$.on_destroy.push(...e3) : Dt(e3), t2.$$.on_mount = [];
    })), i2.forEach(de);
  }
  function Se(t2, e2) {
    const s2 = t2.$$;
    null !== s2.fragment && ((function(t3) {
      const e3 = [], s3 = [];
      ae.forEach(((r2) => -1 === t3.indexOf(r2) ? e3.push(r2) : s3.push(r2))), s3.forEach(((t4) => t4())), ae = e3;
    })(s2.after_update), Dt(s2.on_destroy), s2.fragment && s2.fragment.d(e2), s2.on_destroy = s2.fragment = null, s2.ctx = []);
  }
  function Ne(t2, e2, s2, r2, n2, i2, o2, a2 = [-1]) {
    const c2 = te;
    ee(t2);
    const $2 = t2.$$ = { fragment: null, ctx: [], props: i2, update: Tt, not_equal: n2, bound: Ct(), on_mount: [], on_destroy: [], on_disconnect: [], before_update: [], after_update: [], context: new Map(e2.context || (c2 ? c2.$$.context : [])), callbacks: Ct(), dirty: a2, skip_bound: false, root: e2.target || c2.$$.root };
    o2 && o2($2.root);
    let l2 = false;
    if ($2.ctx = s2 ? s2(t2, e2.props || {}, ((e3, s3, ...r3) => {
      const i3 = r3.length ? r3[0] : s3;
      return $2.ctx && n2($2.ctx[e3], $2.ctx[e3] = i3) && (!$2.skip_bound && $2.bound[e3] && $2.bound[e3](i3), l2 && (function(t3, e4) {
        -1 === t3.$$.dirty[0] && (ie.push(t3), le || (le = true, $e.then(pe)), t3.$$.dirty.fill(0)), t3.$$.dirty[e4 / 31 | 0] |= 1 << e4 % 31;
      })(t2, e3)), s3;
    })) : [], $2.update(), l2 = true, Dt($2.before_update), $2.fragment = !!r2 && r2($2.ctx), e2.target) {
      if (e2.hydrate) {
        const t3 = (function(t4) {
          return Array.from(t4.childNodes);
        })(e2.target);
        $2.fragment && $2.fragment.l(t3), t3.forEach(qt);
      } else $2.fragment && $2.fragment.c();
      e2.intro && we(t2.$$.fragment), Pe(t2, e2.target, e2.anchor, e2.customElement), pe();
    }
    ee(c2);
  }
  "function" == typeof HTMLElement && (be = class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const { on_mount: t2 } = this.$$;
      this.$$.on_disconnect = t2.map(Mt).filter(Ft);
      for (const t3 in this.$$.slotted) this.appendChild(this.$$.slotted[t3]);
    }
    attributeChangedCallback(t2, e2, s2) {
      this[t2] = s2;
    }
    disconnectedCallback() {
      Dt(this.$$.on_disconnect);
    }
    $destroy() {
      Se(this, 1), this.$destroy = Tt;
    }
    $on(t2, e2) {
      if (!Ft(e2)) return Tt;
      const s2 = this.$$.callbacks[t2] || (this.$$.callbacks[t2] = []);
      return s2.push(e2), () => {
        const t3 = s2.indexOf(e2);
        -1 !== t3 && s2.splice(t3, 1);
      };
    }
    $set(t2) {
      var e2;
      this.$$set && (e2 = t2, 0 !== Object.keys(e2).length) && (this.$$.skip_bound = true, this.$$set(t2), this.$$.skip_bound = false);
    }
  });
  var _e = (t2) => {
    if (t2 && 0 !== Object.keys(t2).length) return Object.entries(t2).filter((([, t3]) => t3)).map((([t3, e2]) => `${t3.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${e2};`)).join("");
  };
  var Te = (t2) => {
    var { id: e2, class: s2, draggable: r2, role: n2, tabindex: i2 } = t2, o2 = (function(t3, e3) {
      var s3 = {};
      for (var r3 in t3) Object.prototype.hasOwnProperty.call(t3, r3) && e3.indexOf(r3) < 0 && (s3[r3] = t3[r3]);
      if (null != t3 && "function" == typeof Object.getOwnPropertySymbols) {
        var n3 = 0;
        for (r3 = Object.getOwnPropertySymbols(t3); n3 < r3.length; n3++) e3.indexOf(r3[n3]) < 0 && Object.prototype.propertyIsEnumerable.call(t3, r3[n3]) && (s3[r3[n3]] = t3[r3[n3]]);
      }
      return s3;
    })(t2, ["id", "class", "draggable", "role", "tabindex"]);
    return { hostProps: Object.assign(Object.assign({}, Object.fromEntries(Object.entries(o2).filter((([t3]) => t3.startsWith("aria-"))))), { id: e2, draggable: r2, role: it(n2), tabindex: i2 }), mediaProps: Object.assign({}, o2) };
  };
  function Ae(t2) {
    let e2, s2 = [{ style: t2[6] }, t2[9], t2[8]], r2 = {};
    for (let t3 = 0; t3 < s2.length; t3 += 1) r2 = At(r2, s2[t3]);
    return { c() {
      e2 = It(t2[1]), Qt(t2[1])(e2, r2);
    }, m(s3, r3) {
      Wt(s3, e2, r3), t2[55](e2);
    }, p(t3, n2) {
      Qt(t3[1])(e2, r2 = ke(s2, [64 & n2[0] && { style: t3[6] }, 512 & n2[0] && t3[9], 256 & n2[0] && t3[8]]));
    }, d(s3) {
      s3 && qt(e2), t2[55](null);
    } };
  }
  function Me(t2) {
    let e2;
    return { c() {
      e2 = It("div"), Xt(e2, "style", t2[7]);
    }, m(t3, s2) {
      Wt(t3, e2, s2);
    }, p(t3, s2) {
      128 & s2[0] && Xt(e2, "style", t3[7]);
    }, d(t3) {
      t3 && qt(e2);
    } };
  }
  function Ce(t2) {
    let e2, s2, r2, n2 = t2[1], i2 = t2[1] && Ae(t2), o2 = t2[4] && Me(t2);
    return { c() {
      e2 = It("div"), i2 && i2.c(), s2 = Jt(), o2 && o2.c(), this.c = Tt, Xt(e2, "class", r2 = wt(t2[11], t2[2], t2[3])), Xt(e2, "style", t2[5]), Xt(e2, "title", t2[10]);
    }, m(t3, r3) {
      Wt(t3, e2, r3), i2 && i2.m(e2, null), Bt(e2, s2), o2 && o2.m(e2, null);
    }, p(t3, a2) {
      t3[1] ? n2 ? Rt(n2, t3[1]) ? (i2.d(1), i2 = Ae(t3), n2 = t3[1], i2.c(), i2.m(e2, s2)) : i2.p(t3, a2) : (i2 = Ae(t3), n2 = t3[1], i2.c(), i2.m(e2, s2)) : n2 && (i2.d(1), i2 = null, n2 = t3[1]), t3[4] ? o2 ? o2.p(t3, a2) : (o2 = Me(t3), o2.c(), o2.m(e2, null)) : o2 && (o2.d(1), o2 = null), 2060 & a2[0] && r2 !== (r2 = wt(t3[11], t3[2], t3[3])) && Xt(e2, "class", r2), 32 & a2[0] && Xt(e2, "style", t3[5]), 1024 & a2[0] && Xt(e2, "title", t3[10]);
    }, i: Tt, o: Tt, d(t3) {
      t3 && qt(e2), i2 && i2.d(t3), o2 && o2.d();
    } };
  }
  function De(t2, e2, s2) {
    let r2, n2, i2, o2, a2, c2, l2, u2, h2, m2, g2, y2, b2, v2, w2, k2, j2, E2, z2, P2, N2, _2, T2, A2, M2, C2, D2, R2, { alt: B2 } = e2, { anchor: W2 } = e2, { bot: I2 } = e2, { class: Y2 } = e2, { crossorigin: V2 } = e2, { decoding: X2 } = e2, { focus: G2 } = e2, { intrinsic: K2 } = e2, { media: U2 } = e2, { mediatag: et2 = "img" } = e2, { mode: rt2 } = e2, { eager: it2 = false } = e2, { placeholder: ot2 } = e2, { position: $t2 } = e2, { pretransform: lt2 } = e2, { ratio: wt2 } = e2, { referrerpolicy: Ot2 } = e2, { refit: kt2 } = e2, { src: jt2 } = e2, { step: Et2 } = e2, { state: zt2 } = e2, { title: Pt2 } = e2, { transition: St2 } = e2, { transitiondelay: Nt2 } = e2, { transitionduration: Tt2 } = e2, { transitiontimingfunction: At2 } = e2, { videoOptions: Mt2 } = e2;
    const Ct2 = new _t(((t3) => {
      s2(12, zt2 = t3);
    })), Dt2 = (function() {
      const t3 = se();
      return (e3, s3, { cancelable: r3 = false } = {}) => {
        const n3 = t3.$$.callbacks[e3];
        if (n3) {
          const i3 = (function(t4, e4, { bubbles: s4 = false, cancelable: r4 = false } = {}) {
            const n4 = document.createEvent("CustomEvent");
            return n4.initCustomEvent(t4, s4, r4, e4), n4;
          })(e3, s3, { cancelable: r3 });
          return n3.slice().forEach(((e4) => {
            e4.call(t3, i3);
          })), !i3.defaultPrevented;
        }
        return true;
      };
    })();
    var Ft2;
    return re((() => {
      Ct2.setMedia(U2);
    })), Ft2 = () => {
      Ct2.destroy();
    }, se().$$.on_destroy.push(Ft2), t2.$$set = (t3) => {
      "alt" in t3 && s2(13, B2 = t3.alt), "anchor" in t3 && s2(14, W2 = t3.anchor), "bot" in t3 && s2(15, I2 = t3.bot), "class" in t3 && s2(16, Y2 = t3.class), "crossorigin" in t3 && s2(17, V2 = t3.crossorigin), "decoding" in t3 && s2(18, X2 = t3.decoding), "focus" in t3 && s2(19, G2 = t3.focus), "intrinsic" in t3 && s2(20, K2 = t3.intrinsic), "media" in t3 && s2(0, U2 = t3.media), "mediatag" in t3 && s2(1, et2 = t3.mediatag), "mode" in t3 && s2(21, rt2 = t3.mode), "eager" in t3 && s2(22, it2 = t3.eager), "placeholder" in t3 && s2(23, ot2 = t3.placeholder), "position" in t3 && s2(24, $t2 = t3.position), "pretransform" in t3 && s2(25, lt2 = t3.pretransform), "ratio" in t3 && s2(26, wt2 = t3.ratio), "referrerpolicy" in t3 && s2(27, Ot2 = t3.referrerpolicy), "refit" in t3 && s2(28, kt2 = t3.refit), "src" in t3 && s2(2, jt2 = t3.src), "step" in t3 && s2(29, Et2 = t3.step), "state" in t3 && s2(12, zt2 = t3.state), "title" in t3 && s2(30, Pt2 = t3.title), "transition" in t3 && s2(31, St2 = t3.transition), "transitiondelay" in t3 && s2(32, Nt2 = t3.transitiondelay), "transitionduration" in t3 && s2(33, Tt2 = t3.transitionduration), "transitiontimingfunction" in t3 && s2(34, At2 = t3.transitiontimingfunction), "videoOptions" in t3 && s2(35, Mt2 = t3.videoOptions);
    }, t2.$$.update = () => {
      var e3;
      4096 & t2.$$.dirty[0] && Dt2("statechange", { state: zt2 }), 8192 & t2.$$.dirty[0] && s2(49, r2 = L(B2)), 16384 & t2.$$.dirty[0] && s2(43, n2 = F(W2)), 32768 & t2.$$.dirty[0] && s2(53, i2 = "string" == typeof (e3 = I2) ? e3.trim() : void 0), 65536 & t2.$$.dirty[0] && s2(11, o2 = H(Y2) || ""), 4194304 & t2.$$.dirty[0] && s2(52, a2 = q(it2)), 524288 & t2.$$.dirty[0] && s2(48, c2 = J(G2)), 1048576 & t2.$$.dirty[0] && s2(51, l2 = ((t3) => {
        if (!t3) return;
        let e4;
        const s3 = x.exec(t3);
        if (s3) {
          const [, , t4, r3] = s3;
          e4 = `${t4}x${r3}`;
        }
        return e4;
      })(K2)), 2 & t2.$$.dirty[0] && s2(42, u2 = ((t3) => {
        const e4 = S(t3);
        return e4 && e4.toLowerCase();
      })(et2)), 2097152 & t2.$$.dirty[0] && s2(41, h2 = Z(rt2)), 8388608 & t2.$$.dirty[0] && s2(54, m2 = ((t3) => {
        if ("offline" !== $.env && "none" !== t3) return O.test(t3) ? t3 : "preview";
      })(ot2)), 16777216 & t2.$$.dirty[0] && s2(40, g2 = Q($t2)), 33554432 & t2.$$.dirty[0] && s2(47, y2 = tt(lt2)), 67108864 & t2.$$.dirty[0] && s2(36, b2 = st(wt2)), 268435456 & t2.$$.dirty[0] && s2(46, v2 = nt(kt2)), 4 & t2.$$.dirty[0] && s2(45, w2 = at(jt2)), 536870912 & t2.$$.dirty[0] && s2(50, k2 = ct(Et2)), 1073741824 & t2.$$.dirty[0] && s2(10, j2 = dt(Pt2)), 1 & t2.$$.dirty[1] && s2(3, E2 = ((t3) => {
        "boolean" != typeof t3 && (t3 = S(t3) || true);
        const e4 = {};
        return String(t3).split(/\s*\+\s*|\s+/).forEach(((t4) => e4[`${ut[t4] || "fade"}`] = true)), e4;
      })(St2)), 2 & t2.$$.dirty[1] && s2(39, z2 = ft(Nt2)), 4 & t2.$$.dirty[1] && s2(38, P2 = ht(Tt2)), 8 & t2.$$.dirty[1] && s2(37, N2 = pt(At2)), 16 & t2.$$.dirty[1] && s2(44, _2 = Mt2), 8404992 & t2.$$.dirty[1] && s2(4, T2 = ((t3, e4) => f(e4).isSpecial ? void 0 : t3)(m2, w2)), 8125440 & t2.$$.dirty[1] && s2(9, A2 = ((t3, e4, s3, r3, n3, i3, o3, a3, c3, l3, u3, f2) => {
        const h3 = {}, { videoTransform: m3, posterTransform: g3 } = f2 || {}, y3 = gt({ anchor: t3, debug: "debug" === $.env, focus: r3, mode: o3, preTransform: a3, refit: c3 });
        return (y3 || m3) && (h3[d("transform")] = `${y3}${m3 || ""}${p(o3, c3) || ""}`), "string" == typeof e4 && (h3[d("bot")] = e4 || "/"), s3 && (h3[d("eager")] = ""), n3 && (h3[d("intrinsic")] = n3), l3 && ("img" === i3 || "video" === i3 ? h3[d("src")] = l3 : h3[d("background")] = `url(${l3})`), l3 && "video" === i3 && (h3[d("poster")] = l3, h3[d("poster-transform")] = `${y3}${g3 || ""}/*/output=image`), void 0 !== u3 && (h3[d("step")] = String(u3)), h3;
      })(n2, i2, a2, c2, l2, u2, h2, y2, v2, w2, k2, _2)), 134610944 & t2.$$.dirty[0] | 264192 & t2.$$.dirty[1] && s2(8, M2 = bt(r2, V2, X2, u2, Ot2)), 24 & t2.$$.dirty[0] | 260064 & t2.$$.dirty[1] && s2(7, C2 = _e(((t3, e4, s3, r3, n3, i3, o3, a3, c3, $2, l3, d2, u3, f2, h3) => {
        const p2 = yt(l3, d2, u3);
        h3({ anchor: t3, focus: e4, mode: s3, placeholder: r3, preTransform: i3, ratio: o3, refit: a3, src: c3, transitions: $2, videoOptions: f2 }), s3 && (p2.backgroundSize = s3);
        const m3 = mt(t3, s3, n3);
        return m3 && (p2.backgroundPosition = m3), p2;
      })(n2, c2, h2, T2, g2, y2, b2, v2, w2, E2, z2, P2, N2, _2, Ct2.setPlaceholderData))), 8128 & t2.$$.dirty[1] && s2(6, D2 = _e(((t3, e4, s3, r3, n3, i3, o3) => {
        const a3 = yt(n3, i3, o3), c3 = mt(t3, s3, r3);
        return c3 && (a3[vt[e4] || "backgroundPosition"] = c3), s3 && (a3[xt[e4] || "backgroundSize"] = s3), a3;
      })(n2, u2, h2, g2, z2, P2, N2))), 32 & t2.$$.dirty[1] && s2(5, R2 = _e(((t3) => 0 === t3 ? { height: "100%", paddingTop: "0" } : { paddingTop: void 0 === t3 ? "" : 100 * t3 + "%" })(b2)));
    }, [U2, et2, jt2, E2, T2, R2, D2, C2, M2, A2, j2, o2, zt2, B2, W2, I2, Y2, V2, X2, G2, K2, rt2, it2, ot2, $t2, lt2, wt2, Ot2, kt2, Et2, Pt2, St2, Nt2, Tt2, At2, Mt2, b2, N2, P2, z2, g2, h2, u2, n2, _2, w2, v2, y2, c2, r2, k2, l2, a2, i2, m2, function(t3) {
      oe[t3 ? "unshift" : "push"]((() => {
        U2 = t3, s2(0, U2);
      }));
    }];
  }
  var Fe = class extends be {
    constructor(t2) {
      super(), Ne(this, { target: this, props: Ut(this.attributes), customElement: true }, De, Ce, Rt, { alt: 13, anchor: 14, bot: 15, class: 16, crossorigin: 17, decoding: 18, focus: 19, intrinsic: 20, media: 0, mediatag: 1, mode: 21, eager: 22, placeholder: 23, position: 24, pretransform: 25, ratio: 26, referrerpolicy: 27, refit: 28, src: 2, step: 29, state: 12, title: 30, transition: 31, transitiondelay: 32, transitionduration: 33, transitiontimingfunction: 34, videoOptions: 35 }, null, [-1, -1]), t2 && (t2.target && Wt(t2.target, this, t2.anchor), t2.props && (this.$set(t2.props), pe()));
    }
    static get observedAttributes() {
      return ["alt", "anchor", "bot", "class", "crossorigin", "decoding", "focus", "intrinsic", "media", "mediatag", "mode", "eager", "placeholder", "position", "pretransform", "ratio", "referrerpolicy", "refit", "src", "step", "state", "title", "transition", "transitiondelay", "transitionduration", "transitiontimingfunction", "videoOptions"];
    }
    get alt() {
      return this.$$.ctx[13];
    }
    set alt(t2) {
      this.$$set({ alt: t2 }), pe();
    }
    get anchor() {
      return this.$$.ctx[14];
    }
    set anchor(t2) {
      this.$$set({ anchor: t2 }), pe();
    }
    get bot() {
      return this.$$.ctx[15];
    }
    set bot(t2) {
      this.$$set({ bot: t2 }), pe();
    }
    get class() {
      return this.$$.ctx[16];
    }
    set class(t2) {
      this.$$set({ class: t2 }), pe();
    }
    get crossorigin() {
      return this.$$.ctx[17];
    }
    set crossorigin(t2) {
      this.$$set({ crossorigin: t2 }), pe();
    }
    get decoding() {
      return this.$$.ctx[18];
    }
    set decoding(t2) {
      this.$$set({ decoding: t2 }), pe();
    }
    get focus() {
      return this.$$.ctx[19];
    }
    set focus(t2) {
      this.$$set({ focus: t2 }), pe();
    }
    get intrinsic() {
      return this.$$.ctx[20];
    }
    set intrinsic(t2) {
      this.$$set({ intrinsic: t2 }), pe();
    }
    get media() {
      return this.$$.ctx[0];
    }
    set media(t2) {
      this.$$set({ media: t2 }), pe();
    }
    get mediatag() {
      return this.$$.ctx[1];
    }
    set mediatag(t2) {
      this.$$set({ mediatag: t2 }), pe();
    }
    get mode() {
      return this.$$.ctx[21];
    }
    set mode(t2) {
      this.$$set({ mode: t2 }), pe();
    }
    get eager() {
      return this.$$.ctx[22];
    }
    set eager(t2) {
      this.$$set({ eager: t2 }), pe();
    }
    get placeholder() {
      return this.$$.ctx[23];
    }
    set placeholder(t2) {
      this.$$set({ placeholder: t2 }), pe();
    }
    get position() {
      return this.$$.ctx[24];
    }
    set position(t2) {
      this.$$set({ position: t2 }), pe();
    }
    get pretransform() {
      return this.$$.ctx[25];
    }
    set pretransform(t2) {
      this.$$set({ pretransform: t2 }), pe();
    }
    get ratio() {
      return this.$$.ctx[26];
    }
    set ratio(t2) {
      this.$$set({ ratio: t2 }), pe();
    }
    get referrerpolicy() {
      return this.$$.ctx[27];
    }
    set referrerpolicy(t2) {
      this.$$set({ referrerpolicy: t2 }), pe();
    }
    get refit() {
      return this.$$.ctx[28];
    }
    set refit(t2) {
      this.$$set({ refit: t2 }), pe();
    }
    get src() {
      return this.$$.ctx[2];
    }
    set src(t2) {
      this.$$set({ src: t2 }), pe();
    }
    get step() {
      return this.$$.ctx[29];
    }
    set step(t2) {
      this.$$set({ step: t2 }), pe();
    }
    get state() {
      return this.$$.ctx[12];
    }
    set state(t2) {
      this.$$set({ state: t2 }), pe();
    }
    get title() {
      return this.$$.ctx[30];
    }
    set title(t2) {
      this.$$set({ title: t2 }), pe();
    }
    get transition() {
      return this.$$.ctx[31];
    }
    set transition(t2) {
      this.$$set({ transition: t2 }), pe();
    }
    get transitiondelay() {
      return this.$$.ctx[32];
    }
    set transitiondelay(t2) {
      this.$$set({ transitiondelay: t2 }), pe();
    }
    get transitionduration() {
      return this.$$.ctx[33];
    }
    set transitionduration(t2) {
      this.$$set({ transitionduration: t2 }), pe();
    }
    get transitiontimingfunction() {
      return this.$$.ctx[34];
    }
    set transitiontimingfunction(t2) {
      this.$$set({ transitiontimingfunction: t2 }), pe();
    }
    get videoOptions() {
      return this.$$.ctx[35];
    }
    set videoOptions(t2) {
      this.$$set({ videoOptions: t2 }), pe();
    }
  };
  function We(t2) {
    let e2, s2, r2, n2, i2, o2, a2 = t2[3] && Ie(t2);
    const c2 = [t2[6], { mediatag: "img" }];
    function $2(e3) {
      t2[13](e3);
    }
    let l2 = {};
    for (let t3 = 0; t3 < c2.length; t3 += 1) l2 = At(l2, c2[t3]);
    void 0 !== t2[0] && (l2.state = t2[0]), r2 = new Fe({ props: l2 }), oe.push((() => Ee(r2, "state", $2))), r2.$on("statechange", t2[14]);
    let d2 = [t2[2], { class: i2 = `twic-i ${t2[5]} ${t2[3] ? "twic-z" : ""}` }, { style: t2[4] }], u2 = {};
    for (let t3 = 0; t3 < d2.length; t3 += 1) u2 = At(u2, d2[t3]);
    return { c() {
      e2 = It("div"), a2 && a2.c(), s2 = Jt(), ze(r2.$$.fragment), Gt(e2, u2);
    }, m(n3, i3) {
      Wt(n3, e2, i3), a2 && a2.m(e2, null), Bt(e2, s2), Pe(r2, e2, null), t2[15](e2), o2 = true;
    }, p(t3, $3) {
      t3[3] ? a2 ? (a2.p(t3, $3), 8 & $3 && we(a2, 1)) : (a2 = Ie(t3), a2.c(), we(a2, 1), a2.m(e2, s2)) : a2 && (ve(), Oe(a2, 1, 1, (() => {
        a2 = null;
      })), xe());
      const l3 = 64 & $3 ? ke(c2, [je(t3[6]), c2[1]]) : {};
      !n2 && 1 & $3 && (n2 = true, l3.state = t3[0], ue((() => n2 = false))), r2.$set(l3), Gt(e2, u2 = ke(d2, [4 & $3 && t3[2], (!o2 || 40 & $3 && i2 !== (i2 = `twic-i ${t3[5]} ${t3[3] ? "twic-z" : ""}`)) && { class: i2 }, (!o2 || 16 & $3) && { style: t3[4] }]));
    }, i(t3) {
      o2 || (we(a2), we(r2.$$.fragment, t3), o2 = true);
    }, o(t3) {
      Oe(a2), Oe(r2.$$.fragment, t3), o2 = false;
    }, d(s3) {
      s3 && qt(e2), a2 && a2.d(), Se(r2), t2[15](null);
    } };
  }
  function qe(t2) {
    let e2, s2, r2, n2, i2 = t2[3] && Ye(t2);
    const o2 = [t2[6], { mediatag: "img" }];
    function a2(e3) {
      t2[11](e3);
    }
    let c2 = {};
    for (let t3 = 0; t3 < o2.length; t3 += 1) c2 = At(c2, o2[t3]);
    return void 0 !== t2[0] && (c2.state = t2[0]), s2 = new Fe({ props: c2 }), oe.push((() => Ee(s2, "state", a2))), s2.$on("statechange", t2[12]), { c() {
      i2 && i2.c(), e2 = Jt(), ze(s2.$$.fragment);
    }, m(t3, r3) {
      i2 && i2.m(t3, r3), Wt(t3, e2, r3), Pe(s2, t3, r3), n2 = true;
    }, p(t3, n3) {
      t3[3] ? i2 ? (i2.p(t3, n3), 8 & n3 && we(i2, 1)) : (i2 = Ye(t3), i2.c(), we(i2, 1), i2.m(e2.parentNode, e2)) : i2 && (ve(), Oe(i2, 1, 1, (() => {
        i2 = null;
      })), xe());
      const a3 = 64 & n3 ? ke(o2, [je(t3[6]), o2[1]]) : {};
      !r2 && 1 & n3 && (r2 = true, a3.state = t3[0], ue((() => r2 = false))), s2.$set(a3);
    }, i(t3) {
      n2 || (we(i2), we(s2.$$.fragment, t3), n2 = true);
    }, o(t3) {
      Oe(i2), Oe(s2.$$.fragment, t3), n2 = false;
    }, d(t3) {
      i2 && i2.d(t3), t3 && qt(e2), Se(s2, t3);
    } };
  }
  function Ie(t2) {
    let e2, s2;
    const r2 = [t2[6], { class: "twic-m" }, { mediatag: "div" }, { mode: "cover" }];
    let n2 = {};
    for (let t3 = 0; t3 < r2.length; t3 += 1) n2 = At(n2, r2[t3]);
    return e2 = new Fe({ props: n2 }), { c() {
      ze(e2.$$.fragment);
    }, m(t3, r3) {
      Pe(e2, t3, r3), s2 = true;
    }, p(t3, s3) {
      const n3 = 64 & s3 ? ke(r2, [je(t3[6]), r2[1], r2[2], r2[3]]) : {};
      e2.$set(n3);
    }, i(t3) {
      s2 || (we(e2.$$.fragment, t3), s2 = true);
    }, o(t3) {
      Oe(e2.$$.fragment, t3), s2 = false;
    }, d(t3) {
      Se(e2, t3);
    } };
  }
  function Ye(t2) {
    let e2, s2;
    const r2 = [t2[6], { class: "twic-m" }, { mediatag: "div" }, { mode: "cover" }];
    let n2 = {};
    for (let t3 = 0; t3 < r2.length; t3 += 1) n2 = At(n2, r2[t3]);
    return e2 = new Fe({ props: n2 }), { c() {
      ze(e2.$$.fragment);
    }, m(t3, r3) {
      Pe(e2, t3, r3), s2 = true;
    }, p(t3, s3) {
      const n3 = 64 & s3 ? ke(r2, [je(t3[6]), r2[1], r2[2], r2[3]]) : {};
      e2.$set(n3);
    }, i(t3) {
      s2 || (we(e2.$$.fragment, t3), s2 = true);
    }, o(t3) {
      Oe(e2.$$.fragment, t3), s2 = false;
    }, d(t3) {
      Se(e2, t3);
    } };
  }
  function Je(t2) {
    let e2, s2, r2, n2;
    const i2 = [qe, We], o2 = [];
    return e2 = 0, s2 = o2[0] = i2[0](t2), { c() {
      s2.c(), r2 = Vt(), this.c = Tt;
    }, m(t3, e3) {
      o2[0].m(t3, e3), Wt(t3, r2, e3), n2 = true;
    }, p(t3, [e3]) {
      s2.p(t3, e3);
    }, i(t3) {
      n2 || (we(s2), n2 = true);
    }, o(t3) {
      Oe(s2), n2 = false;
    }, d(t3) {
      o2[0].d(t3), t3 && qt(r2);
    } };
  }
  function Ve(t2, e2, s2) {
    let r2, n2, i2, o2, a2, c2, $2, { class: l2 } = e2, { state: d2 } = e2, { style: u2 = {} } = e2, { zoom: f2 } = e2;
    return re((() => {
      i2 && ((t3) => {
        const e3 = t3.firstElementChild;
        e3.addEventListener("mousemove", ((t4) => Et(t4))), e3.addEventListener("touchmove", ((t4) => Et(t4)));
      })(a2);
    })), t2.$$set = (t3) => {
      s2(16, e2 = At(At({}, e2), Lt(t3))), "class" in t3 && s2(7, l2 = t3.class), "state" in t3 && s2(0, d2 = t3.state), "style" in t3 && s2(8, u2 = t3.style), "zoom" in t3 && s2(9, f2 = t3.zoom);
    }, t2.$$.update = () => {
      s2(2, { hostProps: c2, mediaProps: $2 } = Te(Object.assign({ role: "img" }, e2)), c2, (s2(6, $2), s2(16, e2))), 128 & t2.$$.dirty && s2(5, r2 = H(l2) || ""), 256 & t2.$$.dirty && s2(10, n2 = $t(u2)), 512 & t2.$$.dirty && s2(3, i2 = ((t3) => {
        if ("string" == typeof t3) {
          const e3 = E.exec(t3);
          if (e3 && e3[3]) return true;
          t3 = e3 && e3[2] ? Number(e3[2]) : void 0;
        }
        return z(t3) && t3 > 1 ? t3 : void 0;
      })(f2)), 1032 & t2.$$.dirty && s2(4, o2 = _e(Object.assign(Object.assign({}, ((t3) => {
        const e3 = {};
        return "boolean" != typeof t3 && t3 && (e3["--twic-zoom"] = `${t3}`), e3;
      })(i2)), n2))), 62 & t2.$$.dirty && (s2(1, a2 = se()), s2(1, a2.className = `${r2} ${i2 ? "twic-z" : ""} twic-d twic-i`, a2), s2(1, a2.role = c2.role, a2), o2 && a2.setAttribute("style", o2));
    }, e2 = Lt(e2), [d2, a2, c2, i2, o2, r2, $2, l2, u2, f2, n2, function(t3) {
      d2 = t3, s2(0, d2);
    }, function(e3) {
      ne.call(this, t2, e3);
    }, function(t3) {
      d2 = t3, s2(0, d2);
    }, function(e3) {
      ne.call(this, t2, e3);
    }, function(t3) {
      oe[t3 ? "unshift" : "push"]((() => {
        a2 = t3, s2(1, a2), s2(5, r2), s2(3, i2), s2(2, c2), s2(4, o2), s2(7, l2), s2(9, f2), s2(16, e2), s2(10, n2), s2(8, u2);
      }));
    }];
  }
  function Xe(t2, e2, s2) {
    const r2 = t2.slice();
    return r2[39] = e2[s2], r2;
  }
  function Ze(t2) {
    let e2, s2 = t2[3].sources, r2 = [];
    for (let e3 = 0; e3 < s2.length; e3 += 1) r2[e3] = Ge(Xe(t2, s2, e3));
    return { c() {
      for (let t3 = 0; t3 < r2.length; t3 += 1) r2[t3].c();
      e2 = Vt();
    }, m(t3, s3) {
      for (let e3 = 0; e3 < r2.length; e3 += 1) r2[e3] && r2[e3].m(t3, s3);
      Wt(t3, e2, s3);
    }, p(t3, n2) {
      if (8 & n2[0]) {
        let i2;
        for (s2 = t3[3].sources, i2 = 0; i2 < s2.length; i2 += 1) {
          const o2 = Xe(t3, s2, i2);
          r2[i2] ? r2[i2].p(o2, n2) : (r2[i2] = Ge(o2), r2[i2].c(), r2[i2].m(e2.parentNode, e2));
        }
        for (; i2 < r2.length; i2 += 1) r2[i2].d(1);
        r2.length = s2.length;
      }
    }, d(t3) {
      !(function(t4, e3) {
        for (let s3 = 0; s3 < t4.length; s3 += 1) t4[s3] && t4[s3].d(e3);
      })(r2, t3), t3 && qt(e2);
    } };
  }
  function Ge(t2) {
    let e2, s2 = [t2[39]], r2 = {};
    for (let t3 = 0; t3 < s2.length; t3 += 1) r2 = At(r2, s2[t3]);
    return { c() {
      e2 = It("source"), Gt(e2, r2);
    }, m(t3, s3) {
      Wt(t3, e2, s3);
    }, p(t3, n2) {
      Gt(e2, r2 = ke(s2, [8 & n2[0] && t3[39]]));
    }, d(t3) {
      t3 && qt(e2);
    } };
  }
  function Ke(t2) {
    let e2, s2 = (function(t3) {
      let e3, s3, r2, n2 = t3[3]?.sources && Ze(t3), i2 = [t3[3]?.img, t3[4]], o2 = {};
      for (let t4 = 0; t4 < i2.length; t4 += 1) o2 = At(o2, i2[t4]);
      return { c() {
        e3 = It("picture"), n2 && n2.c(), s3 = Jt(), r2 = It("img"), Gt(r2, o2), Xt(e3, "class", "twic-p"), Xt(e3, "title", t3[5]);
      }, m(t4, i3) {
        Wt(t4, e3, i3), n2 && n2.m(e3, null), Bt(e3, s3), Bt(e3, r2);
      }, p(t4, a2) {
        t4[3]?.sources ? n2 ? n2.p(t4, a2) : (n2 = Ze(t4), n2.c(), n2.m(e3, s3)) : n2 && (n2.d(1), n2 = null), Gt(r2, o2 = ke(i2, [8 & a2[0] && t4[3]?.img, 16 & a2[0] && t4[4]])), 32 & a2[0] && Xt(e3, "title", t4[5]);
      }, d(t4) {
        t4 && qt(e3), n2 && n2.d();
      } };
    })(t2);
    return { c() {
      s2.c(), e2 = Vt(), this.c = Tt;
    }, m(t3, r2) {
      s2.m(t3, r2), Wt(t3, e2, r2);
    }, p(t3, e3) {
      s2.p(t3, e3);
    }, i: Tt, o: Tt, d(t3) {
      s2.d(t3), t3 && qt(e2);
    } };
  }
  function Qe(t2, e2, s2) {
    let r2, n2, i2, o2, a2, c2, l2, d2, u2, f2, m2, g2, y2, b2, v2, x2, w2, O2, k2, j2, { alt: E2 } = e2, { anchor: z2 } = e2, { class: P2 } = e2, { crossorigin: S2 } = e2, { decoding: N2 } = e2, { eager: _2 = false } = e2, { fetchpriority: T2 } = e2, { focus: A2 } = e2, { mode: M2 } = e2, { position: C2 } = e2, { pretransform: D2 } = e2, { ratio: F2 } = e2, { referrerpolicy: B2 } = e2, { refit: W2 } = e2, { src: Y2 } = e2, { style: J2 = {} } = e2, { sizes: X2 } = e2, { title: Z2 } = e2;
    return t2.$$set = (t3) => {
      s2(38, e2 = At(At({}, e2), Lt(t3))), "alt" in t3 && s2(6, E2 = t3.alt), "anchor" in t3 && s2(7, z2 = t3.anchor), "class" in t3 && s2(8, P2 = t3.class), "crossorigin" in t3 && s2(9, S2 = t3.crossorigin), "decoding" in t3 && s2(10, N2 = t3.decoding), "eager" in t3 && s2(11, _2 = t3.eager), "fetchpriority" in t3 && s2(12, T2 = t3.fetchpriority), "focus" in t3 && s2(13, A2 = t3.focus), "mode" in t3 && s2(14, M2 = t3.mode), "position" in t3 && s2(15, C2 = t3.position), "pretransform" in t3 && s2(16, D2 = t3.pretransform), "ratio" in t3 && s2(17, F2 = t3.ratio), "referrerpolicy" in t3 && s2(18, B2 = t3.referrerpolicy), "refit" in t3 && s2(19, W2 = t3.refit), "src" in t3 && s2(20, Y2 = t3.src), "style" in t3 && s2(21, J2 = t3.style), "sizes" in t3 && s2(22, X2 = t3.sizes), "title" in t3 && s2(23, Z2 = t3.title);
    }, t2.$$.update = () => {
      64 & t2.$$.dirty[0] && s2(36, r2 = L(E2)), 128 & t2.$$.dirty[0] && s2(35, n2 = R(z2)), 256 & t2.$$.dirty[0] && s2(2, i2 = H(P2) || ""), 2048 & t2.$$.dirty[0] && s2(34, o2 = q(_2)), 4096 & t2.$$.dirty[0] && s2(33, a2 = I(T2)), 8192 & t2.$$.dirty[0] && s2(32, c2 = V(A2)), 16384 & t2.$$.dirty[0] && s2(31, l2 = G(M2)), 32768 & t2.$$.dirty[0] && s2(30, d2 = U(C2)), 65536 & t2.$$.dirty[0] && s2(29, u2 = et(D2)), 131072 & t2.$$.dirty[0] && s2(28, f2 = rt(F2)), 524288 & t2.$$.dirty[0] && s2(27, m2 = nt(W2)), 4194304 & t2.$$.dirty[0] && s2(26, g2 = ot(X2)), 1048576 & t2.$$.dirty[0] && s2(25, y2 = at(Y2)), 2097152 & t2.$$.dirty[0] && s2(37, b2 = $t(J2)), 8388608 & t2.$$.dirty[0] && s2(5, v2 = dt(Z2)), s2(0, { hostProps: j2 } = Te(Object.assign({ role: "img" }, e2)), j2), 64 & t2.$$.dirty[1] && s2(1, x2 = _e(b2)), 16777223 & t2.$$.dirty[0] && (s2(24, k2 = se()), s2(24, k2.className = `${i2} twic-d twic-i`, k2), s2(24, k2.role = j2.role, k2), x2 && k2.setAttribute("style", x2)), 263680 & t2.$$.dirty[0] | 32 & t2.$$.dirty[1] && s2(4, w2 = bt(r2, S2, N2, "img", B2)), 2113929216 & t2.$$.dirty[0] | 31 & t2.$$.dirty[1] && s2(3, O2 = ((t3, e3, s3, r3, n3, i3, o3, a3, c3, l3, d3) => {
        if (!$.domain) return;
        const u3 = ((t4, e4, s4, r4, n4, i4, o4) => {
          var a4;
          const c4 = /* @__PURE__ */ new Set([...Object.keys(t4).map(Number), ...Object.keys(e4).map(Number), ...Object.keys(s4).map(Number), ...Object.keys(r4).map(Number), ...Object.keys(n4).map(Number), ...Object.keys(i4).map(Number), ...Object.keys(o4).map(Number)]), l4 = [.../* @__PURE__ */ new Set([...Object.values($.breakpoints), ...Array.from(c4).filter(((t5) => t5 > 0))])].sort(((t5, e5) => t5 - e5)), d4 = Array.from(c4).sort(((t5, e5) => t5 - e5)).map(((a5) => ({ breakpoint: a5, anchor: t4[a5], focus: e4[a5], mode: s4[a5], position: r4[a5], preTransform: n4[a5], ratio: i4[a5], sizes: o4[a5] })));
          for (let t5 = 1; t5 < d4.length; t5++) {
            const e5 = d4[t5 - 1], s5 = d4[t5];
            for (const t6 of Object.keys(d4[0])) s5[t6] = null !== (a4 = s5[t6]) && void 0 !== a4 ? a4 : e5[t6];
          }
          return d4.map(((t5, e5) => {
            var s5, r5;
            const { anchor: n5, breakpoint: i5, focus: o5, mode: a5, position: c5, preTransform: $2, ratio: u4, sizes: f4 } = t5, h2 = null !== (r5 = null === (s5 = d4[e5 + 1]) || void 0 === s5 ? void 0 : s5.breakpoint) && void 0 !== r5 ? r5 : void 0, p2 = i5 || h2 || Math.max(...l4);
            return { anchor: n5, breakpoint: i5, focus: o5, media: `(min-width: ${i5}px)`, mode: a5, position: c5, preTransform: $2, ratio: u4, resolutions: l4.filter(((t6) => t6 >= i5 && (void 0 === h2 || t6 < h2 || 0 === i5 && t6 <= h2))), sizes: f4, width: p2, height: u4 ? `${Math.round(p2 * u4)}` : void 0 };
          })).sort(((t5, e5) => e5.breakpoint - t5.breakpoint));
        })(t3, r3, n3, i3, o3, a3, l3), f3 = u3.map(((t4, r4) => {
          const { anchor: n4, focus: i4, media: o4, mode: a4, position: l4, preTransform: f4, ratio: m3, resolutions: g3, sizes: y3, width: b3, height: v3 } = t4, x3 = "contain" === a4 ? "inside" : a4, w3 = mt(n4, a4, l4), O3 = `${gt({ anchor: n4, focus: i4, mode: a4, preTransform: f4, refit: c3 })}${p(a4, c3) || ""}${w3 ? `@${w3.replace(/(\s)/g, "-")}` : ""}`, k3 = /* @__PURE__ */ new Set();
          for (let t5 = 1; t5 <= $.maxDPR; t5++) g3.forEach(((e4) => k3.add(e4 * t5)));
          const j3 = /* @__PURE__ */ new Map();
          Array.from(k3).sort(((t5, e4) => e4 - t5)).forEach(((t5) => {
            j3.set(t5, h({ context: { height: m3 ? Math.round(t5 * m3) : void 0, mode: x3, width: t5 }, transform: O3, src: d3 }));
          }));
          const E3 = { height: v3, sizes: y3, width: `${b3}` };
          return E3.srcset = Array.from(j3, (([t5, e4]) => `${e4} ${t5}w`)).join(","), r4 === u3.length - 1 ? (E3.fetchPriority = e3 ? s3 || "high" : s3, E3.loading = e3 ? "eager" : "lazy", E3.src = j3.get(b3)) : E3.media = o4, E3;
        }));
        return { img: f3.pop(), sources: f3 };
      })(n2, o2, a2, c2, l2, d2, u2, f2, m2, g2, y2));
    }, e2 = Lt(e2), [j2, x2, i2, O2, w2, v2, E2, z2, P2, S2, N2, _2, T2, A2, M2, C2, D2, F2, B2, W2, Y2, J2, X2, Z2, k2, y2, g2, m2, f2, u2, d2, l2, c2, a2, o2, n2, r2, b2];
  }
  function Ue(t2) {
    let e2, s2, r2, n2, i2;
    const o2 = [{ mediatag: "video" }, t2[4], { videoOptions: t2[5] }];
    function a2(e3) {
      t2[20](e3);
    }
    let c2 = {};
    for (let t3 = 0; t3 < o2.length; t3 += 1) c2 = At(c2, o2[t3]);
    void 0 !== t2[0] && (c2.state = t2[0]), s2 = new Fe({ props: c2 }), oe.push((() => Ee(s2, "state", a2))), s2.$on("statechange", t2[21]);
    let $2 = [t2[3], { class: n2 = `twic-i ${t2[2]}` }, { style: t2[1] }], l2 = {};
    for (let t3 = 0; t3 < $2.length; t3 += 1) l2 = At(l2, $2[t3]);
    return { c() {
      e2 = It("div"), ze(s2.$$.fragment), Gt(e2, l2);
    }, m(t3, r3) {
      Wt(t3, e2, r3), Pe(s2, e2, null), i2 = true;
    }, p(t3, a3) {
      const c3 = 48 & a3 ? ke(o2, [o2[0], 16 & a3 && je(t3[4]), 32 & a3 && { videoOptions: t3[5] }]) : {};
      !r2 && 1 & a3 && (r2 = true, c3.state = t3[0], ue((() => r2 = false))), s2.$set(c3), Gt(e2, l2 = ke($2, [8 & a3 && t3[3], (!i2 || 4 & a3 && n2 !== (n2 = `twic-i ${t3[2]}`)) && { class: n2 }, (!i2 || 2 & a3) && { style: t3[1] }]));
    }, i(t3) {
      i2 || (we(s2.$$.fragment, t3), i2 = true);
    }, o(t3) {
      Oe(s2.$$.fragment, t3), i2 = false;
    }, d(t3) {
      t3 && qt(e2), Se(s2);
    } };
  }
  function ts(t2) {
    let e2, s2, r2;
    const n2 = [{ mediatag: "video" }, t2[4], { videoOptions: t2[5] }];
    function i2(e3) {
      t2[18](e3);
    }
    let o2 = {};
    for (let t3 = 0; t3 < n2.length; t3 += 1) o2 = At(o2, n2[t3]);
    return void 0 !== t2[0] && (o2.state = t2[0]), e2 = new Fe({ props: o2 }), oe.push((() => Ee(e2, "state", i2))), e2.$on("statechange", t2[19]), { c() {
      ze(e2.$$.fragment);
    }, m(t3, s3) {
      Pe(e2, t3, s3), r2 = true;
    }, p(t3, r3) {
      const i3 = 48 & r3 ? ke(n2, [n2[0], 16 & r3 && je(t3[4]), 32 & r3 && { videoOptions: t3[5] }]) : {};
      !s2 && 1 & r3 && (s2 = true, i3.state = t3[0], ue((() => s2 = false))), e2.$set(i3);
    }, i(t3) {
      r2 || (we(e2.$$.fragment, t3), r2 = true);
    }, o(t3) {
      Oe(e2.$$.fragment, t3), r2 = false;
    }, d(t3) {
      Se(e2, t3);
    } };
  }
  function es(t2) {
    let e2, s2, r2, n2;
    const i2 = [ts, Ue], o2 = [];
    return e2 = 0, s2 = o2[0] = i2[0](t2), { c() {
      s2.c(), r2 = Vt(), this.c = Tt;
    }, m(t3, e3) {
      o2[0].m(t3, e3), Wt(t3, r2, e3), n2 = true;
    }, p(t3, [e3]) {
      s2.p(t3, e3);
    }, i(t3) {
      n2 || (we(s2), n2 = true);
    }, o(t3) {
      Oe(s2), n2 = false;
    }, d(t3) {
      o2[0].d(t3), t3 && qt(r2);
    } };
  }
  function ss(t2, e2, s2) {
    let r2, n2, i2, o2, a2, c2, $2, l2, d2, u2, f2, { class: h2 } = e2, { duration: p2 } = e2, { from: m2 } = e2, { posterFrom: g2 } = e2, { state: y2 } = e2, { style: b2 = {} } = e2, { to: v2 } = e2;
    return t2.$$set = (t3) => {
      s2(22, e2 = At(At({}, e2), Lt(t3))), "class" in t3 && s2(6, h2 = t3.class), "duration" in t3 && s2(7, p2 = t3.duration), "from" in t3 && s2(8, m2 = t3.from), "posterFrom" in t3 && s2(9, g2 = t3.posterFrom), "state" in t3 && s2(0, y2 = t3.state), "style" in t3 && s2(10, b2 = t3.style), "to" in t3 && s2(11, v2 = t3.to);
    }, t2.$$.update = () => {
      s2(3, { hostProps: u2, mediaProps: f2 } = Te(e2), u2, (s2(4, f2), s2(22, e2))), 64 & t2.$$.dirty && s2(2, r2 = H(h2) || ""), 128 & t2.$$.dirty && s2(17, n2 = W(p2)), 256 & t2.$$.dirty && s2(16, i2 = X(m2)), 512 & t2.$$.dirty && s2(15, o2 = X(g2)), 1024 & t2.$$.dirty && s2(13, a2 = $t(b2)), 2048 & t2.$$.dirty && s2(14, c2 = lt(v2)), 245760 & t2.$$.dirty && s2(5, $2 = ((t3, e3, s3, r3) => ({ videoTransform: `${e3 ? `/from=${e3}` : ""}${r3 ? `/to=${r3}` : ""}${t3 ? `/duration=${t3}` : ""}`, posterTransform: s3 || e3 ? `/from=${void 0 === s3 ? e3 : s3}` : "" }))(n2, i2, o2, c2)), 8192 & t2.$$.dirty && s2(1, l2 = _e(a2)), 4102 & t2.$$.dirty && (s2(12, d2 = se()), s2(12, d2.className = `${r2} twic-d twic-i`, d2), l2 && d2.setAttribute("style", l2));
    }, e2 = Lt(e2), [y2, l2, r2, u2, f2, $2, h2, p2, m2, g2, b2, v2, d2, a2, c2, o2, i2, n2, function(t3) {
      y2 = t3, s2(0, y2);
    }, function(e3) {
      ne.call(this, t2, e3);
    }, function(t3) {
      y2 = t3, s2(0, y2);
    }, function(e3) {
      ne.call(this, t2, e3);
    }];
  }
  customElements.define("twic-media", Fe);
  var is = kt;
  var as = class extends be {
    constructor(t2) {
      super(), Ne(this, { target: this, props: Ut(this.attributes), customElement: true }, Ve, Je, Rt, { class: 7, state: 0, style: 8, zoom: 9 }, null), t2 && (t2.target && Wt(t2.target, this, t2.anchor), t2.props && (this.$set(t2.props), pe()));
    }
    static get observedAttributes() {
      return ["class", "state", "style", "zoom"];
    }
    get class() {
      return this.$$.ctx[7];
    }
    set class(t2) {
      this.$$set({ class: t2 }), pe();
    }
    get state() {
      return this.$$.ctx[0];
    }
    set state(t2) {
      this.$$set({ state: t2 }), pe();
    }
    get style() {
      return this.$$.ctx[8];
    }
    set style(t2) {
      this.$$set({ style: t2 }), pe();
    }
    get zoom() {
      return this.$$.ctx[9];
    }
    set zoom(t2) {
      this.$$set({ zoom: t2 }), pe();
    }
  };
  var cs = class extends be {
    constructor(t2) {
      super(), Ne(this, { target: this, props: Ut(this.attributes), customElement: true }, Qe, Ke, Rt, { alt: 6, anchor: 7, class: 8, crossorigin: 9, decoding: 10, eager: 11, fetchpriority: 12, focus: 13, mode: 14, position: 15, pretransform: 16, ratio: 17, referrerpolicy: 18, refit: 19, src: 20, style: 21, sizes: 22, title: 23 }, null, [-1, -1]), t2 && (t2.target && Wt(t2.target, this, t2.anchor), t2.props && (this.$set(t2.props), pe()));
    }
    static get observedAttributes() {
      return ["alt", "anchor", "class", "crossorigin", "decoding", "eager", "fetchpriority", "focus", "mode", "position", "pretransform", "ratio", "referrerpolicy", "refit", "src", "style", "sizes", "title"];
    }
    get alt() {
      return this.$$.ctx[6];
    }
    set alt(t2) {
      this.$$set({ alt: t2 }), pe();
    }
    get anchor() {
      return this.$$.ctx[7];
    }
    set anchor(t2) {
      this.$$set({ anchor: t2 }), pe();
    }
    get class() {
      return this.$$.ctx[8];
    }
    set class(t2) {
      this.$$set({ class: t2 }), pe();
    }
    get crossorigin() {
      return this.$$.ctx[9];
    }
    set crossorigin(t2) {
      this.$$set({ crossorigin: t2 }), pe();
    }
    get decoding() {
      return this.$$.ctx[10];
    }
    set decoding(t2) {
      this.$$set({ decoding: t2 }), pe();
    }
    get eager() {
      return this.$$.ctx[11];
    }
    set eager(t2) {
      this.$$set({ eager: t2 }), pe();
    }
    get fetchpriority() {
      return this.$$.ctx[12];
    }
    set fetchpriority(t2) {
      this.$$set({ fetchpriority: t2 }), pe();
    }
    get focus() {
      return this.$$.ctx[13];
    }
    set focus(t2) {
      this.$$set({ focus: t2 }), pe();
    }
    get mode() {
      return this.$$.ctx[14];
    }
    set mode(t2) {
      this.$$set({ mode: t2 }), pe();
    }
    get position() {
      return this.$$.ctx[15];
    }
    set position(t2) {
      this.$$set({ position: t2 }), pe();
    }
    get pretransform() {
      return this.$$.ctx[16];
    }
    set pretransform(t2) {
      this.$$set({ pretransform: t2 }), pe();
    }
    get ratio() {
      return this.$$.ctx[17];
    }
    set ratio(t2) {
      this.$$set({ ratio: t2 }), pe();
    }
    get referrerpolicy() {
      return this.$$.ctx[18];
    }
    set referrerpolicy(t2) {
      this.$$set({ referrerpolicy: t2 }), pe();
    }
    get refit() {
      return this.$$.ctx[19];
    }
    set refit(t2) {
      this.$$set({ refit: t2 }), pe();
    }
    get src() {
      return this.$$.ctx[20];
    }
    set src(t2) {
      this.$$set({ src: t2 }), pe();
    }
    get style() {
      return this.$$.ctx[21];
    }
    set style(t2) {
      this.$$set({ style: t2 }), pe();
    }
    get sizes() {
      return this.$$.ctx[22];
    }
    set sizes(t2) {
      this.$$set({ sizes: t2 }), pe();
    }
    get title() {
      return this.$$.ctx[23];
    }
    set title(t2) {
      this.$$set({ title: t2 }), pe();
    }
  };
  var $s = class extends be {
    constructor(t2) {
      super(), Ne(this, { target: this, props: Ut(this.attributes), customElement: true }, ss, es, Rt, { class: 6, duration: 7, from: 8, posterFrom: 9, state: 0, style: 10, to: 11 }, null), t2 && (t2.target && Wt(t2.target, this, t2.anchor), t2.props && (this.$set(t2.props), pe()));
    }
    static get observedAttributes() {
      return ["class", "duration", "from", "posterFrom", "state", "style", "to"];
    }
    get class() {
      return this.$$.ctx[6];
    }
    set class(t2) {
      this.$$set({ class: t2 }), pe();
    }
    get duration() {
      return this.$$.ctx[7];
    }
    set duration(t2) {
      this.$$set({ duration: t2 }), pe();
    }
    get from() {
      return this.$$.ctx[8];
    }
    set from(t2) {
      this.$$set({ from: t2 }), pe();
    }
    get posterFrom() {
      return this.$$.ctx[9];
    }
    set posterFrom(t2) {
      this.$$set({ posterFrom: t2 }), pe();
    }
    get state() {
      return this.$$.ctx[0];
    }
    set state(t2) {
      this.$$set({ state: t2 }), pe();
    }
    get style() {
      return this.$$.ctx[10];
    }
    set style(t2) {
      this.$$set({ style: t2 }), pe();
    }
    get to() {
      return this.$$.ctx[11];
    }
    set to(t2) {
      this.$$set({ to: t2 }), pe();
    }
  };

  // assets/custom.js
  is({
    "domain": "https://playlovetoys.twic.pics"
  });
  customElements.define("twic-img", as);
  customElements.define("twic-picture", cs);
  customElements.define("twic-video", $s);
  function safeLocalStorage() {
    try {
      if (window.self !== window.top) {
        console.warn("[Theme] Running in sandboxed environment - localStorage may not be available");
        return {
          getItem: function(key) {
            try {
              return localStorage.getItem(key);
            } catch (e2) {
              console.warn("[Theme] localStorage getItem failed:", e2.message);
              return null;
            }
          },
          setItem: function(key, value) {
            try {
              localStorage.setItem(key, value);
            } catch (e2) {
              console.warn("[Theme] localStorage setItem failed:", e2.message);
            }
          },
          removeItem: function(key) {
            try {
              localStorage.removeItem(key);
            } catch (e2) {
              console.warn("[Theme] localStorage removeItem failed:", e2.message);
            }
          },
          clear: function() {
            try {
              localStorage.clear();
            } catch (e2) {
              console.warn("[Theme] localStorage clear failed:", e2.message);
            }
          }
        };
      }
      return localStorage;
    } catch (e2) {
      console.warn("[Theme] localStorage not available:", e2.message);
      return {
        getItem: () => null,
        setItem: () => {
        },
        removeItem: () => {
        },
        clear: () => {
        }
      };
    }
  }
  var storage = safeLocalStorage();
  function handleCSPViolations() {
    if (window.self !== window.top) {
      console.warn("[Theme] Running in sandboxed environment - CSP violations may occur");
      window.addEventListener("error", function(event) {
        if (event.message && event.message.includes("Content Security Policy")) {
          console.warn("[Theme] CSP violation detected, continuing gracefully");
          event.preventDefault();
        }
      });
      window.addEventListener("unhandledrejection", function(event) {
        if (event.reason && event.reason.message && event.reason.message.includes("Content Security Policy")) {
          console.warn("[Theme] CSP violation in promise, continuing gracefully");
          event.preventDefault();
        }
      });
    }
  }
  handleCSPViolations();
  function handleTouchInterventions() {
    if (window.self !== window.top) {
      console.warn("[Theme] Running in sandboxed environment - touch interventions may occur");
      let isScrolling = false;
      document.addEventListener("touchstart", function() {
        isScrolling = false;
      }, { passive: true });
      document.addEventListener("touchmove", function(event) {
        isScrolling = true;
      }, { passive: true });
      document.addEventListener("touchend", function(event) {
        if (!isScrolling) {
        }
        isScrolling = false;
      }, { passive: true });
      const originalPreventDefault = Event.prototype.preventDefault;
      Event.prototype.preventDefault = function() {
        if (this.type === "touchmove" && isScrolling) {
          console.warn("[Theme] Prevented touchmove preventDefault during scroll");
          return;
        }
        return originalPreventDefault.apply(this, arguments);
      };
    }
  }
  handleTouchInterventions();
})();
