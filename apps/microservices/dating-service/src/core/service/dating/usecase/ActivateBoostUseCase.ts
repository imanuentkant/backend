import { UseCase } from '@core/common/usecase/UseCase';
import { Boost } from '@core/domain/dating/entity/Boost';
import { BoostRepositoryPort } from '@core/domain/dating/port/BoostRepositoryPort';
import { DatingProfileRepositoryPort } from '@core/domain/dating/port/DatingProfileRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface ActivateBoostUseCasePayload {
  customerId: string;
  isPremium?: boolean; // For validation (premium gets boosts as part of subscription)
}

export class ActivateBoostUseCase implements UseCase<ActivateBoostUseCasePayload, Boost> {
  constructor(
    private readonly boostRepository: BoostRepositoryPort,
    private readonly profileRepository: DatingProfileRepositoryPort,
  ) {}

  public async execute(payload: ActivateBoostUseCasePayload): Promise<Boost> {
    // Verify dating profile exists
    const profile = await this.profileRepository.findByCustomerId(payload.customerId);
    if (!profile) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Dating profile not found',
      });
    }

    // Check if user already has an active boost
    const existingBoost = await this.boostRepository.findActiveBoostByCustomerId(payload.customerId);
    if (existingBoost && existingBoost.isCurrentlyActive()) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: `You already have an active boost. ${existingBoost.getRemainingMinutes()} minutes remaining.`,
      });
    }

    // Deactivate old boost if exists
    if (existingBoost) {
      existingBoost.deactivate();
      await this.boostRepository.update(existingBoost);
    }

    // Create new boost (30 minutes)
    const boost = new Boost({
      customerId: payload.customerId,
    });

    return this.boostRepository.save(boost);
  }
}

