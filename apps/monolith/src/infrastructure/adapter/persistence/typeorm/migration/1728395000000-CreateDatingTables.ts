import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateDatingTables1728395000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create dating_profiles table
    await queryRunner.createTable(
      new Table({
        name: 'dating_profiles',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'customer_id', type: 'varchar', length: '36' },
          { name: 'display_name', type: 'varchar', length: '100' },
          { name: 'bio', type: 'text' },
          { name: 'age', type: 'integer' },
          { name: 'gender', type: 'varchar', length: '20' },
          { name: 'interested_in', type: 'json' },
          { name: 'location', type: 'json' },
          { name: 'photos', type: 'json' },
          { name: 'interests', type: 'json' },
          { name: 'occupation', type: 'varchar', length: '100', isNullable: true },
          { name: 'education', type: 'varchar', length: '100', isNullable: true },
          { name: 'height', type: 'integer', isNullable: true },
          { name: 'looking_for', type: 'varchar', length: '20', default: "'relationship'" },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'is_verified', type: 'boolean', default: false },
          { name: 'is_premium', type: 'boolean', default: false },
          { name: 'last_active_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    await queryRunner.createIndex('dating_profiles', new TableIndex({
      name: 'IDX_dating_profiles_customer_id',
      columnNames: ['customer_id'],
    }));

    await queryRunner.createIndex('dating_profiles', new TableIndex({
      name: 'IDX_dating_profiles_is_active',
      columnNames: ['is_active'],
    }));

    // Create swipes table
    await queryRunner.createTable(
      new Table({
        name: 'swipes',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'from_customer_id', type: 'varchar', length: '36' },
          { name: 'to_profile_id', type: 'varchar', length: '36' },
          { name: 'action', type: 'varchar', length: '20' },
          { name: 'is_super_like', type: 'boolean', default: false },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    await queryRunner.createIndex('swipes', new TableIndex({
      name: 'IDX_swipes_from_customer_id',
      columnNames: ['from_customer_id'],
    }));

    await queryRunner.createIndex('swipes', new TableIndex({
      name: 'IDX_swipes_to_profile_id',
      columnNames: ['to_profile_id'],
    }));

    await queryRunner.createIndex('swipes', new TableIndex({
      name: 'IDX_swipes_from_to_unique',
      columnNames: ['from_customer_id', 'to_profile_id'],
      isUnique: true,
    }));

    // Create matches table
    await queryRunner.createTable(
      new Table({
        name: 'matches',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'customer1_id', type: 'varchar', length: '36' },
          { name: 'customer2_id', type: 'varchar', length: '36' },
          { name: 'profile1_id', type: 'varchar', length: '36' },
          { name: 'profile2_id', type: 'varchar', length: '36' },
          { name: 'conversation_id', type: 'varchar', length: '36', isNullable: true },
          { name: 'matched_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'last_interaction_at', type: 'timestamp', isNullable: true },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'unmatched_by', type: 'varchar', length: '36', isNullable: true },
          { name: 'unmatched_at', type: 'timestamp', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createIndex('matches', new TableIndex({
      name: 'IDX_matches_customer1_id',
      columnNames: ['customer1_id'],
    }));

    await queryRunner.createIndex('matches', new TableIndex({
      name: 'IDX_matches_customer2_id',
      columnNames: ['customer2_id'],
    }));

    await queryRunner.createIndex('matches', new TableIndex({
      name: 'IDX_matches_is_active',
      columnNames: ['is_active'],
    }));

    await queryRunner.createIndex('matches', new TableIndex({
      name: 'IDX_matches_customers_unique',
      columnNames: ['customer1_id', 'customer2_id'],
      isUnique: true,
    }));

    // Create date_proposals table
    await queryRunner.createTable(
      new Table({
        name: 'date_proposals',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'match_id', type: 'varchar', length: '36' },
          { name: 'proposed_by', type: 'varchar', length: '36' },
          { name: 'proposed_to', type: 'varchar', length: '36' },
          { name: 'proposed_date', type: 'timestamp' },
          { name: 'location', type: 'json' },
          { name: 'activity', type: 'varchar', length: '100' },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'status', type: 'varchar', length: '20', default: "'pending'" },
          { name: 'responded_at', type: 'timestamp', isNullable: true },
          { name: 'response_message', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    await queryRunner.createIndex('date_proposals', new TableIndex({
      name: 'IDX_date_proposals_match_id',
      columnNames: ['match_id'],
    }));

    await queryRunner.createIndex('date_proposals', new TableIndex({
      name: 'IDX_date_proposals_proposed_by',
      columnNames: ['proposed_by'],
    }));

    await queryRunner.createIndex('date_proposals', new TableIndex({
      name: 'IDX_date_proposals_proposed_to',
      columnNames: ['proposed_to'],
    }));

    await queryRunner.createIndex('date_proposals', new TableIndex({
      name: 'IDX_date_proposals_status',
      columnNames: ['status'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('date_proposals');
    await queryRunner.dropTable('matches');
    await queryRunner.dropTable('swipes');
    await queryRunner.dropTable('dating_profiles');
  }
}
