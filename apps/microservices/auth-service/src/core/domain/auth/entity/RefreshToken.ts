import { Entity } from '@core/common/entity/Entity';
import { IsDate, IsString } from 'class-validator';
import { v7 as uuidv7 } from 'uuid';

export type CreateRefreshTokenPayload = {
  id?: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
};

export class RefreshToken extends Entity<string> {
  @IsString()
  private readonly userId: string;

  @IsString()
  private readonly token: string;

  @IsDate()
  private readonly expiresAt: Date;

  @IsDate()
  private readonly createdAt: Date;

  constructor(payload: CreateRefreshTokenPayload) {
    super();

    this.id = payload.id || uuidv7();
    this.userId = payload.userId;
    this.token = payload.token;
    this.expiresAt = payload.expiresAt;
    this.createdAt = payload.createdAt || new Date();
  }

  public getUserId(): string {
    return this.userId;
  }

  public getToken(): string {
    return this.token;
  }

  public getExpiresAt(): Date {
    return this.expiresAt;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  public static async new(payload: CreateRefreshTokenPayload): Promise<RefreshToken> {
    const refreshToken = new RefreshToken(payload);
    await refreshToken.validate();
    return refreshToken;
  }
}

