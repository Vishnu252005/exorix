import { useIcon } from '../../internal/hooks/useIcon.js';
import { cn } from '../../styles/theme.js';
import { jsx } from 'react/jsx-runtime';
function FundCardPaymentMethodImage({
  className,
  paymentMethod
}) {
  const icon = paymentMethod.icon;
  const iconSvg = useIcon({
    icon
  });
  return /*#__PURE__*/jsx("div", {
    "data-testid": "ockFundCardPaymentMethodImage__iconContainer",
    className: cn('flex items-center justify-center overflow-hidden rounded-[50%]', className),
    children: iconSvg
  });
}
export { FundCardPaymentMethodImage };
//# sourceMappingURL=FundCardPaymentMethodImage.js.map
