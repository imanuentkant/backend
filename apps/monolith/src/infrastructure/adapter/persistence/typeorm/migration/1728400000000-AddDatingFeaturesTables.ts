import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class AddDatingFeaturesTables1728400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Profile Views Table
    await queryRunner.createTable(
      new Table({
        name: 'profile_views',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'profile_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'viewer_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'viewed_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
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

    await queryRunner.createIndex(
      'profile_views',
      new TableIndex({
        name: 'IDX_PROFILE_VIEWS_PROFILE_ID',
        columnNames: ['profile_id', 'viewed_at'],
      }),
    );

    await queryRunner.createIndex(
      'profile_views',
      new TableIndex({
        name: 'IDX_PROFILE_VIEWS_VIEWER_ID',
        columnNames: ['viewer_id'],
      }),
    );

    // Boosts Table
    await queryRunner.createTable(
      new Table({
        name: 'boosts',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'customer_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'started_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'expires_at',
            type: 'timestamp',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
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

    await queryRunner.createIndex(
      'boosts',
      new TableIndex({
        name: 'IDX_BOOSTS_CUSTOMER_ACTIVE',
        columnNames: ['customer_id', 'is_active'],
      }),
    );

    await queryRunner.createIndex(
      'boosts',
      new TableIndex({
        name: 'IDX_BOOSTS_EXPIRES_AT',
        columnNames: ['expires_at'],
      }),
    );

    // Subscriptions Table
    await queryRunner.createTable(
      new Table({
        name: 'subscriptions',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'customer_id',
            type: 'varchar',
            length: '36',
            isUnique: true,
          },
          {
            name: 'plan',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'start_date',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'end_date',
            type: 'timestamp',
          },
          {
            name: 'auto_renew',
            type: 'boolean',
            default: true,
          },
          {
            name: 'stripe_subscription_id',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'stripe_customer_id',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'cancelled_at',
            type: 'timestamp',
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
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'subscriptions',
      new TableIndex({
        name: 'IDX_SUBSCRIPTIONS_CUSTOMER_ID',
        columnNames: ['customer_id'],
      }),
    );

    await queryRunner.createIndex(
      'subscriptions',
      new TableIndex({
        name: 'IDX_SUBSCRIPTIONS_STATUS',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.dropTable('subscriptions', true);
    await queryRunner.dropTable('boosts', true);
    await queryRunner.dropTable('profile_views', true);
  }
}

