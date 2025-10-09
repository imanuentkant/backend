import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TypeOrmProperty } from '../property/TypeOrmProperty';
import { TypeOrmUser } from '../user/TypeOrmUser';

@Entity('bookings')
export class TypeOrmBooking {
  
  @PrimaryColumn('uuid')
  id: string;
  
  @Column('uuid', { name: 'property_id' })
  propertyId: string;
  
  @Column('uuid', { name: 'guest_id' })
  guestId: string;
  
  @Column('date', { name: 'check_in_date' })
  checkInDate: Date;
  
  @Column('date', { name: 'check_out_date' })
  checkOutDate: Date;
  
  @Column('int', { name: 'number_of_guests' })
  numberOfGuests: number;
  
  @Column('int', { name: 'total_nights' })
  totalNights: number;
  
  @Column('decimal', { precision: 10, scale: 2, name: 'price_per_night' })
  pricePerNight: number;
  
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;
  
  @Column('decimal', { precision: 10, scale: 2, name: 'cleaning_fee' })
  cleaningFee: number;
  
  @Column('decimal', { precision: 10, scale: 2, name: 'service_fee' })
  serviceFee: number;
  
  @Column('decimal', { precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: number;
  
  @Column('varchar', { length: 3, default: 'USD' })
  currency: string;
  
  @Column('varchar', { length: 20, default: 'pending' })
  status: string;
  
  @Column('varchar', { length: 20, name: 'cancellation_policy', default: 'flexible' })
  cancellationPolicy: string;
  
  @Column('text', { name: 'special_requests', nullable: true })
  specialRequests: string | null;
  
  @Column('text', { name: 'cancellation_reason', nullable: true })
  cancellationReason: string | null;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  
  @Column('timestamp', { name: 'confirmed_at', nullable: true })
  confirmedAt: Date | null;
  
  @Column('timestamp', { name: 'cancelled_at', nullable: true })
  cancelledAt: Date | null;
  
  // Relations
  @ManyToOne(() => TypeOrmProperty)
  @JoinColumn({ name: 'property_id' })
  property: TypeOrmProperty;
  
  @ManyToOne(() => TypeOrmUser)
  @JoinColumn({ name: 'guest_id' })
  guest: TypeOrmUser;
}

