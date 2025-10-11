import { Optional } from '@core/common/type/CommonTypes';
import { RefreshToken } from '@core/domain/auth/entity/RefreshToken';
export interface RefreshTokenRepositoryPort {
    findByToken(token: string): Promise<Optional<RefreshToken>>;
    findByUserId(userId: string): Promise<Optional<RefreshToken>>;
    save(refreshToken: RefreshToken): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
}
