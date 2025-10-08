import { UseCase } from '@core/common/usecase/UseCase';
import { AvailabilityRules } from '@core/domain/property/entity/AvailabilityRules';
import { PropertyCalendarRepositoryPort } from '@core/domain/property/port/PropertyCalendarRepositoryPort';

export type GetAvailabilityRulesUseCasePayload = {
  propertyId: string;
};

export class GetAvailabilityRulesUseCase implements UseCase<GetAvailabilityRulesUseCasePayload, AvailabilityRules> {
  
  constructor(private readonly calendarRepository: PropertyCalendarRepositoryPort) {}
  
  async execute(payload: GetAvailabilityRulesUseCasePayload): Promise<AvailabilityRules> {
    let rules = await this.calendarRepository.findAvailabilityRules(payload.propertyId);
    
    // Create default rules if not exists
    if (!rules) {
      rules = new AvailabilityRules({
        propertyId: payload.propertyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await this.calendarRepository.saveAvailabilityRules(rules);
    }
    
    return rules;
  }
}