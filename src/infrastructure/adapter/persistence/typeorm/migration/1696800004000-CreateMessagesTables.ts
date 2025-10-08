import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateMessagesTables1696800004000 implements MigrationInterface {
  
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create conversations table
    await queryRunner.createTable(
      new Table({
        name: 'conversations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'bookable_type',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'bookable_id',
            type: 'uuid',
          },
          {
            name: 'property_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'guest_id',
            type: 'uuid',
          },
          {
            name: 'host_id',
            type: 'uuid',
          },
          {
            name: 'last_message_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'last_message_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'unread_count',
            type: 'int',
            default: 0,
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
    
    // Create messages table
    await queryRunner.createTable(
      new Table({
        name: 'messages',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'conversation_id',
            type: 'uuid',
          },
          {
            name: 'sender_id',
            type: 'uuid',
          },
          {
            name: 'receiver_id',
            type: 'uuid',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'attachment_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'is_read',
            type: 'boolean',
            default: false,
          },
          {
            name: 'read_at',
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
          },
        ],
      }),
      true,
    );
    
    // Add foreign keys
    const hasUsersTable = await queryRunner.hasTable('users');
    if (hasUsersTable) {
      await queryRunner.createForeignKey(
        'conversations',
        new TableForeignKey({
          columnNames: ['guest_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );
      
      await queryRunner.createForeignKey(
        'conversations',
        new TableForeignKey({
          columnNames: ['host_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );
      
      await queryRunner.createForeignKey(
        'messages',
        new TableForeignKey({
          columnNames: ['sender_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );
      
      await queryRunner.createForeignKey(
        'messages',
        new TableForeignKey({
          columnNames: ['receiver_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );
    }
    
    await queryRunner.createForeignKey(
      'messages',
      new TableForeignKey({
        columnNames: ['conversation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'conversations',
        onDelete: 'CASCADE',
      }),
    );
    
    // Create indexes
    await queryRunner.createIndex(
      'conversations',
      new TableIndex({
        name: 'IDX_conversations_guest_id',
        columnNames: ['guest_id'],
      }),
    );
    
    await queryRunner.createIndex(
      'conversations',
      new TableIndex({
        name: 'IDX_conversations_host_id',
        columnNames: ['host_id'],
      }),
    );
    
    await queryRunner.createIndex(
      'conversations',
      new TableIndex({
        name: 'IDX_conversations_bookable',
        columnNames: ['bookable_type', 'bookable_id'],
      }),
    );
    
    await queryRunner.createIndex(
      'conversations',
      new TableIndex({
        name: 'IDX_conversations_participants',
        columnNames: ['guest_id', 'host_id', 'bookable_id'],
        isUnique: true,
      }),
    );
    
    await queryRunner.createIndex(
      'messages',
      new TableIndex({
        name: 'IDX_messages_conversation_id',
        columnNames: ['conversation_id'],
      }),
    );
    
    await queryRunner.createIndex(
      'messages',
      new TableIndex({
        name: 'IDX_messages_sender_id',
        columnNames: ['sender_id'],
      }),
    );
    
    await queryRunner.createIndex(
      'messages',
      new TableIndex({
        name: 'IDX_messages_receiver_id',
        columnNames: ['receiver_id'],
      }),
    );
    
    await queryRunner.createIndex(
      'messages',
      new TableIndex({
        name: 'IDX_messages_is_read',
        columnNames: ['is_read'],
      }),
    );
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('messages');
    await queryRunner.dropTable('conversations');
  }
}

