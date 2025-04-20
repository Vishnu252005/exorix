'use client';
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { cn } from '../../../styles/theme.js';
import { useState, useRef, useCallback, useEffect } from 'react';
import { getBoundedPosition } from './getBoundedPosition.js';
import { useRespositionOnWindowResize } from './useRepositionOnResize.js';
import { jsx } from 'react/jsx-runtime';
function Draggable({
  children,
  gridSize = 1,
  startingPosition = {
    x: 20,
    y: 20
  },
  snapToGrid = false,
  disabled = false
}) {
  const _useState = useState(startingPosition),
    _useState2 = _slicedToArray(_useState, 2),
    position = _useState2[0],
    setPosition = _useState2[1];
  const _useState3 = useState({
      x: 0,
      y: 0
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    dragOffset = _useState4[0],
    setDragOffset = _useState4[1];
  const _useState5 = useState({
      x: 0,
      y: 0
    }),
    _useState6 = _slicedToArray(_useState5, 2),
    dragStartPosition = _useState6[0],
    setDragStartPosition = _useState6[1];
  const _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    isDragging = _useState8[0],
    setIsDragging = _useState8[1];
  const draggableRef = useRef(null);
  const calculateSnapToGrid = useCallback(positionValue => {
    return Math.round(positionValue / gridSize) * gridSize;
  }, [gridSize]);
  const handleDragStart = useCallback(e => {
    if (disabled) {
      return;
    }
    setIsDragging(true);
    setDragStartPosition({
      x: e.clientX,
      y: e.clientY
    });
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position, disabled]);
  useEffect(() => {
    if (!isDragging) {
      return;
    }
    const handleGlobalMove = e => {
      const newPosition = getBoundedPosition({
        draggableRef,
        position: {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        }
      });
      setPosition(newPosition);
    };
    const handleGlobalEnd = e => {
      const moveDistance = Math.hypot(e.clientX - dragStartPosition.x, e.clientY - dragStartPosition.y);
      if (moveDistance > 2) {
        e.preventDefault();
        e.stopPropagation();
        const clickEvent = e2 => {
          e2.preventDefault();
          e2.stopPropagation();
          document.removeEventListener('click', clickEvent, true);
        };
        document.addEventListener('click', clickEvent, true);
      }
      setPosition(prev => ({
        x: snapToGrid ? calculateSnapToGrid(prev.x) : prev.x,
        y: snapToGrid ? calculateSnapToGrid(prev.y) : prev.y
      }));
      setIsDragging(false);
    };
    document.addEventListener('pointermove', handleGlobalMove);
    document.addEventListener('pointerup', handleGlobalEnd);
    return () => {
      document.removeEventListener('pointermove', handleGlobalMove);
      document.removeEventListener('pointerup', handleGlobalEnd);
    };
  }, [isDragging, dragOffset, snapToGrid, calculateSnapToGrid, dragStartPosition]);
  useRespositionOnWindowResize(draggableRef, position, setPosition);
  return /*#__PURE__*/jsx("div", {
    ref: draggableRef,
    "data-testid": "ockDraggable",
    className: cn('fixed touch-none select-none', 'cursor-grab active:cursor-grabbing'),
    style: {
      left: `${position.x}px`,
      top: `${position.y}px`
    },
    onPointerDown: handleDragStart,
    children: children
  });
}
export { Draggable };
//# sourceMappingURL=Draggable.js.map
