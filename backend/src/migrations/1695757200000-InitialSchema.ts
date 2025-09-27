import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial database schema migration
 * Creates users and quests tables with proper indexes and foreign keys
 */
export class InitialSchema1695757200000 implements MigrationInterface {
  name = 'InitialSchema1695757200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" character varying NOT NULL,
        "username" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_users_username" UNIQUE ("username")
      )
    `);

    // Create quests table
    await queryRunner.query(`
      CREATE TYPE "quests_status_enum" AS ENUM('draft', 'active', 'completed', 'archived')
    `);

    await queryRunner.query(`
      CREATE TABLE "quests" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "status" "quests_status_enum" NOT NULL DEFAULT 'draft',
        "created_by_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_quests_id" PRIMARY KEY ("id")
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_USERS_EMAIL" ON "users" ("email")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_USERS_USERNAME" ON "users" ("username")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_QUESTS_STATUS" ON "quests" ("status")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_QUESTS_CREATED_BY_ID" ON "quests" ("created_by_id")
    `);

    // Create foreign key relationship
    await queryRunner.query(`
      ALTER TABLE "quests" ADD CONSTRAINT "FK_quests_created_by_id" 
      FOREIGN KEY ("created_by_id") REFERENCES "users"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key
    await queryRunner.query(`
      ALTER TABLE "quests" DROP CONSTRAINT "FK_quests_created_by_id"
    `);

    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_QUESTS_CREATED_BY_ID"`);
    await queryRunner.query(`DROP INDEX "IDX_QUESTS_STATUS"`);
    await queryRunner.query(`DROP INDEX "IDX_USERS_USERNAME"`);
    await queryRunner.query(`DROP INDEX "IDX_USERS_EMAIL"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "quests"`);
    await queryRunner.query(`DROP TYPE "quests_status_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
