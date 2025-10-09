import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatingProfile } from '@core/domain/dating/entity/DatingProfile';
import { DatingProfileRepositoryPort } from '@core/domain/dating/port/DatingProfileRepositoryPort';
import { TypeOrmDatingProfile } from '../entity/dating/TypeOrmDatingProfile';
import { DatingProfileMapper } from '../mapper/DatingProfileMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class DatingProfileRepositoryAdapter implements DatingProfileRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmDatingProfile)
    private readonly repository: Repository<TypeOrmDatingProfile>,
  ) {}

  async save(profile: DatingProfile): Promise<DatingProfile> {
    if (!profile.getId()) {
      (profile as any).id = uuidv7();
    }
    
    const ormEntity = DatingProfileMapper.toOrm(profile);
    const saved = await this.repository.save(ormEntity);
    return DatingProfileMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Nullable<DatingProfile>> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? DatingProfileMapper.toDomain(ormEntity) : null;
  }

  async findByCustomerId(customerId: string): Promise<Nullable<DatingProfile>> {
    const ormEntity = await this.repository.findOne({ 
      where: { customer_id: customerId } 
    });
    return ormEntity ? DatingProfileMapper.toDomain(ormEntity) : null;
  }

  async findNearbyProfiles(params: {
    customerId: string;
    latitude: number;
    longitude: number;
    maxDistance: number;
    ageMin?: number;
    ageMax?: number;
    gender?: string[];
    limit?: number;
  }): Promise<DatingProfile[]> {
    // Get customer's profile to exclude it
    const myProfile = await this.findByCustomerId(params.customerId);
    
    let query = this.repository
      .createQueryBuilder('profile')
      .where('profile.customer_id != :customerId', { customerId: params.customerId })
      .andWhere('profile.is_active = :isActive', { isActive: true });

    // Filter by gender preferences if provided
    if (params.gender && params.gender.length > 0) {
      query = query.andWhere('profile.gender IN (:...genders)', { genders: params.gender });
    }

    // Filter by age range if provided
    if (params.ageMin) {
      query = query.andWhere('profile.age >= :ageMin', { ageMin: params.ageMin });
    }
    if (params.ageMax) {
      query = query.andWhere('profile.age <= :ageMax', { ageMax: params.ageMax });
    }

    // Order by most recently active
    query = query.orderBy('profile.last_active_at', 'DESC');

    // Limit results
    if (params.limit) {
      query = query.limit(params.limit);
    }

    const ormEntities = await query.getMany();
    return ormEntities.map(e => DatingProfileMapper.toDomain(e));
  }

  async update(profile: DatingProfile): Promise<DatingProfile> {
    const ormEntity = DatingProfileMapper.toOrm(profile);
    const updated = await this.repository.save(ormEntity);
    return DatingProfileMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
