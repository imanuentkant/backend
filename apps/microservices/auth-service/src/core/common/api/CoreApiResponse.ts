import { Code, CodeDescription } from '@core/common/code/Code';
import { Optional } from '@core/common/type/CommonTypes';

export class CoreApiResponse<TData> {
  public readonly code: number;
  public readonly message: string;
  public readonly timestamp: number;
  public readonly data: Optional<TData>;

  private constructor(code: CodeDescription, data?: TData) {
    this.code = code.code;
    this.message = code.message;
    this.timestamp = Date.now();
    this.data = data;
  }

  public static success<TData>(data?: TData): CoreApiResponse<TData> {
    return new CoreApiResponse(Code.SUCCESS, data);
  }

  public static error<TData>(code: CodeDescription, data?: TData): CoreApiResponse<TData> {
    return new CoreApiResponse(code, data);
  }
}

