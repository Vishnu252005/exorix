const DEFAULT_ONRAMP_URL = 'https://pay.coinbase.com';

/** The base URL for the Coinbase Onramp widget */
const ONRAMP_BUY_URL = `${DEFAULT_ONRAMP_URL}/buy`;

/** The recommended height of a Coinbase Onramp popup window */
const ONRAMP_POPUP_HEIGHT = 720;

/** The recommended width of a Coinbase Onramp popup window */
const ONRAMP_POPUP_WIDTH = 460;

/** The base URL for the Coinbase Onramp API */
const ONRAMP_API_BASE_URL = 'https://api.developer.coinbase.com/onramp/v1';

/** Time in milliseconds to wait before resetting the button state to default after a transaction is completed */
const FUND_BUTTON_RESET_TIMEOUT = 3000;
export { DEFAULT_ONRAMP_URL, FUND_BUTTON_RESET_TIMEOUT, ONRAMP_API_BASE_URL, ONRAMP_BUY_URL, ONRAMP_POPUP_HEIGHT, ONRAMP_POPUP_WIDTH };
//# sourceMappingURL=constants.js.map
