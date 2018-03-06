! function (t) {
    "use strict";
    "function" == typeof define && define.amd ? define(t) : "undefined" != typeof module && void 0 !== module.exports ? module.exports = t() : "undefined" != typeof Package ? Sortable = t() : window.Sortable = t()
}(function () {
    "use strict";
    if ("undefined" == typeof window || !window.document) return function () {
        throw new Error("Sortable.js requires a window with a document")
    };
    var t, e, n, i, o, a, r, s, l, c, d, h, u, f, p, g, v, m, b, _, D = {},
        y = /\s+/g,
        w = "Sortable" + (new Date).getTime(),
        T = window,
        S = T.document,
        C = T.parseInt,
        E = T.jQuery || T.Zepto,
        x = T.Polymer,
        N = !!("draggable" in S.createElement("div")),
        k = !navigator.userAgent.match(/Trident.*rv[ :]?11\./) && ((_ = S.createElement("x")).style.cssText = "pointer-events:auto", "auto" === _.style.pointerEvents),
        B = !1,
        Y = Math.abs,
        X = Math.min,
        O = [],
        A = J(function (t, e, n) {
            if (n && e.scroll) {
                var i, o, a, c, d, h, u = n[w],
                    f = e.scrollSensitivity,
                    p = e.scrollSpeed,
                    g = t.clientX,
                    v = t.clientY,
                    m = window.innerWidth,
                    b = window.innerHeight;
                if (s !== n && (r = e.scroll, s = n, l = e.scrollFn, !0 === r)) {
                    r = n;
                    do {
                        if (r.offsetWidth < r.scrollWidth || r.offsetHeight < r.scrollHeight) break
                    } while (r = r.parentNode)
                }
                r && (i = r, o = r.getBoundingClientRect(), a = (Y(o.right - g) <= f) - (Y(o.left - g) <= f), c = (Y(o.bottom - v) <= f) - (Y(o.top - v) <= f)), a || c || (c = (b - v <= f) - (v <= f), ((a = (m - g <= f) - (g <= f)) || c) && (i = T)), D.vx === a && D.vy === c && D.el === i || (D.el = i, D.vx = a, D.vy = c, clearInterval(D.pid), i && (D.pid = setInterval(function () {
                    if (h = c ? c * p : 0, d = a ? a * p : 0, "function" == typeof l) return l.call(u, d, h, t);
                    i === T ? T.scrollTo(T.pageXOffset + d, T.pageYOffset + h) : (i.scrollTop += h, i.scrollLeft += d)
                }, 24)))
            }
        }, 30),
        R = function (t) {
            function e(t, e) {
                return void 0 !== t && !0 !== t || (t = n.name), "function" == typeof t ? t : function (n, i) {
                    var o = i.options.group.name;
                    return e ? t : t && (t.join ? t.indexOf(o) > -1 : o == t)
                }
            }
            var n = {},
                i = t.group;
            i && "object" == typeof i || (i = {
                name: i
            }), n.name = i.name, n.checkPull = e(i.pull, !0), n.checkPut = e(i.put), t.group = n
        };

    function I(t, e) {
        if (!t || !t.nodeType || 1 !== t.nodeType) throw "Sortable: `el` must be HTMLElement, and not " + {}.toString.call(t);
        this.el = t, this.options = e = K({}, e), t[w] = this;
        var n = {
            group: Math.random(),
            sort: !0,
            disabled: !1,
            store: null,
            handle: null,
            scroll: !0,
            scrollSensitivity: 30,
            scrollSpeed: 10,
            draggable: /[uo]l/i.test(t.nodeName) ? "li" : ">*",
            ghostClass: "sortable-ghost",
            chosenClass: "sortable-chosen",
            dragClass: "sortable-drag",
            ignore: "a, img",
            filter: null,
            animation: 0,
            setData: function (t, e) {
                t.setData("Text", e.textContent)
            },
            dropBubble: !1,
            dragoverBubble: !1,
            dataIdAttr: "data-id",
            delay: 0,
            forceFallback: !1,
            fallbackClass: "sortable-fallback",
            fallbackOnBody: !1,
            fallbackTolerance: 0,
            fallbackOffset: {
                x: 0,
                y: 0
            }
        };
        for (var i in n) !(i in e) && (e[i] = n[i]);
        R(e);
        for (var o in this) "_" === o.charAt(0) && "function" == typeof this[o] && (this[o] = this[o].bind(this));
        this.nativeDraggable = !e.forceFallback && N, L(t, "mousedown", this._onTapStart), L(t, "touchstart", this._onTapStart), L(t, "pointerdown", this._onTapStart), this.nativeDraggable && (L(t, "dragover", this), L(t, "dragenter", this)), O.push(this._onDragOver), e.store && this.sort(e.store.get(this))
    }

    function M(e) {
        i && i.state !== e && (W(i, "display", e ? "none" : ""), !e && i.state && o.insertBefore(i, t), i.state = e)
    }

    function P(t, e, n) {
        if (t) {
            n = n || S;
            do {
                if (">*" === e && t.parentNode === n || Z(t, e)) return t
            } while (void 0, t = (o = (i = t).host) && o.nodeType ? o : i.parentNode)
        }
        var i, o;
        return null
    }

    function L(t, e, n) {
        t.addEventListener(e, n, !1)
    }

    function U(t, e, n) {
        t.removeEventListener(e, n, !1)
    }

    function H(t, e, n) {
        if (t)
            if (t.classList) t.classList[n ? "add" : "remove"](e);
            else {
                var i = (" " + t.className + " ").replace(y, " ").replace(" " + e + " ", " ");
                t.className = (i + (n ? " " + e : "")).replace(y, " ")
            }
    }

    function W(t, e, n) {
        var i = t && t.style;
        if (i) {
            if (void 0 === n) return S.defaultView && S.defaultView.getComputedStyle ? n = S.defaultView.getComputedStyle(t, "") : t.currentStyle && (n = t.currentStyle), void 0 === e ? n : n[e];
            e in i || (e = "-webkit-" + e), i[e] = n + ("string" == typeof n ? "" : "px")
        }
    }

    function j(t, e, n) {
        if (t) {
            var i = t.getElementsByTagName(e),
                o = 0,
                a = i.length;
            if (n)
                for (; o < a; o++) n(i[o], o);
            return i
        }
        return []
    }

    function F(t, e, n, o, a, r, s) {
        t = t || e[w];
        var l = S.createEvent("Event"),
            c = t.options,
            d = "on" + n.charAt(0).toUpperCase() + n.substr(1);
        l.initEvent(n, !0, !0), l.to = e, l.from = a || e, l.item = o || e, l.clone = i, l.oldIndex = r, l.newIndex = s, e.dispatchEvent(l), c[d] && c[d].call(t, l)
    }

    function V(t, e, n, i, o, a, r) {
        var s, l, c = t[w],
            d = c.options.onMove;
        return (s = S.createEvent("Event")).initEvent("move", !0, !0), s.to = e, s.from = t, s.dragged = n, s.draggedRect = i, s.related = o || e, s.relatedRect = a || e.getBoundingClientRect(), t.dispatchEvent(s), d && (l = d.call(c, s, r)), l
    }

    function q(t) {
        t.draggable = !1
    }

    function z() {
        B = !1
    }

    function G(t) {
        for (var e = t.tagName + t.className + t.src + t.href + t.textContent, n = e.length, i = 0; n--;) i += e.charCodeAt(n);
        return i.toString(36)
    }

    function Q(t, e) {
        var n = 0;
        if (!t || !t.parentNode) return -1;
        for (; t && (t = t.previousElementSibling);) "TEMPLATE" === t.nodeName.toUpperCase() || ">*" !== e && !Z(t, e) || n++;
        return n
    }

    function Z(t, e) {
        if (t) {
            var n = (e = e.split(".")).shift().toUpperCase(),
                i = new RegExp("\\s(" + e.join("|") + ")(?=\\s)", "g");
            return !("" !== n && t.nodeName.toUpperCase() != n || e.length && ((" " + t.className + " ").match(i) || []).length != e.length)
        }
        return !1
    }

    function J(t, e) {
        var n, i;
        return function () {
            void 0 === n && (n = arguments, i = this, setTimeout(function () {
                1 === n.length ? t.call(i, n[0]) : t.apply(i, n), n = void 0
            }, e))
        }
    }

    function K(t, e) {
        if (t && e)
            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
        return t
    }

    function $(t) {
        return E ? E(t).clone(!0)[0] : x && x.dom ? x.dom(t).cloneNode(!0) : t.cloneNode(!0)
    }
    return I.prototype = {
        constructor: I,
        _onTapStart: function (e) {
            var n, i = this,
                o = this.el,
                a = this.options,
                r = e.type,
                s = e.touches && e.touches[0],
                l = (s || e).target,
                c = e.target.shadowRoot && e.path[0] || l,
                d = a.filter;
            if (!t && !("mousedown" === r && 0 !== e.button || a.disabled) && (!a.handle || P(c, a.handle, o)) && (l = P(l, a.draggable, o))) {
                if (n = Q(l, a.draggable), "function" == typeof d) {
                    if (d.call(this, e, l, this)) return F(i, c, "filter", l, o, n), void e.preventDefault()
                } else if (d && (d = d.split(",").some(function (t) {
                        if (t = P(c, t.trim(), o)) return F(i, t, "filter", l, o, n), !0
                    }))) return void e.preventDefault();
                this._prepareDragStart(e, s, l, n)
            }
        },
        _prepareDragStart: function (n, i, r, s) {
            var l, c = this,
                d = c.el,
                h = c.options,
                f = d.ownerDocument;
            r && !t && r.parentNode === d && (v = n, o = d, e = (t = r).parentNode, a = t.nextSibling, p = h.group, u = s, this._lastX = (i || n).clientX, this._lastY = (i || n).clientY, t.style["will-change"] = "transform", l = function () {
                c._disableDelayedDrag(), t.draggable = c.nativeDraggable, H(t, h.chosenClass, !0), c._triggerDragStart(n, i), F(c, o, "choose", t, o, u)
            }, h.ignore.split(",").forEach(function (e) {
                j(t, e.trim(), q)
            }), L(f, "mouseup", c._onDrop), L(f, "touchend", c._onDrop), L(f, "touchcancel", c._onDrop), L(f, "pointercancel", c._onDrop), h.delay ? (L(f, "mouseup", c._disableDelayedDrag), L(f, "touchend", c._disableDelayedDrag), L(f, "touchcancel", c._disableDelayedDrag), L(f, "mousemove", c._disableDelayedDrag), L(f, "touchmove", c._disableDelayedDrag), L(f, "pointermove", c._disableDelayedDrag), c._dragStartTimer = setTimeout(l, h.delay)) : l())
        },
        _disableDelayedDrag: function () {
            var t = this.el.ownerDocument;
            clearTimeout(this._dragStartTimer), U(t, "mouseup", this._disableDelayedDrag), U(t, "touchend", this._disableDelayedDrag), U(t, "touchcancel", this._disableDelayedDrag), U(t, "mousemove", this._disableDelayedDrag), U(t, "touchmove", this._disableDelayedDrag), U(t, "pointermove", this._disableDelayedDrag)
        },
        _triggerDragStart: function (e, n) {
            (n = n || ("touch" == e.pointerType ? e : null)) ? (v = {
                target: t,
                clientX: n.clientX,
                clientY: n.clientY
            }, this._onDragStart(v, "touch")) : this.nativeDraggable ? (L(t, "dragend", this), L(o, "dragstart", this._onDragStart)) : this._onDragStart(v, !0);
            try {
                S.selection ? setTimeout(function () {
                    S.selection.empty()
                }) : window.getSelection().removeAllRanges()
            } catch (t) {}
        },
        _dragStarted: function () {
            if (o && t) {
                var e = this.options;
                H(t, e.ghostClass, !0), H(t, e.dragClass, !1), I.active = this, F(this, o, "start", t, o, u)
            }
        },
        _emulateDragOver: function () {
            if (m) {
                if (this._lastX === m.clientX && this._lastY === m.clientY) return;
                this._lastX = m.clientX, this._lastY = m.clientY, k || W(n, "display", "none");
                var t = S.elementFromPoint(m.clientX, m.clientY),
                    e = t,
                    i = O.length;
                if (e)
                    do {
                        if (e[w]) {
                            for (; i--;) O[i]({
                                clientX: m.clientX,
                                clientY: m.clientY,
                                target: t,
                                rootEl: e
                            });
                            break
                        }
                        t = e
                    } while (e = e.parentNode);
                k || W(n, "display", "")
            }
        },
        _onTouchMove: function (t) {
            if (v) {
                var e = this.options,
                    i = e.fallbackTolerance,
                    o = e.fallbackOffset,
                    a = t.touches ? t.touches[0] : t,
                    r = a.clientX - v.clientX + o.x,
                    s = a.clientY - v.clientY + o.y,
                    l = t.touches ? "translate3d(" + r + "px," + s + "px,0)" : "translate(" + r + "px," + s + "px)";
                if (!I.active) {
                    if (i && X(Y(a.clientX - this._lastX), Y(a.clientY - this._lastY)) < i) return;
                    this._dragStarted()
                }
                this._appendGhost(), b = !0, m = a, W(n, "webkitTransform", l), W(n, "mozTransform", l), W(n, "msTransform", l), W(n, "transform", l), t.preventDefault()
            }
        },
        _appendGhost: function () {
            if (!n) {
                var e, i = t.getBoundingClientRect(),
                    a = W(t),
                    r = this.options;
                H(n = t.cloneNode(!0), r.ghostClass, !1), H(n, r.fallbackClass, !0), H(n, r.dragClass, !0), W(n, "top", i.top - C(a.marginTop, 10)), W(n, "left", i.left - C(a.marginLeft, 10)), W(n, "width", i.width), W(n, "height", i.height), W(n, "opacity", "0.8"), W(n, "position", "fixed"), W(n, "zIndex", "100000"), W(n, "pointerEvents", "none"), r.fallbackOnBody && S.body.appendChild(n) || o.appendChild(n), e = n.getBoundingClientRect(), W(n, "width", 2 * i.width - e.width), W(n, "height", 2 * i.height - e.height)
            }
        },
        _onDragStart: function (e, n) {
            var a = e.dataTransfer,
                r = this.options;
            this._offUpEvents(), "clone" == p.checkPull(this, this, t, e) && (W(i = $(t), "display", "none"), o.insertBefore(i, t), F(this, o, "clone", t)), H(t, r.dragClass, !0), n ? ("touch" === n ? (L(S, "touchmove", this._onTouchMove), L(S, "touchend", this._onDrop), L(S, "touchcancel", this._onDrop), L(S, "pointermove", this._onTouchMove), L(S, "pointerup", this._onDrop)) : (L(S, "mousemove", this._onTouchMove), L(S, "mouseup", this._onDrop)), this._loopId = setInterval(this._emulateDragOver, 50)) : (a && (a.effectAllowed = "move", r.setData && r.setData.call(this, a, t)), L(S, "drop", this), setTimeout(this._dragStarted, 0))
        },
        _onDragOver: function (r) {
            var s, l, u, f, v, m, _, D = this.el,
                y = this.options,
                T = y.group,
                S = I.active,
                C = p === T,
                E = y.sort;
            if (void 0 !== r.preventDefault && (r.preventDefault(), !y.dragoverBubble && r.stopPropagation()), b = !0, p && !y.disabled && (C ? E || (f = !o.contains(t)) : g === this || p.checkPull(this, S, t, r) && T.checkPut(this, S, t, r)) && (void 0 === r.rootEl || r.rootEl === this.el)) {
                if (A(r, y, this.el), B) return;
                if (s = P(r.target, y.draggable, D), l = t.getBoundingClientRect(), g = this, f) return M(!0), e = o, void(i || a ? o.insertBefore(t, i || a) : E || o.appendChild(t));
                if (0 === D.children.length || D.children[0] === n || D === r.target && (v = r, m = D.lastElementChild, _ = m.getBoundingClientRect(), s = (v.clientY - (_.top + _.height) > 5 || v.clientX - (_.right + _.width) > 5) && m)) {
                    if (s) {
                        if (s.animated) return;
                        u = s.getBoundingClientRect()
                    }
                    M(C), !1 !== V(o, D, t, l, s, u, r) && (t.contains(D) || (D.appendChild(t), e = D), this._animate(l, t), s && this._animate(u, s))
                } else if (s && !s.animated && s !== t && void 0 !== s.parentNode[w]) {
                    c !== s && (c = s, d = W(s), h = W(s.parentNode));
                    var x, N = (u = s.getBoundingClientRect()).right - u.left,
                        k = u.bottom - u.top,
                        Y = /left|right|inline/.test(d.cssFloat + d.display) || "flex" == h.display && 0 === h["flex-direction"].indexOf("row"),
                        X = s.offsetWidth > t.offsetWidth,
                        O = s.offsetHeight > t.offsetHeight,
                        R = (Y ? (r.clientX - u.left) / N : (r.clientY - u.top) / k) > .5,
                        L = s.nextElementSibling,
                        U = V(o, D, t, l, s, u, r);
                    if (!1 !== U) {
                        if (B = !0, setTimeout(z, 30), M(C), 1 === U || -1 === U) x = 1 === U;
                        else if (Y) {
                            var H = t.offsetTop,
                                j = s.offsetTop;
                            x = H === j ? s.previousElementSibling === t && !X || R && X : s.previousElementSibling === t || t.previousElementSibling === s ? (r.clientY - u.top) / k > .5 : j > H
                        } else x = L !== t && !O || R && O;
                        t.contains(D) || (x && !L ? D.appendChild(t) : s.parentNode.insertBefore(t, x ? L : s)), e = t.parentNode, this._animate(l, t), this._animate(u, s)
                    }
                }
            }
        },
        _animate: function (t, e) {
            var n = this.options.animation;
            if (n) {
                var i = e.getBoundingClientRect();
                W(e, "transition", "none"), W(e, "transform", "translate3d(" + (t.left - i.left) + "px," + (t.top - i.top) + "px,0)"), e.offsetWidth, W(e, "transition", "all " + n + "ms"), W(e, "transform", "translate3d(0,0,0)"), clearTimeout(e.animated), e.animated = setTimeout(function () {
                    W(e, "transition", ""), W(e, "transform", ""), e.animated = !1
                }, n)
            }
        },
        _offUpEvents: function () {
            var t = this.el.ownerDocument;
            U(S, "touchmove", this._onTouchMove), U(S, "pointermove", this._onTouchMove), U(t, "mouseup", this._onDrop), U(t, "touchend", this._onDrop), U(t, "pointerup", this._onDrop), U(t, "touchcancel", this._onDrop)
        },
        _onDrop: function (r) {
            var s = this.el,
                l = this.options;
            clearInterval(this._loopId), clearInterval(D.pid), clearTimeout(this._dragStartTimer), U(S, "mousemove", this._onTouchMove), this.nativeDraggable && (U(S, "drop", this), U(s, "dragstart", this._onDragStart)), this._offUpEvents(), r && (b && (r.preventDefault(), !l.dropBubble && r.stopPropagation()), n && n.parentNode.removeChild(n), t && (this.nativeDraggable && U(t, "dragend", this), q(t), t.style["will-change"] = "", H(t, this.options.ghostClass, !1), H(t, this.options.chosenClass, !1), o !== e ? (f = Q(t, l.draggable)) >= 0 && (F(null, e, "add", t, o, u, f), F(this, o, "remove", t, o, u, f), F(null, e, "sort", t, o, u, f), F(this, o, "sort", t, o, u, f)) : (i && i.parentNode.removeChild(i), t.nextSibling !== a && (f = Q(t, l.draggable)) >= 0 && (F(this, o, "update", t, o, u, f), F(this, o, "sort", t, o, u, f))), I.active && (null != f && -1 !== f || (f = u), F(this, o, "end", t, o, u, f), this.save()))), this._nulling()
        },
        _nulling: function () {
            o = t = e = n = a = i = r = s = v = m = b = f = c = d = g = p = I.active = null
        },
        handleEvent: function (e) {
            var n = e.type;
            "dragover" === n || "dragenter" === n ? t && (this._onDragOver(e), function (t) {
                t.dataTransfer && (t.dataTransfer.dropEffect = "move");
                t.preventDefault()
            }(e)) : "drop" !== n && "dragend" !== n || this._onDrop(e)
        },
        toArray: function () {
            for (var t, e = [], n = this.el.children, i = 0, o = n.length, a = this.options; i < o; i++) P(t = n[i], a.draggable, this.el) && e.push(t.getAttribute(a.dataIdAttr) || G(t));
            return e
        },
        sort: function (t) {
            var e = {},
                n = this.el;
            this.toArray().forEach(function (t, i) {
                var o = n.children[i];
                P(o, this.options.draggable, n) && (e[t] = o)
            }, this), t.forEach(function (t) {
                e[t] && (n.removeChild(e[t]), n.appendChild(e[t]))
            })
        },
        save: function () {
            var t = this.options.store;
            t && t.set(this)
        },
        closest: function (t, e) {
            return P(t, e || this.options.draggable, this.el)
        },
        option: function (t, e) {
            var n = this.options;
            if (void 0 === e) return n[t];
            n[t] = e, "group" === t && R(n)
        },
        destroy: function () {
            var t = this.el;
            t[w] = null, U(t, "mousedown", this._onTapStart), U(t, "touchstart", this._onTapStart), U(t, "pointerdown", this._onTapStart), this.nativeDraggable && (U(t, "dragover", this), U(t, "dragenter", this)), Array.prototype.forEach.call(t.querySelectorAll("[draggable]"), function (t) {
                t.removeAttribute("draggable")
            }), O.splice(O.indexOf(this._onDragOver), 1), this._onDrop(), this.el = t = null
        }
    }, I.utils = {
        on: L,
        off: U,
        css: W,
        find: j,
        is: function (t, e) {
            return !!P(t, e, t)
        },
        extend: K,
        throttle: J,
        closest: P,
        toggleClass: H,
        clone: $,
        index: Q
    }, I.create = function (t, e) {
        return new I(t, e)
    }, I.version = "1.5.0-rc1", I
});