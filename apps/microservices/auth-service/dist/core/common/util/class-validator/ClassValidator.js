"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassValidator = void 0;
const class_validator_1 = require("class-validator");
class ClassValidator {
    static async validate(classInstance, context) {
        const errors = await (0, class_validator_1.validate)(classInstance);
        if (errors.length > 0) {
            return {
                context: context || classInstance.constructor.name,
                errors: errors,
            };
        }
        return undefined;
    }
}
exports.ClassValidator = ClassValidator;
//# sourceMappingURL=ClassValidator.js.map