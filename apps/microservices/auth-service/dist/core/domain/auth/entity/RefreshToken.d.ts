import { Entity } from '@core/common/entity/Entity';
export type CreateRefreshTokenPayload = {
    id?: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt?: Date;
};
export declare class RefreshToken extends Entity<string> {
    private readonly userId;
    private readonly token;
    private readonly expiresAt;
    private readonly createdAt;
    constructor(payload: CreateRefreshTokenPayload);
    getUserId(): string;
    getToken(): string;
    getExpiresAt(): Date;
    getCreatedAt(): Date;
    isExpired(): boolean;
    static new(payload: CreateRefreshTokenPayload): Promise<RefreshToken>;
}
