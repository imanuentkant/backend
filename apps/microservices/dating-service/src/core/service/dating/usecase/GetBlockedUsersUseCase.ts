import { UseCase } from '@core/common/usecase/UseCase';
import { BlockedUser } from '@core/domain/dating/entity/BlockedUser';
import { BlockedUserRepositoryPort } from '@core/domain/dating/port/BlockedUserRepositoryPort';

export interface GetBlockedUsersUseCasePayload {
  userId: string;
}

export class GetBlockedUsersUseCase implements UseCase<GetBlockedUsersUseCasePayload, BlockedUser[]> {
  constructor(
    private readonly blockedUserRepository: BlockedUserRepositoryPort,
  ) {}

  public async execute(payload: GetBlockedUsersUseCasePayload): Promise<BlockedUser[]> {
    return this.blockedUserRepository.findByBlocker(payload.userId);
  }
}

