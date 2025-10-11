"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserService = void 0;
const Code_1 = require("../../../common/code/Code");
const Exception_1 = require("../../../common/exception/Exception");
const CoreAssert_1 = require("../../../common/util/assert/CoreAssert");
const User_1 = require("../../../domain/auth/entity/User");
const UserUseCaseDto_1 = require("../../../domain/auth/usecase/dto/UserUseCaseDto");
class CreateUserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(payload) {
        const doesUserExist = !!(await this.userRepository.countUsers({ email: payload.email }));
        CoreAssert_1.CoreAssert.isFalse(doesUserExist, Exception_1.Exception.new({ code: Code_1.Code.ENTITY_ALREADY_EXISTS_ERROR, overrideMessage: 'User already exists.' }));
        const user = await User_1.User.new({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            role: payload.role,
            password: payload.password,
        });
        await this.userRepository.addUser(user);
        return UserUseCaseDto_1.UserUseCaseDto.newFromUser(user);
    }
}
exports.CreateUserService = CreateUserService;
//# sourceMappingURL=CreateUserService.js.map