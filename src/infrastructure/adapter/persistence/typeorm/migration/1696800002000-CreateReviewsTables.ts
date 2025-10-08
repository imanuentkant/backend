import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateReviewsTables1696800002000 implements MigrationInterface {
  
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create reviews table
    await queryRunner.createTable(
      new Table({
        name: 'reviews',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'booking_id',
            type: 'uuid',
          },
          {
            name: 'property_id',
            type: 'uuid',
          },
          {
            name: 'reviewer_id',
            type: 'uuid',
          },
          {
            name: 'reviewee_id',
            type: 'uuid',
          },
          {
            name: 'rating_overall',
            type: 'decimal',
            precision: 2,
            scale: 1,
          },
          {
            name: 'rating_cleanliness',
            type: 'decimal',
            precision: 2,
            scale: 1,
          },
          {
            name: 'rating_accuracy',
            type: 'decimal',
            precision: 2,
            scale: 1,
          },
          {
            name: 'rating_checkin',
            type: 'decimal',
            precision: 2,
            scale: 1,
          },
          {
            name: 'rating_communication',
            type: 'decimal',
            precision: 2,
            scale: 1,
          },
          {
            name: 'rating_location',
            type: 'decimal',
            precision: 2,
            scale: 1,
          },
          {
            name: 'rating_value',
            type: 'decimal',
            precision: 2,
            scale: 1,
          },
          {
            name: 'comment',
            type: 'text',
          },
          {
            name: 'response',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'is_published',
            type: 'boolean',
            default: false,
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
            name: 'published_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );
    
    // Add foreign keys
    await queryRunner.createForeignKey(
      'reviews',
      new TableForeignKey({
        columnNames: ['booking_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bookings',
        onDelete: 'CASCADE',
      }),
    );
    
    await queryRunner.createForeignKey(
      'reviews',
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
        'reviews',
        new TableForeignKey({
          columnNames: ['reviewer_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );
      
      await queryRunner.createForeignKey(
        'reviews',
        new TableForeignKey({
          columnNames: ['reviewee_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );
    }
    
    // Create indexes
    await queryRunner.createIndex(
      'reviews',
      new TableIndex({
        name: 'IDX_reviews_property_id',
        columnNames: ['property_id'],
      }),
    );
    
    await queryRunner.createIndex(
      'reviews',
      new TableIndex({
        name: 'IDX_reviews_reviewer_id',
        columnNames: ['reviewer_id'],
      }),
    );
    
    await queryRunner.createIndex(
      'reviews',
      new TableIndex({
        name: 'IDX_reviews_booking_id',
        columnNames: ['booking_id'],
        isUnique: true,
      }),
    );
    
    await queryRunner.createIndex(
      'reviews',
      new TableIndex({
        name: 'IDX_reviews_is_published',
        columnNames: ['is_published'],
      }),
    );
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reviews');
  }
}

