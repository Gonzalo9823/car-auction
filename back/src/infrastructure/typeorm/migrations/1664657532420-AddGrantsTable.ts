import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGrantsTable1664657532420 implements MigrationInterface {
  name = 'AddGrantsTable1664657532420';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."grants_name_enum" AS ENUM('READ_ME', 'UPDATE_ME')`);
    await queryRunner.query(
      `CREATE TABLE "grants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" "public"."grants_name_enum" NOT NULL, CONSTRAINT "PK_a25f5f89eff8b3277f7969b7094" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "grants"`);
    await queryRunner.query(`DROP TYPE "public"."grants_name_enum"`);
  }
}
