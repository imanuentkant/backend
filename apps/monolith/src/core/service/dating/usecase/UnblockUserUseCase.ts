import { UseCase } from '@core/common/usecase/UseCase';
import { BlockedUserRepositoryPort } from '@core/domain/dating/port/BlockedUserRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface UnblockUserUseCasePayload {
  blockerId: string;
  blockedId: string;
}

export class UnblockUserUseCase implements UseCase<UnblockUserUseCasePayload, void> {
  constructor(
    private readonly blockedUserRepository: BlockedUserRepositoryPort,
  ) {}

  public async execute(payload: UnblockUserUseCasePayload): Promise<void> {
    const blocked = await this.blockedUserRepository.findByPair(
      payload.blockerId,
      payload.blockedId,
    );

    if (!blocked) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Block record not found',
      });
    }

    await this.blockedUserRepository.delete(blocked.getId());
  }
}
