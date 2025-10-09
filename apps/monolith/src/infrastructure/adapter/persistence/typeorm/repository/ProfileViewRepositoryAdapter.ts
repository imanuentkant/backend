import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ProfileViewRepositoryPort } from '@core/domain/dating/port/ProfileViewRepositoryPort';
import { ProfileView } from '@core/domain/dating/entity/ProfileView';
import { TypeOrmProfileView } from '../entity/dating/TypeOrmProfileView';
import { ProfileViewMapper } from '../mapper/ProfileViewMapper';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class ProfileViewRepositoryAdapter implements ProfileViewRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmProfileView)
    private readonly repository: Repository<TypeOrmProfileView>,
  ) {}

  async save(view: ProfileView): Promise<ProfileView> {
    let ormView = ProfileViewMapper.toORM(view);
    
    if (!ormView.id) {
      ormView.id = uuidv7();
    }
    
    ormView = await this.repository.save(ormView);
    return ProfileViewMapper.toDomain(ormView);
  }

  async findByProfileId(profileId: string): Promise<ProfileView[]> {
    const ormViews = await this.repository.find({
      where: { profileId },
      order: { viewedAt: 'DESC' },
    });

    return ormViews.map(v => ProfileViewMapper.toDomain(v));
  }

  async countByProfileId(profileId: string): Promise<number> {
    return this.repository.count({
      where: { profileId },
    });
  }

  async countByProfileIdAndDateRange(
    profileId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return this.repository.count({
      where: {
        profileId,
        viewedAt: Between(startDate, endDate),
      },
    });
  }

  async getRecentViewers(profileId: string, limit: number): Promise<ProfileView[]> {
    const ormViews = await this.repository.find({
      where: { profileId },
      order: { viewedAt: 'DESC' },
      take: limit,
    });

    return ormViews.map(v => ProfileViewMapper.toDomain(v));
  }
}

