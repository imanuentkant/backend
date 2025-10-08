import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAlbumTable9999999999997 implements MigrationInterface {
  name = 'CreateAlbumTable9999999999997'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "album" (
        "id" uuid PRIMARY KEY,
        "post_id" uuid NOT NULL,
        "owner_id" uuid NOT NULL,
        "title" varchar NOT NULL,
        "description" text NULL,
        "media_ids" text NOT NULL DEFAULT '',
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "edited_at" timestamptz NULL,
        "removed_at" timestamptz NULL
      );
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_album_post_id ON "album" ("post_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_album_owner_id ON "album" ("owner_id");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "album";`);
  }
}

