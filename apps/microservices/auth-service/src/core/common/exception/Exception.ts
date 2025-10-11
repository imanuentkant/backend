import { Code, CodeDescription } from '@core/common/code/Code';
import { Optional } from '@core/common/type/CommonTypes';

export type CreateExceptionPayload = {
  code: CodeDescription;
  overrideMessage?: string;
  data?: unknown;
};

export class Exception extends Error {
  public readonly code: number;
  public readonly data?: unknown;

  private constructor(codeDescription: CodeDescription, overrideMessage?: string, data?: unknown) {
    super();
    this.name = this.constructor.name;
    this.code = codeDescription.code;
    this.message = overrideMessage || codeDescription.message;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }

  public static new(payload: CreateExceptionPayload): Exception {
    return new Exception(payload.code, payload.overrideMessage, payload.data);
  }
}

