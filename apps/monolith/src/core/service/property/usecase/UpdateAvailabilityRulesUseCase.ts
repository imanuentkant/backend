import { UseCase } from '@core/common/usecase/UseCase';
import { AvailabilityRules } from '@core/domain/property/entity/AvailabilityRules';
import { PropertyCalendarRepositoryPort } from '@core/domain/property/port/PropertyCalendarRepositoryPort';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';

export type UpdateAvailabilityRulesUseCasePayload = {
  propertyId: string;
  advanceNoticeDays?: number;
  preparationDays?: number;
  checkInDays?: number[];
  checkInTimeFrom?: string;
  checkInTimeTo?: string;
  checkOutTime?: string;
};

export class UpdateAvailabilityRulesUseCase implements UseCase<UpdateAvailabilityRulesUseCasePayload, AvailabilityRules> {
  
  constructor(private readonly calendarRepository: PropertyCalendarRepositoryPort) {}
  
  async execute(payload: UpdateAvailabilityRulesUseCasePayload): Promise<AvailabilityRules> {
    let rules = await this.calendarRepository.findAvailabilityRules(payload.propertyId);
    
    if (!rules) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Availability rules not found for property ${payload.propertyId}`,
      });
    }
    
    rules.updateRules({
      advanceNoticeDays: payload.advanceNoticeDays,
      preparationDays: payload.preparationDays,
      checkInDays: payload.checkInDays,
      checkInTimeFrom: payload.checkInTimeFrom,
      checkInTimeTo: payload.checkInTimeTo,
      checkOutTime: payload.checkOutTime,
    });
    
    return await this.calendarRepository.saveAvailabilityRules(rules);
  }
}