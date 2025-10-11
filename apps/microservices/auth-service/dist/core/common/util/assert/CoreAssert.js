"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreAssert = void 0;
class CoreAssert {
    static isTrue(expression, exception) {
        if (!expression) {
            throw exception;
        }
    }
    static isFalse(expression, exception) {
        if (expression) {
            throw exception;
        }
    }
    static notEmpty(value, exception) {
        if (value === undefined || value === null) {
            throw exception;
        }
        return value;
    }
}
exports.CoreAssert = CoreAssert;
//# sourceMappingURL=CoreAssert.js.map