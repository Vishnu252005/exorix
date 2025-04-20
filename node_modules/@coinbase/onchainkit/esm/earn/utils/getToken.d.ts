import type { Token } from '../../token';
import type { Address } from 'viem';
export declare function getToken({ address, symbol, name, decimals, }: {
    address: Address;
    symbol?: string;
    name?: string;
    decimals?: number;
}): Token | undefined;
//# sourceMappingURL=getToken.d.ts.map