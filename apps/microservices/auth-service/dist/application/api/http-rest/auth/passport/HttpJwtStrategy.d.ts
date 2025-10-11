import { HttpAuthService } from '@application/api/http-rest/auth/HttpAuthService';
import { HttpJwtPayload, HttpUserPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
declare const HttpJwtStrategy_base: new (...args: any[]) => Strategy;
export declare class HttpJwtStrategy extends HttpJwtStrategy_base {
    private configService;
    private authService;
    constructor(configService: ConfigService, authService: HttpAuthService);
    validate(payload: HttpJwtPayload): Promise<HttpUserPayload>;
}
export {};
