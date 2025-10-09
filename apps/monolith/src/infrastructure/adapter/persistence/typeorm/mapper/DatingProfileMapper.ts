import { DatingProfile } from '@core/domain/dating/entity/DatingProfile';
import { TypeOrmDatingProfile } from '../entity/dating/TypeOrmDatingProfile';

export class DatingProfileMapper {
  public static toDomain(ormEntity: TypeOrmDatingProfile): DatingProfile {
    return new DatingProfile({
      id: ormEntity.id,
      customerId: ormEntity.customer_id,
      displayName: ormEntity.display_name,
      bio: ormEntity.bio,
      age: ormEntity.age,
      gender: ormEntity.gender,
      interestedIn: ormEntity.interested_in,
      location: ormEntity.location,
      photos: ormEntity.photos,
      interests: ormEntity.interests,
      occupation: ormEntity.occupation || undefined,
      education: ormEntity.education || undefined,
      height: ormEntity.height || undefined,
      lookingFor: ormEntity.looking_for,
      isActive: ormEntity.is_active,
      isVerified: ormEntity.is_verified,
      isPremium: ormEntity.is_premium,
      lastActiveAt: ormEntity.last_active_at,
      createdAt: ormEntity.created_at,
      updatedAt: ormEntity.updated_at,
    });
  }

  public static toOrm(domainEntity: DatingProfile): TypeOrmDatingProfile {
    const ormEntity = new TypeOrmDatingProfile();
    ormEntity.id = domainEntity.getId();
    ormEntity.customer_id = domainEntity.getCustomerId();
    ormEntity.display_name = domainEntity.getDisplayName();
    ormEntity.bio = domainEntity.getBio();
    ormEntity.age = domainEntity.getAge();
    ormEntity.gender = domainEntity.getGender();
    ormEntity.interested_in = domainEntity.getInterestedIn();
    ormEntity.location = domainEntity.getLocation();
    ormEntity.photos = domainEntity.getPhotos();
    ormEntity.interests = domainEntity.getInterests();
    ormEntity.occupation = domainEntity.getOccupation() || null;
    ormEntity.education = domainEntity.getEducation() || null;
    ormEntity.height = domainEntity.getHeight() || null;
    ormEntity.looking_for = domainEntity.getLookingFor();
    ormEntity.is_active = domainEntity.isProfileActive();
    ormEntity.is_verified = domainEntity.isProfileVerified();
    ormEntity.is_premium = domainEntity.isProfilePremium();
    ormEntity.last_active_at = domainEntity.getLastActiveAt();
    ormEntity.created_at = domainEntity.getCreatedAt();
    ormEntity.updated_at = domainEntity.getUpdatedAt();
    return ormEntity;
  }
}
