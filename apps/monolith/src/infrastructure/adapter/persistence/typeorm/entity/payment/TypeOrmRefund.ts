import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, Index } from 'typeorm';
import { RefundStatus } from '@core/domain/payment/entity/Refund';

@Entity('refunds')
export class TypeOrmRefund {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36 })
  @Index()
  payment_id: string;

  @Column('varchar', { length: 36 })
  @Index()
  user_id: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column('varchar', { length: 3 })
  currency: string;

  @Column({
    type: 'enum',
    enum: RefundStatus,
    default: RefundStatus.PENDING,
  })
  status: RefundStatus;

  @Column('text', { nullable: true })
  reason: string | null;

  @Column('varchar', { length: 255, nullable: true })
  stripe_refund_id: string | null;

  @Column('timestamp', { nullable: true })
  processed_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
