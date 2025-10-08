import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '@core/domain/review/entity/Review';
import { ReviewRepositoryPort } from '@core/domain/review/port/ReviewRepositoryPort';
import { TypeOrmReview } from '../entity/review/TypeOrmReview';
import { ReviewMapper } from '../mapper/ReviewMapper';
import { Optional } from '@core/common/type/CommonTypes';

@Injectable()
export class ReviewRepositoryAdapter implements ReviewRepositoryPort {
  
  constructor(
    @InjectRepository(TypeOrmReview)
    private readonly reviewRepo: Repository<TypeOrmReview>,
  ) {}
  
  async findById(id: string): Promise<Optional<Review>> {
    const orm = await this.reviewRepo.findOne({ 
      where: { id },
      relations: ['reviewer', 'property', 'booking']
    });
    return orm ? ReviewMapper.toDomain(orm) : undefined;
  }
  
  async findByPropertyId(propertyId: string, onlyPublished: boolean = true): Promise<Review[]> {
    const where: any = { propertyId };
    if (onlyPublished) where.isPublished = true;
    
    const orms = await this.reviewRepo.find({ 
      where,
      relations: ['reviewer'],
      order: { createdAt: 'DESC' }
    });
    
    return orms.map(orm => ReviewMapper.toDomain(orm));
  }
  
  async findByReviewerId(reviewerId: string): Promise<Review[]> {
    const orms = await this.reviewRepo.find({ 
      where: { reviewerId },
      relations: ['property'],
      order: { createdAt: 'DESC' }
    });
    
    return orms.map(orm => ReviewMapper.toDomain(orm));
  }
  
  async findByBookingId(bookingId: string): Promise<Optional<Review>> {
    const orm = await this.reviewRepo.findOne({ 
      where: { bookingId },
      relations: ['reviewer', 'property']
    });
    return orm ? ReviewMapper.toDomain(orm) : undefined;
  }
  
  async save(review: Review): Promise<Review> {
    const orm = ReviewMapper.toOrm(review);
    const saved = await this.reviewRepo.save(orm);
    return ReviewMapper.toDomain(saved);
  }
  
  async delete(id: string): Promise<boolean> {
    const result = await this.reviewRepo.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
  
  async getAverageRating(propertyId: string): Promise<number> {
    const result = await this.reviewRepo
      .createQueryBuilder('r')
      .select('AVG(r.rating_overall)', 'avg')
      .where('r.property_id = :propertyId', { propertyId })
      .andWhere('r.is_published = :published', { published: true })
      .getRawOne();
    
    return Number(result?.avg || 0);
  }
  
  async getRatingBreakdown(propertyId: string): Promise<{
    cleanliness: number;
    accuracy: number;
    checkin: number;
    communication: number;
    location: number;
    value: number;
  }> {
    const result = await this.reviewRepo
      .createQueryBuilder('r')
      .select([
        'AVG(r.rating_cleanliness) as cleanliness',
        'AVG(r.rating_accuracy) as accuracy',
        'AVG(r.rating_checkin) as checkin',
        'AVG(r.rating_communication) as communication',
        'AVG(r.rating_location) as location',
        'AVG(r.rating_value) as value',
      ])
      .where('r.property_id = :propertyId', { propertyId })
      .andWhere('r.is_published = :published', { published: true })
      .getRawOne();
    
    return {
      cleanliness: Number(result?.cleanliness || 0),
      accuracy: Number(result?.accuracy || 0),
      checkin: Number(result?.checkin || 0),
      communication: Number(result?.communication || 0),
      location: Number(result?.location || 0),
      value: Number(result?.value || 0),
    };
  }
  
  async countByProperty(propertyId: string, onlyPublished: boolean = true): Promise<number> {
    const where: any = { propertyId };
    if (onlyPublished) where.isPublished = true;
    return this.reviewRepo.count({ where });
  }
}

