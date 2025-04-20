function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useLifecycleStatus } from '../../internal/hooks/useLifecycleStatus.js';
import { useEffect, useMemo } from 'react';
const useEmitLifecycleStatus = ({
  onError,
  onSuccess,
  onStatus
}) => {
  const _useLifecycleStatus = useLifecycleStatus({
      statusName: 'init',
      statusData: null
    }),
    _useLifecycleStatus2 = _slicedToArray(_useLifecycleStatus, 2),
    lifecycleStatus = _useLifecycleStatus2[0],
    updateLifecycleStatus = _useLifecycleStatus2[1];

  // Lifecycle emitters
  useEffect(() => {
    // Error
    if (lifecycleStatus.statusName === 'error') {
      onError?.(lifecycleStatus.statusData);
    }
    // Success
    if (lifecycleStatus.statusName === 'transactionSuccess') {
      onSuccess?.(lifecycleStatus.statusData);
    }
    // Emit Status
    onStatus?.(lifecycleStatus);
  }, [onError, onStatus, onSuccess, lifecycleStatus, lifecycleStatus.statusData, lifecycleStatus.statusName]);
  return useMemo(() => ({
    lifecycleStatus,
    updateLifecycleStatus
  }), [lifecycleStatus, updateLifecycleStatus]);
};
export { useEmitLifecycleStatus };
//# sourceMappingURL=useEmitLifecycleStatus.js.map
