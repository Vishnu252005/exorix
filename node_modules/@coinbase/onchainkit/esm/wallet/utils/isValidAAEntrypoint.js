import { entryPoint06Address } from 'viem/account-abstraction';

/**
 * Verify the Account-Abstraction entrypoint before sponsoring a transaction.
 */
function isValidAAEntrypoint({
  entrypoint
}) {
  if (entrypoint.toLowerCase() !== entryPoint06Address.toLowerCase()) {
    return false;
  }
  return true;
}
export { isValidAAEntrypoint };
//# sourceMappingURL=isValidAAEntrypoint.js.map
