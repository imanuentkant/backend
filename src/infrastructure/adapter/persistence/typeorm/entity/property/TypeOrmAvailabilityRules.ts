import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('availability_rules')
export class TypeOrmAvailabilityRules {
  @PrimaryColumn('varchar', { length: 36 })
  property_id: string;

  @Column('integer', { default: 1 })
  advance_notice_days: number;

  @Column('integer', { default: 1 })
  preparation_days: number;

  @Column('integer', { default: 12 })
  booking_window_months: number;

  @Column('json')
  check_in_days: number[];

  @Column('varchar', { length: 5, default: '14:00' })
  check_in_time_from: string;

  @Column('varchar', { length: 5, default: '22:00' })
  check_in_time_to: string;

  @Column('varchar', { length: 5, default: '12:00' })
  check_out_time: string;
}
