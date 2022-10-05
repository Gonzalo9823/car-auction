import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAtToTables1664986658298 implements MigrationInterface {
  name = 'AddDeletedAtToTables1664986658298';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "grants" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "vehicles" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "roles" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "grants" DROP COLUMN "deleted_at"`);
  }
}
