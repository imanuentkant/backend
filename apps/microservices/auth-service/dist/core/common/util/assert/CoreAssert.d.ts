import { Exception } from '@core/common/exception/Exception';
export declare class CoreAssert {
    static isTrue(expression: boolean, exception: Exception): void;
    static isFalse(expression: boolean, exception: Exception): void;
    static notEmpty<T>(value: T | undefined | null, exception: Exception): T;
}
