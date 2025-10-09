import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, Index } from 'typeorm';

@Entity('property_photos')
export class TypeOrmPropertyPhoto {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36 })
  @Index()
  property_id: string;

  @Column('varchar', { length: 36, nullable: true })
  media_id: string | null;

  @Column('text')
  url: string;

  @Column('boolean', { default: false })
  is_cover: boolean;

  @Column('integer', { default: 0 })
  order_index: number;

  @Column('text', { nullable: true })
  caption: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
