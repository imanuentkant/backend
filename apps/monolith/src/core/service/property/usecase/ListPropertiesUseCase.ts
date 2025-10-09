import { UseCase } from '@core/common/usecase/UseCase';
import { Property } from '@core/domain/property/entity/Property';
import { PropertyRepositoryPort } from '@core/domain/property/port/PropertyRepositoryPort';

export type ListPropertiesUseCasePayload = {
  city?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
};

export class ListPropertiesUseCase implements UseCase<ListPropertiesUseCasePayload, Property[]> {
  
  constructor(private readonly propertyRepository: PropertyRepositoryPort) {}
  
  async execute(payload: ListPropertiesUseCasePayload): Promise<Property[]> {
    return this.propertyRepository.findAll(payload);
  }
}

