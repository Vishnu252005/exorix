import { DEFAULT_ONRAMP_URL } from '../constants.js';
let MessageCodes = /*#__PURE__*/function (MessageCodes) {
  MessageCodes["AppParams"] = "app_params";
  MessageCodes["PaymentLinkSuccess"] = "payment_link_success";
  MessageCodes["PaymentLinkClosed"] = "payment_link_closed";
  MessageCodes["GuestCheckoutRedirectSuccess"] = "guest_checkout_redirect_success";
  MessageCodes["Success"] = "success";
  MessageCodes["Event"] = "event";
  return MessageCodes;
}({});
/**
 * Subscribes to a message from the parent window.
 * @param messageCode A message code to subscribe to.
 * @param onMessage Callback for when the message is received.
 * @param allowedOrigin The origin to allow messages from.
 * @param onValidateOrigin Callback to validate the origin of the message.
 * @returns
 */
function subscribeToWindowMessage({
  onMessage,
  allowedOrigin = DEFAULT_ONRAMP_URL,
  onValidateOrigin = () => Promise.resolve(true)
}) {
  const handleMessage = event => {
    if (!isAllowedOrigin({
      event,
      allowedOrigin
    })) {
      return;
    }
    const _JSON$parse = JSON.parse(event.data),
      eventName = _JSON$parse.eventName,
      data = _JSON$parse.data;
    if (eventName === 'event') {
      (async () => {
        if (await onValidateOrigin(event.origin)) {
          onMessage(data);
        }
      })();
    }
  };
  window.addEventListener('message', handleMessage);

  // Unsubscribe
  return () => {
    window.removeEventListener('message', handleMessage);
  };
}
function isAllowedOrigin({
  event,
  allowedOrigin
}) {
  const isOriginAllowed = !allowedOrigin || event.origin === allowedOrigin;
  return isOriginAllowed;
}
export { MessageCodes, subscribeToWindowMessage };
//# sourceMappingURL=subscribeToWindowMessage.js.map
