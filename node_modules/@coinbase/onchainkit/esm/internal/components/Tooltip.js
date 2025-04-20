function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { infoSvg } from '../svg/infoSvg.js';
import { cn, border, background, text } from '../../styles/theme.js';
import { useState, useCallback } from 'react';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
function Tooltip({
  children = infoSvg,
  content
}) {
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isOverlayVisible = _useState2[0],
    setIsOverlayVisible = _useState2[1];
  const showOverlay = useCallback(() => {
    setIsOverlayVisible(true);
  }, []);
  const hideOverlay = useCallback(() => {
    setIsOverlayVisible(false);
  }, []);
  return /*#__PURE__*/jsxs(Fragment, {
    children: [/*#__PURE__*/jsx("div", {
      "data-testid": "ockBuyApplePayInfo",
      className: cn('h-2.5 w-2.5 cursor-pointer object-cover'),
      onMouseEnter: showOverlay,
      onMouseLeave: hideOverlay,
      children: children
    }), isOverlayVisible && /*#__PURE__*/jsx("div", {
      className: cn('absolute top-0 right-0 flex translate-x-[100%] translate-y-[-100%]', 'whitespace-nowrap p-2', border.radius, background.inverse, text.legal, border.lineDefault),
      children: content
    })]
  });
}
export { Tooltip };
//# sourceMappingURL=Tooltip.js.map
