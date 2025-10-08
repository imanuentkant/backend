import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreatePropertiesTables1696800000000 implements MigrationInterface {
  
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create properties table
    await queryRunner.createTable(
      new Table({
        name: 'properties',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'host_id',
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
            name: 'property_type',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'max_guests',
            type: 'int',
          },
          {
            name: 'bedrooms',
            type: 'int',
          },
          {
            name: 'beds',
            type: 'int',
          },
          {
            name: 'bathrooms',
            type: 'decimal',
            precision: 3,
            scale: 1,
          },
          {
            name: 'price_per_night',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '3',
            default: "'USD'",
          },
          {
            name: 'cleaning_fee',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'service_fee_percentage',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 14,
          },
          {
            name: 'minimum_nights',
            type: 'int',
            default: 1,
          },
          {
            name: 'maximum_nights',
            type: 'int',
            default: 365,
          },
          {
            name: 'instant_booking',
            type: 'boolean',
            default: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'draft'",
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
          {
            name: 'removed_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );
    
    // Create property_locations table
    await queryRunner.createTable(
      new Table({
        name: 'property_locations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'property_id',
            type: 'uuid',
          },
          {
            name: 'address',
            type: 'text',
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'state',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'country',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'postal_code',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'latitude',
            type: 'decimal',
            precision: 10,
            scale: 8,
          },
          {
            name: 'longitude',
            type: 'decimal',
            precision: 11,
            scale: 8,
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
    
    // Create amenities table
    await queryRunner.createTable(
      new Table({
        name: 'amenities',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'icon',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'category',
            type: 'varchar',
            length: '50',
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
    
    // Create property_amenities junction table
    await queryRunner.createTable(
      new Table({
        name: 'property_amenities',
        columns: [
          {
            name: 'property_id',
            type: 'uuid',
          },
          {
            name: 'amenity_id',
            type: 'uuid',
          },
        ],
      }),
      true,
    );
    
    // Create property_photos table
    await queryRunner.createTable(
      new Table({
        name: 'property_photos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'property_id',
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
    
    // Add foreign keys (only if users table exists)
    const hasUsersTable = await queryRunner.hasTable('users');
    if (hasUsersTable) {
      await queryRunner.createForeignKey(
        'properties',
        new TableForeignKey({
          columnNames: ['host_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );
    }
    
    await queryRunner.createForeignKey(
      'property_locations',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'properties',
        onDelete: 'CASCADE',
      }),
    );
    
    await queryRunner.createForeignKey(
      'property_amenities',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'properties',
        onDelete: 'CASCADE',
      }),
    );
    
    await queryRunner.createForeignKey(
      'property_amenities',
      new TableForeignKey({
        columnNames: ['amenity_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'amenities',
        onDelete: 'CASCADE',
      }),
    );
    
    await queryRunner.createForeignKey(
      'property_photos',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'properties',
        onDelete: 'CASCADE',
      }),
    );
    
    // Create indexes
    await queryRunner.createIndex(
      'properties',
      new TableIndex({
        name: 'IDX_properties_host_id',
        columnNames: ['host_id'],
      }),
    );
    
    await queryRunner.createIndex(
      'properties',
      new TableIndex({
        name: 'IDX_properties_status',
        columnNames: ['status'],
      }),
    );
    
    await queryRunner.createIndex(
      'properties',
      new TableIndex({
        name: 'IDX_properties_property_type',
        columnNames: ['property_type'],
      }),
    );
    
    await queryRunner.createIndex(
      'property_locations',
      new TableIndex({
        name: 'IDX_property_locations_city',
        columnNames: ['city'],
      }),
    );
    
    await queryRunner.createIndex(
      'property_locations',
      new TableIndex({
        name: 'IDX_property_locations_country',
        columnNames: ['country'],
      }),
    );
    
    // Create geospatial index for lat/lng (PostgreSQL specific)
    await queryRunner.query(`
      CREATE INDEX IDX_property_locations_coordinates 
      ON property_locations (latitude, longitude);
    `);
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('property_photos');
    await queryRunner.dropTable('property_amenities');
    await queryRunner.dropTable('amenities');
    await queryRunner.dropTable('property_locations');
    await queryRunner.dropTable('properties');
  }
}

