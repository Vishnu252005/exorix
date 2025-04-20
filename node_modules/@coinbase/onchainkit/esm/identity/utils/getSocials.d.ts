import type { GetSocialsReturnType } from '../types';
import type { Chain } from 'viem';
export type GetSocials = {
    ensName: string;
    chain?: Chain;
};
export declare const getSocials: ({ ensName, chain, }: GetSocials) => Promise<GetSocialsReturnType>;
//# sourceMappingURL=getSocials.d.ts.map