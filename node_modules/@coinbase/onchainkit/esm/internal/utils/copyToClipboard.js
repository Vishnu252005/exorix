'use client';
async function copyToClipboard({
  copyValue,
  onSuccess,
  onError
}) {
  try {
    await navigator.clipboard.writeText(copyValue);
    onSuccess?.();
  } catch (err) {
    onError?.(err);
  }
}
export { copyToClipboard };
//# sourceMappingURL=copyToClipboard.js.map
