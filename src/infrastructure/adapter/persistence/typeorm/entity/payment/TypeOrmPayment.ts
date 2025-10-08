import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, Index } from 'typeorm';
import { PaymentStatus } from '@core/common/enums/BookingEnums';

@Entity('payments')
export class TypeOrmPayment {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36 })
  @Index()
  booking_id: string;

  @Column('varchar', { length: 36 })
  @Index()
  user_id: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column('varchar', { length: 3 })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  @Index()
  status: PaymentStatus;

  @Column('varchar', { length: 50 })
  payment_method: string;

  @Column('varchar', { length: 255, nullable: true })
  @Index()
  stripe_payment_intent_id: string | null;

  @Column('json')
  breakdown: {
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    total: number;
    hostEarnings?: number;
    platformFee?: number;
  };

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @Column('timestamp', { nullable: true })
  completed_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
