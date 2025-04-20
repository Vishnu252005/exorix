function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useState } from 'react';
import { useValue } from '../../internal/hooks/useValue.js';
import { useSwapBalances } from '../../swap/hooks/useSwapBalances.js';
const useBuyToken = (toToken, token, address) => {
  const _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    amount = _useState2[0],
    setAmount = _useState2[1];
  const _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    amountUSD = _useState4[0],
    setAmountUSD = _useState4[1];
  const _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    loading = _useState6[0],
    setLoading = _useState6[1];
  const _useSwapBalances = useSwapBalances({
      address,
      fromToken: token,
      toToken
    }),
    balance = _useSwapBalances.fromBalanceString,
    error = _useSwapBalances.fromTokenBalanceError,
    balanceResponse = _useSwapBalances.fromTokenResponse;
  return useValue({
    balance,
    balanceResponse,
    amount,
    setAmount,
    amountUSD,
    setAmountUSD,
    token,
    loading,
    setLoading,
    error
  });
};
export { useBuyToken };
//# sourceMappingURL=useBuyToken.js.map
