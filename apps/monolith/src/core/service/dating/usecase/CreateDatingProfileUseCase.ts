import { UseCase } from '@core/common/usecase/UseCase';
import { DatingProfile, Gender, LookingFor } from '@core/domain/dating/entity/DatingProfile';
import { DatingProfileRepositoryPort } from '@core/domain/dating/port/DatingProfileRepositoryPort';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';

export interface CreateDatingProfileUseCasePayload {
  customerId: string;
  displayName: string;
  bio: string;
  age: number;
  gender: Gender;
  interestedIn: Gender[];
  location: {
    city: string;
    state: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  photos?: string[];
  interests?: string[];
  occupation?: string;
  education?: string;
  height?: number;
  lookingFor?: LookingFor;
}

export class CreateDatingProfileUseCase implements UseCase<CreateDatingProfileUseCasePayload, DatingProfile> {
  constructor(private readonly profileRepository: DatingProfileRepositoryPort) {}

  public async execute(payload: CreateDatingProfileUseCasePayload): Promise<DatingProfile> {
    // Check if profile already exists
    const existing = await this.profileRepository.findByCustomerId(payload.customerId);
    if (existing) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Dating profile already exists for this customer',
      });
    }

    const profile = new DatingProfile(payload);
    return this.profileRepository.save(profile);
  }
}
