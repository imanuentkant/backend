import { CodeDescription } from '@core/common/code/Code';
export type CreateExceptionPayload = {
    code: CodeDescription;
    overrideMessage?: string;
    data?: unknown;
};
export declare class Exception extends Error {
    readonly code: number;
    readonly data?: unknown;
    private constructor();
    static new(payload: CreateExceptionPayload): Exception;
}
