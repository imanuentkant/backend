import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Gender, LookingFor } from '@core/domain/dating/entity/DatingProfile';

@Entity('dating_profiles')
export class TypeOrmDatingProfile {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36 })
  @Index()
  customer_id: string;

  @Column('varchar', { length: 100 })
  display_name: string;

  @Column('text')
  bio: string;

  @Column('integer')
  age: number;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column('json')
  interested_in: Gender[];

  @Column('json')
  location: {
    city: string;
    state: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };

  @Column('json')
  photos: string[];

  @Column('json')
  interests: string[];

  @Column('varchar', { length: 100, nullable: true })
  occupation: string | null;

  @Column('varchar', { length: 100, nullable: true })
  education: string | null;

  @Column('integer', { nullable: true })
  height: number | null;

  @Column({
    type: 'enum',
    enum: LookingFor,
    default: LookingFor.RELATIONSHIP,
  })
  looking_for: LookingFor;

  @Column('boolean', { default: true })
  @Index()
  is_active: boolean;

  @Column('boolean', { default: false })
  is_verified: boolean;

  @Column('boolean', { default: false })
  is_premium: boolean;

  @Column('timestamp')
  last_active_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
