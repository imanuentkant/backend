"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreApiResponse = void 0;
const Code_1 = require("../code/Code");
class CoreApiResponse {
    constructor(code, data) {
        this.code = code.code;
        this.message = code.message;
        this.timestamp = Date.now();
        this.data = data;
    }
    static success(data) {
        return new CoreApiResponse(Code_1.Code.SUCCESS, data);
    }
    static error(code, data) {
        return new CoreApiResponse(code, data);
    }
}
exports.CoreApiResponse = CoreApiResponse;
//# sourceMappingURL=CoreApiResponse.js.map