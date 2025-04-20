function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const DEFAULT_MIN_AMOUNT = 2;
const DEFAULT_MAX_AMOUNT = 500;

/**
 * Coinbase payment method description is built using the available payment methods and adding Cash and Crypto Balance to the end of the array.
 * i.e. If the API returns Card and ACH, the description will be "Card, ACH, Cash, Crypto Balance".
 */
const buildCoinbasePaymentMethodDescription = paymentMethodLimits => {
  const availableMethods = [
  // Check API-provided methods
  paymentMethodLimits.some(limit => limit.id === 'ACH_BANK_ACCOUNT') && 'ACH', paymentMethodLimits.some(limit => limit.id === 'CARD') && 'debit',
  // Always include these methods
  'cash', 'crypto balance'].filter(Boolean); // Remove falsy values

  return availableMethods.join(', ');
};
const buildCoinbasePaymentMethod = ({
  limits
}) => ({
  id: '',
  name: 'Coinbase',
  description: buildCoinbasePaymentMethodDescription(limits),
  icon: 'coinbaseLogo',
  minAmount: Math.min(...limits.map(l => Number(l.min))),
  maxAmount: Math.max(...limits.map(l => Number(l.max)))
});
const buildUSPaymentMethods = paymentCurrency => {
  const paymentMethodConfigs = [{
    id: 'APPLE_PAY',
    name: 'Apple Pay',
    icon: 'apple'
  }, {
    id: 'CARD',
    name: 'Debit card',
    icon: 'creditCard'
  }];
  return paymentMethodConfigs.map(config => {
    const limit = paymentCurrency.limits.find(limit => limit.id === config.id);
    return _objectSpread(_objectSpread({}, config), {}, {
      description: 'Up to $500/week. No sign up required.',
      minAmount: Number(limit?.min) || DEFAULT_MIN_AMOUNT,
      maxAmount: Number(limit?.max) || DEFAULT_MAX_AMOUNT
    });
  });
};
const buildPaymentMethods = (paymentOptions, currency, country) => {
  const paymentCurrency = paymentOptions.paymentCurrencies.find(paymentCurrency => paymentCurrency.id === currency);
  if (!paymentCurrency) {
    return [];
  }
  const coinbasePaymentMethod = buildCoinbasePaymentMethod(paymentCurrency);
  let usPaymentMethods = [];
  if (country === 'US' && currency === 'USD') {
    usPaymentMethods = buildUSPaymentMethods(paymentCurrency);
  }
  return [coinbasePaymentMethod, ...usPaymentMethods];
};
export { buildCoinbasePaymentMethodDescription, buildPaymentMethods };
//# sourceMappingURL=buildPaymentMethods.js.map
