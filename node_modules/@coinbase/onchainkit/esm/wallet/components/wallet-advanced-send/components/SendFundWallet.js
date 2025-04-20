import '../../../../fund/index.js';
import { cn, text, color } from '../../../../styles/theme.js';
import { jsxs, jsx } from 'react/jsx-runtime';
import { FundCard } from '../../../../fund/components/FundCard.js';
import { FundCardAmountInput } from '../../../../fund/components/FundCardAmountInput.js';
import { FundCardAmountInputTypeSwitch } from '../../../../fund/components/FundCardAmountInputTypeSwitch.js';
import { FundCardPresetAmountInputList } from '../../../../fund/components/FundCardPresetAmountInputList.js';
import { FundCardPaymentMethodDropdown } from '../../../../fund/components/FundCardPaymentMethodDropdown.js';
import { FundCardSubmitButton } from '../../../../fund/components/FundCardSubmitButton.js';
function SendFundWallet({
  onError,
  onStatus,
  onSuccess,
  classNames
}) {
  return /*#__PURE__*/jsxs("div", {
    className: cn('flex flex-col items-center justify-between', classNames?.container),
    "data-testid": "ockSendFundWallet",
    children: [/*#__PURE__*/jsx("div", {
      className: cn(text.label2, color.foregroundMuted, classNames?.subtitle),
      children: "Insufficient ETH balance to send transaction. Fund your wallet to continue."
    }), /*#__PURE__*/jsxs(FundCard, {
      assetSymbol: "ETH",
      country: "US",
      currency: "USD",
      presetAmountInputs: ['2', '5', '10'],
      onError: onError,
      onStatus: onStatus,
      onSuccess: onSuccess,
      className: cn('mt-3 w-88 border-none py-0', classNames?.fundCard),
      children: [/*#__PURE__*/jsx(FundCardAmountInput, {}), /*#__PURE__*/jsx(FundCardAmountInputTypeSwitch, {}), /*#__PURE__*/jsx(FundCardPresetAmountInputList, {}), /*#__PURE__*/jsx(FundCardPaymentMethodDropdown, {}), /*#__PURE__*/jsx(FundCardSubmitButton, {})]
    })]
  });
}
export { SendFundWallet };
//# sourceMappingURL=SendFundWallet.js.map
