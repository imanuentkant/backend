"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const Entity_1 = require("../../../common/entity/Entity");
const UserEnums_1 = require("../../../common/enums/UserEnums");
const bcryptjs_1 = require("bcryptjs");
const class_validator_1 = require("class-validator");
const uuid_1 = require("uuid");
class User extends Entity_1.Entity {
    constructor(payload) {
        super();
        this.firstName = payload.firstName;
        this.lastName = payload.lastName;
        this.email = payload.email;
        this.role = payload.role;
        this.password = payload.password;
        this.id = payload.id || (0, uuid_1.v7)();
        this.createdAt = payload.createdAt || new Date();
        this.editedAt = payload.editedAt || null;
        this.removedAt = payload.removedAt || null;
    }
    getFirstName() {
        return this.firstName;
    }
    getLastName() {
        return this.lastName;
    }
    getName() {
        return `${this.firstName} ${this.lastName}`;
    }
    getEmail() {
        return this.email;
    }
    getRole() {
        return this.role;
    }
    getPassword() {
        return this.password;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getEditedAt() {
        return this.editedAt;
    }
    getRemovedAt() {
        return this.removedAt;
    }
    async hashPassword() {
        const salt = await (0, bcryptjs_1.genSalt)();
        this.password = await (0, bcryptjs_1.hash)(this.password, salt);
        await this.validate();
    }
    async comparePassword(password) {
        return (0, bcryptjs_1.compare)(password, this.password);
    }
    async edit(payload) {
        const currentDate = new Date();
        if (payload.firstName) {
            this.firstName = payload.firstName;
            this.editedAt = currentDate;
        }
        if (payload.lastName) {
            this.lastName = payload.lastName;
            this.editedAt = currentDate;
        }
        await this.validate();
    }
    async remove() {
        this.removedAt = new Date();
        await this.validate();
    }
    static async new(payload) {
        const user = new User(payload);
        await user.hashPassword();
        await user.validate();
        return user;
    }
}
exports.User = User;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(UserEnums_1.UserRole),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Object)
], User.prototype, "editedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Object)
], User.prototype, "removedAt", void 0);
//# sourceMappingURL=User.js.map