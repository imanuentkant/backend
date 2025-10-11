import { Exception } from '@core/common/exception/Exception';

export class CoreAssert {
  public static isTrue(expression: boolean, exception: Exception): void {
    if (!expression) {
      throw exception;
    }
  }

  public static isFalse(expression: boolean, exception: Exception): void {
    if (expression) {
      throw exception;
    }
  }

  public static notEmpty<T>(value: T | undefined | null, exception: Exception): T {
    if (value === undefined || value === null) {
      throw exception;
    }
    return value;
  }
}

