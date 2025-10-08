import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateVehiclesTables1696800003000 implements MigrationInterface {
  
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create vehicles table
    await queryRunner.createTable(
      new Table({
        name: 'vehicles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'owner_id',
            type: 'uuid',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'vehicle_type',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'brand',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'model',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'year',
            type: 'int',
          },
          {
            name: 'license_plate',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'color',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'seats',
            type: 'int',
          },
          {
            name: 'transmission_type',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'fuel_type',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'condition',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'mileage',
            type: 'int',
          },
          {
            name: 'price_per_day',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'price_per_hour',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '3',
            default: "'USD'",
          },
          {
            name: 'security_deposit',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'insurance_fee',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'location',
            type: 'text',
          },
          {
            name: 'latitude',
            type: 'decimal',
            precision: 10,
            scale: 8,
            isNullable: true,
          },
          {
            name: 'longitude',
            type: 'decimal',
            precision: 11,
            scale: 8,
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'available'",
          },
          {
            name: 'instant_booking',
            type: 'boolean',
            default: false,
          },
          {
            name: 'features',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'cover_photo_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
    
    // Create vehicle_photos table
    await queryRunner.createTable(
      new Table({
        name: 'vehicle_photos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'vehicle_id',
            type: 'uuid',
          },
          {
            name: 'media_id',
            type: 'uuid',
          },
          {
            name: 'is_cover',
            type: 'boolean',
            default: false,
          },
          {
            name: 'order_index',
            type: 'int',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
    
    // Add foreign keys
    const hasUsersTable = await queryRunner.hasTable('users');
    if (hasUsersTable) {
      await queryRunner.createForeignKey(
        'vehicles',
        new TableForeignKey({
          columnNames: ['owner_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );
    }
    
    await queryRunner.createForeignKey(
      'vehicle_photos',
      new TableForeignKey({
        columnNames: ['vehicle_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'vehicles',
        onDelete: 'CASCADE',
      }),
    );
    
    // Create indexes
    await queryRunner.createIndex(
      'vehicles',
      new TableIndex({
        name: 'IDX_vehicles_owner_id',
        columnNames: ['owner_id'],
      }),
    );
    
    await queryRunner.createIndex(
      'vehicles',
      new TableIndex({
        name: 'IDX_vehicles_vehicle_type',
        columnNames: ['vehicle_type'],
      }),
    );
    
    await queryRunner.createIndex(
      'vehicles',
      new TableIndex({
        name: 'IDX_vehicles_status',
        columnNames: ['status'],
      }),
    );
    
    await queryRunner.createIndex(
      'vehicles',
      new TableIndex({
        name: 'IDX_vehicles_location',
        columnNames: ['location'],
      }),
    );
    
    // Create geospatial index for lat/lng
    await queryRunner.query(`
      CREATE INDEX IDX_vehicles_coordinates 
      ON vehicles (latitude, longitude);
    `);
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('vehicle_photos');
    await queryRunner.dropTable('vehicles');
  }
}

