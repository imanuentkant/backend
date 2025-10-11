import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class NestHttpExceptionFilter implements ExceptionFilter {
    catch(error: Error, host: ArgumentsHost): void;
    private getHttpStatus;
}
