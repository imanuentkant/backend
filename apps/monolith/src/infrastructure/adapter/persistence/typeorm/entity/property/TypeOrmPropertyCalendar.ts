import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('property_calendar')
@Index(['property_id', 'date'], { unique: true })
export class TypeOrmPropertyCalendar {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36 })
  @Index()
  property_id: string;

  @Column('date')
  @Index()
  date: Date;

  @Column('boolean', { default: true })
  is_available: boolean;

  @Column('decimal', { precision: 10, scale: 2 })
  price_per_night: number;

  @Column('varchar', { length: 20, default: 'available' })
  status: 'available' | 'booked' | 'blocked';

  @Column('varchar', { length: 255, nullable: true })
  block_reason: string | null;

  @Column('varchar', { length: 36, nullable: true })
  booking_id: string | null;
}
