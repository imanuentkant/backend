import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateBookingsTables1696800001000 implements MigrationInterface {
  
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create bookings table
    await queryRunner.createTable(
      new Table({
        name: 'bookings',
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
            name: 'guest_id',
            type: 'uuid',
          },
          {
            name: 'check_in_date',
            type: 'date',
          },
          {
            name: 'check_out_date',
            type: 'date',
          },
          {
            name: 'number_of_guests',
            type: 'int',
          },
          {
            name: 'total_nights',
            type: 'int',
          },
          {
            name: 'price_per_night',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'subtotal',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'cleaning_fee',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'service_fee',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'total_amount',
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
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'pending'",
          },
          {
            name: 'cancellation_policy',
            type: 'varchar',
            length: '20',
            default: "'flexible'",
          },
          {
            name: 'special_requests',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'cancellation_reason',
            type: 'text',
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
            name: 'confirmed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'cancelled_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );
    
    // Create booking_dates table (for availability tracking)
    await queryRunner.createTable(
      new Table({
        name: 'booking_dates',
        columns: [
          {
            name: 'property_id',
            type: 'uuid',
          },
          {
            name: 'date',
            type: 'date',
          },
          {
            name: 'booking_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'booked'",
          },
        ],
      }),
      true,
    );
    
    // Add foreign keys
    await queryRunner.createForeignKey(
      'bookings',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'properties',
        onDelete: 'CASCADE',
      }),
    );
    
    const hasUsersTable = await queryRunner.hasTable('users');
    if (hasUsersTable) {
      await queryRunner.createForeignKey(
        'bookings',
        new TableForeignKey({
          columnNames: ['guest_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );
    }
    
    await queryRunner.createForeignKey(
      'booking_dates',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'properties',
        onDelete: 'CASCADE',
      }),
    );
    
    await queryRunner.createForeignKey(
      'booking_dates',
      new TableForeignKey({
        columnNames: ['booking_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bookings',
        onDelete: 'CASCADE',
      }),
    );
    
    // Create indexes
    await queryRunner.createIndex(
      'bookings',
      new TableIndex({
        name: 'IDX_bookings_property_id',
        columnNames: ['property_id'],
      }),
    );
    
    await queryRunner.createIndex(
      'bookings',
      new TableIndex({
        name: 'IDX_bookings_guest_id',
        columnNames: ['guest_id'],
      }),
    );
    
    await queryRunner.createIndex(
      'bookings',
      new TableIndex({
        name: 'IDX_bookings_status',
        columnNames: ['status'],
      }),
    );
    
    await queryRunner.createIndex(
      'bookings',
      new TableIndex({
        name: 'IDX_bookings_check_in_date',
        columnNames: ['check_in_date'],
      }),
    );
    
    await queryRunner.createIndex(
      'booking_dates',
      new TableIndex({
        name: 'IDX_booking_dates_property_date',
        columnNames: ['property_id', 'date'],
        isUnique: true,
      }),
    );
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('booking_dates');
    await queryRunner.dropTable('bookings');
  }
}

