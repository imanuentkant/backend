import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class AddBlockAndReportTables1728396000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create blocked_users table
    await queryRunner.createTable(
      new Table({
        name: 'blocked_users',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'blocker_id', type: 'varchar', length: '36' },
          { name: 'blocked_id', type: 'varchar', length: '36' },
          { name: 'reason', type: 'varchar', length: '100' },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    await queryRunner.createIndex('blocked_users', new TableIndex({
      name: 'IDX_blocked_users_blocker',
      columnNames: ['blocker_id'],
    }));

    await queryRunner.createIndex('blocked_users', new TableIndex({
      name: 'IDX_blocked_users_blocked',
      columnNames: ['blocked_id'],
    }));

    await queryRunner.createIndex('blocked_users', new TableIndex({
      name: 'IDX_blocked_users_pair',
      columnNames: ['blocker_id', 'blocked_id'],
      isUnique: true,
    }));

    // Create user_reports table
    await queryRunner.createTable(
      new Table({
        name: 'user_reports',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'reporter_id', type: 'varchar', length: '36' },
          { name: 'reported_id', type: 'varchar', length: '36' },
          { name: 'reason', type: 'varchar', length: '50' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'status', type: 'varchar', length: '20', default: "'pending'" },
          { name: 'reviewed_by', type: 'varchar', length: '36', isNullable: true },
          { name: 'reviewed_at', type: 'timestamp', isNullable: true },
          { name: 'action_taken', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    await queryRunner.createIndex('user_reports', new TableIndex({
      name: 'IDX_user_reports_reporter',
      columnNames: ['reporter_id'],
    }));

    await queryRunner.createIndex('user_reports', new TableIndex({
      name: 'IDX_user_reports_reported',
      columnNames: ['reported_id'],
    }));

    await queryRunner.createIndex('user_reports', new TableIndex({
      name: 'IDX_user_reports_status',
      columnNames: ['status'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_reports');
    await queryRunner.dropTable('blocked_users');
  }
}

