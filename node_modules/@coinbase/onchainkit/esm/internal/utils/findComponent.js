import { isValidElement } from 'react';

/** Type for Next.js Server Component Payload
 * Temporary patch until we update to default children and remove internal findComponent */

function findComponent(Component) {
  return child => {
    const childType = child?.type;

    // Handle server component payload
    if (childType && typeof childType === 'object' && '_payload' in childType) {
      const serverPayload = childType;
      return serverPayload._payload.value[2] === Component.name;
    }

    // Handle client component
    return /*#__PURE__*/isValidElement(child) && child.type === Component;
  };
}
export { findComponent };
//# sourceMappingURL=findComponent.js.map
