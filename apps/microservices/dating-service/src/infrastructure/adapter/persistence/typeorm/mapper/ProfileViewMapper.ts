import { ProfileView } from '@core/domain/dating/entity/ProfileView';
import { TypeOrmProfileView } from '../entity/dating/TypeOrmProfileView';

export class ProfileViewMapper {
  public static toDomain(ormView: TypeOrmProfileView): ProfileView {
    return new ProfileView({
      id: ormView.id,
      profileId: ormView.profileId,
      viewerId: ormView.viewerId,
      viewedAt: ormView.viewedAt,
      createdAt: ormView.createdAt,
    });
  }

  public static toORM(domainView: ProfileView): TypeOrmProfileView {
    const ormView = new TypeOrmProfileView();
    
    if (domainView.getId()) {
      ormView.id = domainView.getId();
    }
    
    ormView.profileId = domainView.getProfileId();
    ormView.viewerId = domainView.getViewerId();
    ormView.viewedAt = domainView.getViewedAt();
    ormView.createdAt = domainView.getCreatedAt();

    return ormView;
  }
}

