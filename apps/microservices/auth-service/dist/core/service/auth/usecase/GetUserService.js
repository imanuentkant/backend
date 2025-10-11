"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserService = void 0;
const Code_1 = require("../../../common/code/Code");
const Exception_1 = require("../../../common/exception/Exception");
const CoreAssert_1 = require("../../../common/util/assert/CoreAssert");
const UserUseCaseDto_1 = require("../../../domain/auth/usecase/dto/UserUseCaseDto");
class GetUserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(payload) {
        const user = await this.userRepository.findUser({
            id: payload.id,
            email: payload.email,
        });
        CoreAssert_1.CoreAssert.notEmpty(user, Exception_1.Exception.new({ code: Code_1.Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'User not found.' }));
        return UserUseCaseDto_1.UserUseCaseDto.newFromUser(user);
    }
}
exports.GetUserService = GetUserService;
//# sourceMappingURL=GetUserService.js.map