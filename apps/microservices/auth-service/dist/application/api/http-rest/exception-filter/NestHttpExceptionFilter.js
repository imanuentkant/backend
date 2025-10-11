"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestHttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const Exception_1 = require("../../../../core/common/exception/Exception");
const CoreApiResponse_1 = require("../../../../core/common/api/CoreApiResponse");
const Code_1 = require("../../../../core/common/code/Code");
let NestHttpExceptionFilter = class NestHttpExceptionFilter {
    catch(error, host) {
        const response = host.switchToHttp().getResponse();
        let errorResponse;
        if (error instanceof Exception_1.Exception) {
            errorResponse = CoreApiResponse_1.CoreApiResponse.error({ code: error.code, message: error.message }, error.data ? error.data : undefined);
        }
        else if (error instanceof common_1.HttpException) {
            errorResponse = CoreApiResponse_1.CoreApiResponse.error({ code: error.getStatus(), message: error.message }, error.getResponse());
        }
        else {
            errorResponse = CoreApiResponse_1.CoreApiResponse.error(Code_1.Code.INTERNAL_ERROR, error.message);
        }
        response.status(this.getHttpStatus(errorResponse.code)).json(errorResponse);
    }
    getHttpStatus(code) {
        if (code >= 200 && code < 300)
            return common_1.HttpStatus.OK;
        if (code >= 400 && code < 500) {
            if (code === 401)
                return common_1.HttpStatus.UNAUTHORIZED;
            if (code === 403)
                return common_1.HttpStatus.FORBIDDEN;
            return common_1.HttpStatus.BAD_REQUEST;
        }
        if (code >= 1000 && code < 2000) {
            if (code === 1000)
                return common_1.HttpStatus.NOT_FOUND;
            if (code === 1004)
                return common_1.HttpStatus.CONFLICT;
            return common_1.HttpStatus.BAD_REQUEST;
        }
        return common_1.HttpStatus.INTERNAL_SERVER_ERROR;
    }
};
exports.NestHttpExceptionFilter = NestHttpExceptionFilter;
exports.NestHttpExceptionFilter = NestHttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], NestHttpExceptionFilter);
//# sourceMappingURL=NestHttpExceptionFilter.js.map