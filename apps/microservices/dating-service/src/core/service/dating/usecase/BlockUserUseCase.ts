import { UseCase } from '@core/common/usecase/UseCase';
import { BlockedUser } from '@core/domain/dating/entity/BlockedUser';
import { BlockedUserRepositoryPort } from '@core/domain/dating/port/BlockedUserRepositoryPort';
import { MatchRepositoryPort } from '@core/domain/dating/port/MatchRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface BlockUserUseCasePayload {
  blockerId: string;
  blockedId: string;
  reason: string;
}

export class BlockUserUseCase implements UseCase<BlockUserUseCasePayload, BlockedUser> {
  constructor(
    private readonly blockedUserRepository: BlockedUserRepositoryPort,
    private readonly matchRepository: MatchRepositoryPort,
  ) {}

  public async execute(payload: BlockUserUseCasePayload): Promise<BlockedUser> {
    // Check if already blocked
    const existing = await this.blockedUserRepository.findByPair(
      payload.blockerId,
      payload.blockedId,
    );

    if (existing) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'User is already blocked',
      });
    }

    // Create block
    const blockedUser = new BlockedUser({
      blockerId: payload.blockerId,
      blockedId: payload.blockedId,
      reason: payload.reason,
    });

    // Save block
    const saved = await this.blockedUserRepository.save(blockedUser);

    // Unmatch if they were matched
    const match = await this.matchRepository.findByCustomers(
      payload.blockerId,
      payload.blockedId,
    );

    if (match && match.getIsActive()) {
      match.unmatch(payload.blockerId);
      await this.matchRepository.update(match);
    }

    return saved;
  }
}
