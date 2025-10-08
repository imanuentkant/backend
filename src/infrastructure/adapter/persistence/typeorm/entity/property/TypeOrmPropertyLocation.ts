import { Column, Entity, PrimaryColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { TypeOrmProperty } from './TypeOrmProperty';

@Entity('property_locations')
export class TypeOrmPropertyLocation {
  
  @PrimaryColumn('uuid')
  id: string;
  
  @Column('uuid', { name: 'property_id' })
  propertyId: string;
  
  @Column('text')
  address: string;
  
  @Column('varchar', { length: 100 })
  city: string;
  
  @Column('varchar', { length: 100 })
  state: string;
  
  @Column('varchar', { length: 100 })
  country: string;
  
  @Column('varchar', { length: 20, name: 'postal_code' })
  postalCode: string;
  
  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;
  
  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  // Relations
  @OneToOne(() => TypeOrmProperty)
  @JoinColumn({ name: 'property_id' })
  property: TypeOrmProperty;
}

