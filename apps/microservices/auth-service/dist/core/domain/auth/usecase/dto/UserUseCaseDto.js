"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUseCaseDto = void 0;
class UserUseCaseDto {
    static newFromUser(user) {
        return {
            id: user.getId(),
            firstName: user.getFirstName(),
            lastName: user.getLastName(),
            email: user.getEmail(),
            role: user.getRole(),
            createdAt: user.getCreatedAt(),
            editedAt: user.getEditedAt(),
            removedAt: user.getRemovedAt(),
        };
    }
}
exports.UserUseCaseDto = UserUseCaseDto;
//# sourceMappingURL=UserUseCaseDto.js.map