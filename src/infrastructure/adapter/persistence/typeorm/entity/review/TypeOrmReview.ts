import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TypeOrmBooking } from '../booking/TypeOrmBooking';
import { TypeOrmProperty } from '../property/TypeOrmProperty';
import { TypeOrmUser } from '../user/TypeOrmUser';

@Entity('reviews')
export class TypeOrmReview {
  
  @PrimaryColumn('uuid')
  id: string;
  
  @Column('uuid', { name: 'booking_id' })
  bookingId: string;
  
  @Column('uuid', { name: 'property_id' })
  propertyId: string;
  
  @Column('uuid', { name: 'reviewer_id' })
  reviewerId: string;
  
  @Column('uuid', { name: 'reviewee_id' })
  revieweeId: string;
  
  @Column('decimal', { precision: 2, scale: 1, name: 'rating_overall' })
  ratingOverall: number;
  
  @Column('decimal', { precision: 2, scale: 1, name: 'rating_cleanliness' })
  ratingCleanliness: number;
  
  @Column('decimal', { precision: 2, scale: 1, name: 'rating_accuracy' })
  ratingAccuracy: number;
  
  @Column('decimal', { precision: 2, scale: 1, name: 'rating_checkin' })
  ratingCheckin: number;
  
  @Column('decimal', { precision: 2, scale: 1, name: 'rating_communication' })
  ratingCommunication: number;
  
  @Column('decimal', { precision: 2, scale: 1, name: 'rating_location' })
  ratingLocation: number;
  
  @Column('decimal', { precision: 2, scale: 1, name: 'rating_value' })
  ratingValue: number;
  
  @Column('text')
  comment: string;
  
  @Column('text', { nullable: true })
  response: string | null;
  
  @Column('boolean', { name: 'is_published', default: false })
  isPublished: boolean;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  
  @Column('timestamp', { name: 'published_at', nullable: true })
  publishedAt: Date | null;
  
  // Relations
  @ManyToOne(() => TypeOrmBooking)
  @JoinColumn({ name: 'booking_id' })
  booking: TypeOrmBooking;
  
  @ManyToOne(() => TypeOrmProperty)
  @JoinColumn({ name: 'property_id' })
  property: TypeOrmProperty;
  
  @ManyToOne(() => TypeOrmUser)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: TypeOrmUser;
  
  @ManyToOne(() => TypeOrmUser)
  @JoinColumn({ name: 'reviewee_id' })
  reviewee: TypeOrmUser;
}

