import { Entity, Column, PrimaryColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('boosts')
@Index(['customerId', 'isActive'])
@Index(['expiresAt'])
export class TypeOrmBoost {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36, name: 'customer_id' })
  customerId: string;

  @Column('timestamp', { name: 'started_at' })
  startedAt: Date;

  @Column('timestamp', { name: 'expires_at' })
  expiresAt: Date;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}

