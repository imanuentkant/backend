import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, Index } from 'typeorm';
import { PayoutStatus } from '@core/domain/payment/entity/Payout';

@Entity('payouts')
export class TypeOrmPayout {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36 })
  @Index()
  host_id: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column('varchar', { length: 3 })
  currency: string;

  @Column({
    type: 'enum',
    enum: PayoutStatus,
    default: PayoutStatus.PENDING,
  })
  @Index()
  status: PayoutStatus;

  @Column('text')
  description: string;

  @Column('json')
  booking_ids: string[];

  @Column('timestamp', { nullable: true })
  expected_arrival_date: Date | null;

  @Column('timestamp', { nullable: true })
  paid_at: Date | null;

  @Column('varchar', { length: 255, nullable: true })
  stripe_payout_id: string | null;

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
