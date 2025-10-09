import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyPhotoRepositoryPort } from '@core/domain/property/port/PropertyPhotoRepositoryPort';
import { PropertyPhoto } from '@core/domain/property/entity/PropertyPhoto';
import { TypeOrmPropertyPhoto } from '../entity/property/TypeOrmPropertyPhoto';
import { PropertyPhotoMapper } from '../mapper/PropertyPhotoMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

@Injectable()
export class PropertyPhotoRepositoryAdapter implements PropertyPhotoRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmPropertyPhoto)
    private readonly repository: Repository<TypeOrmPropertyPhoto>,
  ) {}

  public async save(photo: PropertyPhoto): Promise<PropertyPhoto> {
    let id = photo.getId();
    if (!id) {
      id = UuidGenerator.generate();
    }
    const photoWithId = new PropertyPhoto({
      id,
      propertyId: photo.getPropertyId(),
      mediaId: photo.getMediaId(),
      url: photo.getUrl(),
      isCover: photo.getIsCover(),
      orderIndex: photo.getOrderIndex(),
      caption: photo.getCaption(),
      createdAt: photo.getCreatedAt(),
      updatedAt: photo.getUpdatedAt(),
    });

    const ormEntity = PropertyPhotoMapper.toOrm(photoWithId);
    const saved = await this.repository.save(ormEntity);
    return PropertyPhotoMapper.toDomain(saved);
  }

  public async findById(id: string): Promise<Nullable<PropertyPhoto>> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? PropertyPhotoMapper.toDomain(ormEntity) : null;
  }

  public async findByPropertyId(propertyId: string): Promise<PropertyPhoto[]> {
    const ormEntities = await this.repository.find({
      where: { property_id: propertyId },
      order: { order_index: 'ASC' },
    });
    return ormEntities.map((entity) => PropertyPhotoMapper.toDomain(entity));
  }

  public async update(photo: PropertyPhoto): Promise<PropertyPhoto> {
    const ormEntity = PropertyPhotoMapper.toOrm(photo);
    const saved = await this.repository.save(ormEntity);
    return PropertyPhotoMapper.toDomain(saved);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async setCover(propertyId: string, photoId: string): Promise<void> {
    // First, unset all covers for this property
    await this.repository.update(
      { property_id: propertyId },
      { is_cover: false },
    );

    // Then set the new cover
    await this.repository.update(
      { id: photoId, property_id: propertyId },
      { is_cover: true },
    );
  }

  public async reorder(propertyId: string, photoIds: string[]): Promise<void> {
    // Update order_index based on array position
    for (let i = 0; i < photoIds.length; i++) {
      await this.repository.update(
        { id: photoIds[i], property_id: propertyId },
        { order_index: i },
      );
    }
  }
}