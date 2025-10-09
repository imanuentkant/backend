import { UseCase } from '@core/common/usecase/UseCase';
import { DatingSettings } from '@core/domain/dating/entity/DatingSettings';
import { DatingSettingsRepositoryPort } from '@core/domain/dating/port/DatingSettingsRepositoryPort';

export interface UpdateDatingSettingsUseCasePayload {
  customerId: string;
  maxDistance?: number;
  ageMin?: number;
  ageMax?: number;
  showDistance?: boolean;
  showAge?: boolean;
  onlyShowVerified?: boolean;
}

export class UpdateDatingSettingsUseCase implements UseCase<UpdateDatingSettingsUseCasePayload, DatingSettings> {
  constructor(
    private readonly settingsRepository: DatingSettingsRepositoryPort,
  ) {}

  public async execute(payload: UpdateDatingSettingsUseCasePayload): Promise<DatingSettings> {
    let settings = await this.settingsRepository.findByCustomerId(payload.customerId);

    if (!settings) {
      // Create new settings with defaults
      settings = new DatingSettings({
        customerId: payload.customerId,
        maxDistance: payload.maxDistance,
        ageMin: payload.ageMin,
        ageMax: payload.ageMax,
        showDistance: payload.showDistance,
        showAge: payload.showAge,
        onlyShowVerified: payload.onlyShowVerified,
      });
      return this.settingsRepository.save(settings);
    }

    // Update existing settings
    if (payload.maxDistance !== undefined) {
      settings.updateDistance(payload.maxDistance);
    }

    if (payload.ageMin !== undefined && payload.ageMax !== undefined) {
      settings.updateAgeRange(payload.ageMin, payload.ageMax);
    }

    if (payload.showDistance === false) {
      settings.hideDistance();
    }

    if (payload.showAge === false) {
      settings.hideAge();
    }

    return this.settingsRepository.update(settings);
  }
}
