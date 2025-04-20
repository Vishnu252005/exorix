import type { GetSwapQuoteResponse } from '../../api/types';
import type { LifecycleStatusUpdate } from '../../internal/types';
import type { LifecycleStatus, SwapUnit } from '../../swap/types';
type ValidateQuoteParams = {
    responseETH?: GetSwapQuoteResponse;
    responseUSDC?: GetSwapQuoteResponse;
    responseFrom?: GetSwapQuoteResponse;
    updateLifecycleStatus: (status: LifecycleStatusUpdate<LifecycleStatus>) => void;
    to: SwapUnit;
};
export declare function validateQuote({ to, responseETH, responseUSDC, responseFrom, updateLifecycleStatus, }: ValidateQuoteParams): {
    isValid: boolean;
};
export {};
//# sourceMappingURL=validateQuote.d.ts.map