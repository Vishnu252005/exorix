import { DEFAULT_ONRAMP_URL } from '../constants.js';
import { subscribeToWindowMessage } from './subscribeToWindowMessage.js';

/**
 * Subscribes to events from the Coinbase Onramp widget.
 * @param onEvent - Callback for when any event is received.
 * @param onExit - Callback for when an exit event is received.
 * @param onSuccess - Callback for when a success event is received.
 * @returns a function to unsubscribe from the event listener.
 */
function setupOnrampEventListeners({
  onEvent,
  onExit,
  onSuccess,
  host = DEFAULT_ONRAMP_URL
}) {
  const unsubscribe = subscribeToWindowMessage({
    allowedOrigin: host,
    onMessage: data => {
      const metadata = data;
      if (metadata.eventName === 'success') {
        onSuccess?.(metadata.data);
      }
      if (metadata.eventName === 'exit') {
        onExit?.(metadata.error);
      }
      onEvent?.(metadata);
    }
  });
  return unsubscribe;
}
export { setupOnrampEventListeners };
//# sourceMappingURL=setupOnrampEventListeners.js.map
