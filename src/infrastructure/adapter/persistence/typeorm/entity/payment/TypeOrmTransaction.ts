import { Entity, Column, CreateDateColumn, PrimaryColumn, Index } from 'typeorm';
import { TransactionType, TransactionStatus } from '@core/domain/payment/entity/Transaction';

@Entity('transactions')
export class TypeOrmTransaction {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36 })
  @Index()
  user_id: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column('varchar', { length: 3 })
  currency: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
  })
  status: TransactionStatus;

  @Column('text')
  description: string;

  @Column('varchar', { length: 36 })
  related_entity_id: string;

  @Column('varchar', { length: 20 })
  related_entity_type: 'payment' | 'refund' | 'payout';

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @Column('timestamp')
  @Index()
  date: Date;

  @CreateDateColumn()
  created_at: Date;
}
