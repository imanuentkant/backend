import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('subscriptions')
@Index(['customerId'])
@Index(['status'])
export class TypeOrmSubscription {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36, name: 'customer_id', unique: true })
  customerId: string;

  @Column('varchar', { length: 20, name: 'plan' })
  plan: string;

  @Column('varchar', { length: 20, name: 'status' })
  status: string;

  @Column('timestamp', { name: 'start_date' })
  startDate: Date;

  @Column('timestamp', { name: 'end_date' })
  endDate: Date;

  @Column('boolean', { name: 'auto_renew', default: true })
  autoRenew: boolean;

  @Column('varchar', { length: 100, name: 'stripe_subscription_id', nullable: true })
  stripeSubscriptionId: string | null;

  @Column('varchar', { length: 100, name: 'stripe_customer_id', nullable: true })
  stripeCustomerId: string | null;

  @Column('timestamp', { name: 'cancelled_at', nullable: true })
  cancelledAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}

