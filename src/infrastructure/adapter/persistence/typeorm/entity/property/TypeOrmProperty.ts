import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { TypeOrmUser } from '@infrastructure/adapter/persistence/typeorm/entity/user/TypeOrmUser';

@Entity('properties')
export class TypeOrmProperty {
  
  @PrimaryColumn('uuid')
  id: string;
  
  @Column('uuid', { name: 'host_id' })
  hostId: string;
  
  @Column('varchar', { length: 255 })
  title: string;
  
  @Column('text')
  description: string;
  
  @Column('varchar', { length: 50, name: 'property_type' })
  propertyType: string;
  
  @Column('int', { name: 'max_guests' })
  maxGuests: number;
  
  @Column('int')
  bedrooms: number;
  
  @Column('int')
  beds: number;
  
  @Column('decimal', { precision: 3, scale: 1 })
  bathrooms: number;
  
  @Column('decimal', { precision: 10, scale: 2, name: 'price_per_night' })
  pricePerNight: number;
  
  @Column('varchar', { length: 3, default: 'USD' })
  currency: string;
  
  @Column('decimal', { precision: 10, scale: 2, name: 'cleaning_fee', default: 0 })
  cleaningFee: number;
  
  @Column('decimal', { precision: 5, scale: 2, name: 'service_fee_percentage', default: 14 })
  serviceFeePercentage: number;
  
  @Column('int', { name: 'minimum_nights', default: 1 })
  minimumNights: number;
  
  @Column('int', { name: 'maximum_nights', default: 365 })
  maximumNights: number;
  
  @Column('boolean', { name: 'instant_booking', default: false })
  instantBooking: boolean;
  
  @Column('varchar', { length: 20, default: 'draft' })
  status: string;
  
  @Column('uuid', { name: 'cover_photo_id', nullable: true })
  coverPhotoId: string | null;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  
  @Column('timestamp', { name: 'removed_at', nullable: true })
  removedAt: Date | null;
  
  // Relations
  @ManyToOne(() => TypeOrmUser)
  @JoinColumn({ name: 'host_id' })
  host: TypeOrmUser;
}

