import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { VehicleType, VehicleStatus, TransmissionType, FuelType, VehicleCondition } from '@core/common/enums/VehicleEnums';

@Entity('vehicles')
export class TypeOrmVehicle {
  
  @PrimaryColumn({ type: 'uuid' })
  public id: string;
  
  @Column({ name: 'owner_id', type: 'uuid' })
  public ownerId: string;
  
  @Column({ type: 'varchar', length: 255 })
  public title: string;
  
  @Column({ type: 'text' })
  public description: string;
  
  @Column({ name: 'vehicle_type', type: 'varchar', length: 50 })
  public vehicleType: VehicleType;
  
  @Column({ type: 'varchar', length: 100 })
  public brand: string;
  
  @Column({ type: 'varchar', length: 100 })
  public model: string;
  
  @Column({ type: 'int' })
  public year: number;
  
  @Column({ name: 'license_plate', type: 'varchar', length: 50 })
  public licensePlate: string;
  
  @Column({ type: 'varchar', length: 50 })
  public color: string;
  
  @Column({ type: 'int' })
  public seats: number;
  
  @Column({ name: 'transmission_type', type: 'varchar', length: 20 })
  public transmissionType: TransmissionType;
  
  @Column({ name: 'fuel_type', type: 'varchar', length: 20 })
  public fuelType: FuelType;
  
  @Column({ type: 'varchar', length: 20 })
  public condition: VehicleCondition;
  
  @Column({ type: 'int' })
  public mileage: number;
  
  @Column({ name: 'price_per_day', type: 'decimal', precision: 10, scale: 2 })
  public pricePerDay: number;
  
  @Column({ name: 'price_per_hour', type: 'decimal', precision: 10, scale: 2, nullable: true })
  public pricePerHour: number | null;
  
  @Column({ type: 'varchar', length: 3, default: 'USD' })
  public currency: string;
  
  @Column({ name: 'security_deposit', type: 'decimal', precision: 10, scale: 2, default: 0 })
  public securityDeposit: number;
  
  @Column({ name: 'insurance_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  public insuranceFee: number;
  
  @Column({ type: 'text' })
  public location: string;
  
  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  public latitude: number | null;
  
  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  public longitude: number | null;
  
  @Column({ type: 'varchar', length: 20, default: 'available' })
  public status: VehicleStatus;
  
  @Column({ name: 'instant_booking', type: 'boolean', default: false })
  public instantBooking: boolean;
  
  @Column({ type: 'simple-array', nullable: true })
  public features: string;
  
  @Column({ name: 'cover_photo_id', type: 'uuid', nullable: true })
  public coverPhotoId: string | null;
  
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}

