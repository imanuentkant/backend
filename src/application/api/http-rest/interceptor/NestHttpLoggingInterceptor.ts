import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { AuditLogAsyncAppenderPort } from '@core/common/port/logger/AuditLogAsyncAppenderPort';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class NestHttpLoggingInterceptor implements NestInterceptor {
  constructor(
      @Inject(CoreDITokens.AuditLogAsyncAppender) private readonly auditAppender: AuditLogAsyncAppenderPort,
  ) {}
  
  public intercept(context: ExecutionContext, next: CallHandler): Observable<CoreApiResponse<void>> {
    const request: Request = context.switchToHttp().getRequest();
    const requestStartDate: number = Date.now();
    
    return next.handle().pipe(tap(async (): Promise<void> => {
      const requestFinishDate: number = Date.now();
      
      const message: string =
        `Method: ${request.method}; ` +
        `Path: ${request.path}; ` +
        `SpentTime: ${requestFinishDate - requestStartDate}ms`;
      
      Logger.log(message, NestHttpLoggingInterceptor.name);

      try {
        const actorId = (request as any).user?.id || null;
        const statusCode = (context.switchToHttp().getResponse() as any)?.statusCode || 200;
        const ip = ((request.headers['x-forwarded-for'] as string) || (request.ip as any)) || null;
        const userAgent = (request.headers['user-agent'] as string) || null;
        await this.auditAppender.append({
          actorId,
          method: request.method,
          path: request.path,
          statusCode,
          ip,
          userAgent,
          body: request.body || null,
          params: request.params || null,
          query: request.query || null,
          createdAt: new Date(),
        });
      } catch (e) {
        // tránh làm hỏng request nếu log lỗi
      }
    }));
  }
}
