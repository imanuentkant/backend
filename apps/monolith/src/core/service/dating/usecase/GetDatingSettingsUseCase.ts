import { UseCase } from '@core/common/usecase/UseCase';
import { DatingSettings } from '@core/domain/dating/entity/DatingSettings';
import { DatingSettingsRepositoryPort } from '@core/domain/dating/port/DatingSettingsRepositoryPort';

export interface GetDatingSettingsUseCasePayload {
  customerId: string;
}

export class GetDatingSettingsUseCase implements UseCase<GetDatingSettingsUseCasePayload, DatingSettings> {
  constructor(
    private readonly settingsRepository: DatingSettingsRepositoryPort,
  ) {}

  public async execute(payload: GetDatingSettingsUseCasePayload): Promise<DatingSettings> {
    let settings = await this.settingsRepository.findByCustomerId(payload.customerId);

    if (!settings) {
      // Create default settings
      settings = new DatingSettings({
        customerId: payload.customerId,
      });
      await this.settingsRepository.save(settings);
    }

    return settings;
  }
}

