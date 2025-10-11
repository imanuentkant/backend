"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exception = void 0;
class Exception extends Error {
    constructor(codeDescription, overrideMessage, data) {
        super();
        this.name = this.constructor.name;
        this.code = codeDescription.code;
        this.message = overrideMessage || codeDescription.message;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
    static new(payload) {
        return new Exception(payload.code, payload.overrideMessage, payload.data);
    }
}
exports.Exception = Exception;
//# sourceMappingURL=Exception.js.map