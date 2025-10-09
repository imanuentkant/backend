import { UseCase } from '@core/common/usecase/UseCase';
import { Property } from '@core/domain/property/entity/Property';
import { PropertyRepositoryPort } from '@core/domain/property/port/PropertyRepositoryPort';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';

export type GetPropertyUseCasePayload = {
  id: string;
};

export class GetPropertyUseCase implements UseCase<GetPropertyUseCasePayload, Property> {
  
  constructor(private readonly propertyRepository: PropertyRepositoryPort) {}
  
  async execute(payload: GetPropertyUseCasePayload): Promise<Property> {
    const property = await this.propertyRepository.findById(payload.id);
    
    if (!property) {
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Property with id ${payload.id} not found`,
      });
    }
    
    return property;
  }
}

