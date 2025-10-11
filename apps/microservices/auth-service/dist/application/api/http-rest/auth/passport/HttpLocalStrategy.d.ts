import { HttpAuthService } from '@application/api/http-rest/auth/HttpAuthService';
import { HttpUserPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { Strategy } from 'passport-local';
import { ConfigService } from '@nestjs/config';
declare const HttpLocalStrategy_base: new (...args: any[]) => Strategy;
export declare class HttpLocalStrategy extends HttpLocalStrategy_base {
    private configService;
    private authService;
    constructor(configService: ConfigService, authService: HttpAuthService);
    validate(username: string, password: string): Promise<HttpUserPayload>;
}
export {};
