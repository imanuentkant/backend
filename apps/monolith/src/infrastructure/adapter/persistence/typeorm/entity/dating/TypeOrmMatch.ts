import { Entity, Column, PrimaryColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('matches')
@Index(['customer1_id', 'customer2_id'], { unique: true })
export class TypeOrmMatch {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36 })
  @Index()
  customer1_id: string;

  @Column('varchar', { length: 36 })
  @Index()
  customer2_id: string;

  @Column('varchar', { length: 36 })
  profile1_id: string;

  @Column('varchar', { length: 36 })
  profile2_id: string;

  @Column('varchar', { length: 36, nullable: true })
  conversation_id: string | null;

  @Column('timestamp')
  matched_at: Date;

  @Column('timestamp', { nullable: true })
  last_interaction_at: Date | null;

  @Column('boolean', { default: true })
  @Index()
  is_active: boolean;

  @Column('varchar', { length: 36, nullable: true })
  unmatched_by: string | null;

  @Column('timestamp', { nullable: true })
  unmatched_at: Date | null;
}
