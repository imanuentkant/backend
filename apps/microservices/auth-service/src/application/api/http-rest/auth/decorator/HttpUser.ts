import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpRequestWithUser } from '@application/api/http-rest/auth/type/HttpAuthTypes';

export const HttpUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<HttpRequestWithUser>();
  return request.user;
});

