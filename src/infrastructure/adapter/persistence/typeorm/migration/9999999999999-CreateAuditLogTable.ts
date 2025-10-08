import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuditLogTable9999999999999 implements MigrationInterface {
  name = 'CreateAuditLogTable9999999999999'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
        actor_id VARCHAR NULL,
        method VARCHAR NOT NULL,
        path VARCHAR NOT NULL,
        status_code INT NOT NULL,
        ip VARCHAR NULL,
        user_agent VARCHAR NULL,
        body JSONB NULL,
        params JSONB NULL,
        query JSONB NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS audit_log;`);
  }
}
