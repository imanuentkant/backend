import { CodeDescription } from '@core/common/code/Code';
import { Optional } from '@core/common/type/CommonTypes';
export declare class CoreApiResponse<TData> {
    readonly code: number;
    readonly message: string;
    readonly timestamp: number;
    readonly data: Optional<TData>;
    private constructor();
    static success<TData>(data?: TData): CoreApiResponse<TData>;
    static error<TData>(code: CodeDescription, data?: TData): CoreApiResponse<TData>;
}
