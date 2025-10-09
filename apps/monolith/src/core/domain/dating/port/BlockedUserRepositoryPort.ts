import { BlockedUser } from '../entity/BlockedUser';
import { Nullable } from '@core/common/type/CommonTypes';

export interface BlockedUserRepositoryPort {
  save(blockedUser: BlockedUser): Promise<BlockedUser>;
  
  findByBlocker(blockerId: string): Promise<BlockedUser[]>;
  
  findByBlockerId(blockerId: string): Promise<BlockedUser[]>;
  
  findByBlockedId(blockedId: string): Promise<BlockedUser[]>;
  
  findByPair(blockerId: string, blockedId: string): Promise<Nullable<BlockedUser>>;
  
  delete(id: string): Promise<void>;
  
  isBlocked(userId: string, targetId: string): Promise<boolean>;
}
