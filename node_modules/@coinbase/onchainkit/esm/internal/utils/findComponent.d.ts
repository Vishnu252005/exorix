import type { ComponentType, ReactElement, ReactNode } from 'react';
/** Type for Next.js Server Component Payload
 * Temporary patch until we update to default children and remove internal findComponent */
export interface ServerComponentPayload {
    _payload: {
        /** [modulePath, chunks, componentName] */
        value: [string, string[], string];
    };
}
export declare function findComponent<T>(Component: ComponentType<T>): (child: ReactNode) => child is ReactElement<T, string | import("react").JSXElementConstructor<any>>;
//# sourceMappingURL=findComponent.d.ts.map