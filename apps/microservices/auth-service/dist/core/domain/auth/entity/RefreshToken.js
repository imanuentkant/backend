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
exports.RefreshToken = void 0;
const Entity_1 = require("../../../common/entity/Entity");
const class_validator_1 = require("class-validator");
const uuid_1 = require("uuid");
class RefreshToken extends Entity_1.Entity {
    constructor(payload) {
        super();
        this.id = payload.id || (0, uuid_1.v7)();
        this.userId = payload.userId;
        this.token = payload.token;
        this.expiresAt = payload.expiresAt;
        this.createdAt = payload.createdAt || new Date();
    }
    getUserId() {
        return this.userId;
    }
    getToken() {
        return this.token;
    }
    getExpiresAt() {
        return this.expiresAt;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    isExpired() {
        return new Date() > this.expiresAt;
    }
    static async new(payload) {
        const refreshToken = new RefreshToken(payload);
        await refreshToken.validate();
        return refreshToken;
    }
}
exports.RefreshToken = RefreshToken;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefreshToken.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefreshToken.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], RefreshToken.prototype, "expiresAt", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], RefreshToken.prototype, "createdAt", void 0);
//# sourceMappingURL=RefreshToken.js.map