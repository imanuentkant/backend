import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommentTable9999999999998 implements MigrationInterface {
  name = 'CreateCommentTable9999999999998'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "comment" (
        "id" uuid PRIMARY KEY,
        "post_id" uuid NOT NULL,
        "author_id" uuid NOT NULL,
        "content" text NOT NULL,
        "rating" int NULL,
        "created_at" timestamptz NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_comment_post_id_created_at ON "comment" ("post_id", "created_at" DESC);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "comment";`);
  }
}


