import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Exception } from '@core/common/exception/Exception';
import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { Code } from '@core/common/code/Code';

@Catch()
export class NestHttpExceptionFilter implements ExceptionFilter {
  public catch(error: Error, host: ArgumentsHost): void {
    const response: Response = host.switchToHttp().getResponse<Response>();
    let errorResponse: CoreApiResponse<unknown>;

    if (error instanceof Exception) {
      errorResponse = CoreApiResponse.error(
        { code: error.code, message: error.message },
        error.data ? error.data : undefined,
      );
    } else if (error instanceof HttpException) {
      errorResponse = CoreApiResponse.error(
        { code: error.getStatus(), message: error.message },
        error.getResponse(),
      );
    } else {
      errorResponse = CoreApiResponse.error(Code.INTERNAL_ERROR, error.message);
    }

    response.status(this.getHttpStatus(errorResponse.code)).json(errorResponse);
  }

  private getHttpStatus(code: number): number {
    // Map custom codes to HTTP status codes
    if (code >= 200 && code < 300) return HttpStatus.OK;
    if (code >= 400 && code < 500) {
      if (code === 401) return HttpStatus.UNAUTHORIZED;
      if (code === 403) return HttpStatus.FORBIDDEN;
      return HttpStatus.BAD_REQUEST;
    }
    if (code >= 1000 && code < 2000) {
      if (code === 1000) return HttpStatus.NOT_FOUND;
      if (code === 1004) return HttpStatus.CONFLICT;
      return HttpStatus.BAD_REQUEST;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

