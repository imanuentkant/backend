import { Entity, Column, PrimaryColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('blocked_users')
@Index(['blocker_id', 'blocked_id'], { unique: true })
export class TypeOrmBlockedUser {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36 })
  @Index()
  blocker_id: string;

  @Column('varchar', { length: 36 })
  @Index()
  blocked_id: string;

  @Column('varchar', { length: 100 })
  reason: string;

  @CreateDateColumn()
  created_at: Date;
}

