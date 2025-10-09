import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatingSettings } from '@core/domain/dating/entity/DatingSettings';
import { DatingSettingsRepositoryPort } from '@core/domain/dating/port/DatingSettingsRepositoryPort';
import { TypeOrmDatingSettings } from '../entity/dating/TypeOrmDatingSettings';
import { DatingSettingsMapper } from '../mapper/DatingSettingsMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class DatingSettingsRepositoryAdapter implements DatingSettingsRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmDatingSettings)
    private readonly repository: Repository<TypeOrmDatingSettings>,
  ) {}

  async save(settings: DatingSettings): Promise<DatingSettings> {
    if (!settings.getId()) {
      (settings as any).id = uuidv7();
    }

    const ormEntity = DatingSettingsMapper.toOrm(settings);
    const saved = await this.repository.save(ormEntity);
    return DatingSettingsMapper.toDomain(saved);
  }

  async findByCustomerId(customerId: string): Promise<Nullable<DatingSettings>> {
    const ormEntity = await this.repository.findOne({
      where: { customer_id: customerId },
    });
    return ormEntity ? DatingSettingsMapper.toDomain(ormEntity) : null;
  }

  async update(settings: DatingSettings): Promise<DatingSettings> {
    const ormEntity = DatingSettingsMapper.toOrm(settings);
    const updated = await this.repository.save(ormEntity);
    return DatingSettingsMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

