import { Entity, Column, PrimaryColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('dating_settings')
export class TypeOrmDatingSettings {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36 })
  @Index({ unique: true })
  customer_id: string;

  @Column('integer', { default: 50 })
  max_distance: number;

  @Column('integer', { default: 18 })
  age_min: number;

  @Column('integer', { default: 99 })
  age_max: number;

  @Column('boolean', { default: true })
  show_distance: boolean;

  @Column('boolean', { default: true })
  show_age: boolean;

  @Column('boolean', { default: false })
  only_show_verified: boolean;

  @UpdateDateColumn()
  updated_at: Date;
}

