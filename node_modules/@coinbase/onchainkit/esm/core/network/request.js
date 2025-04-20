function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { JSON_RPC_VERSION, RequestContext, JSON_HEADERS, CONTEXT_HEADER, POST_METHOD } from './constants.js';
import { getRPCUrl } from './getRPCUrl.js';

/**
 * Builds a JSON-RPC request body.
 *
 * @param method - The method name.
 * @param params - The parameters for the method.
 * @returns The JSON-RPC request body.
 * @template T - The type of the parameters.
 */
function buildRequestBody(method, params) {
  return {
    id: 1,
    jsonrpc: JSON_RPC_VERSION,
    method: method,
    params: params
  };
}

/**
 * Builds the headers for a JSON-RPC request.
 *
 * @params context - Tracks the context where the request originated
 * @returns The headers for the JSON-RPC request.
 */
function buildRequestHeaders(context) {
  if (context) {
    // if an invalid context is provided, default to 'api'
    if (!Object.values(RequestContext).includes(context)) {
      return _objectSpread(_objectSpread({}, JSON_HEADERS), {}, {
        [CONTEXT_HEADER]: RequestContext.API
      });
    }
    return _objectSpread(_objectSpread({}, JSON_HEADERS), {}, {
      [CONTEXT_HEADER]: context
    });
  }
  return JSON_HEADERS;
}

/**
 * Sends a JSON-RPC request to configured RPC URL.
 * Defaults to using the Coinbase Developer Platform Node.
 *
 * @param method - The method name.
 * @param params - The parameters for the method.
 * @returns A promise that resolves to the JSON-RPC response.
 * @throws If an error occurs while sending the request.
 */
async function sendRequest(method, params, _context) {
  try {
    const body = buildRequestBody(method, params);
    const url = getRPCUrl();
    const response = await fetch(url, {
      body: JSON.stringify(body),
      headers: buildRequestHeaders(_context),
      method: POST_METHOD
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`sendRequest: error sending request: ${error.message}`);
    throw error;
  }
}
export { buildRequestBody, buildRequestHeaders, sendRequest };
//# sourceMappingURL=request.js.map
