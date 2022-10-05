import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPublicationGrants1664996062191 implements MigrationInterface {
  name = 'AddPublicationGrants1664996062191';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."grants_name_enum" RENAME TO "grants_name_enum_old"`);
    await queryRunner.query(
      `CREATE TYPE "public"."grants_name_enum" AS ENUM('READ_ME', 'UPDATE_ME', 'CREATE_VEHICLE', 'VIEW_VEHICLE', 'READ_VEHICLE', 'CREATE_PUBLICATION', 'VIEW_PUBLICATION', 'READ_PUBLICATION')`
    );
    await queryRunner.query(
      `ALTER TABLE "grants" ALTER COLUMN "name" TYPE "public"."grants_name_enum" USING "name"::"text"::"public"."grants_name_enum"`
    );
    await queryRunner.query(`DROP TYPE "public"."grants_name_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."grants_name_enum_old" AS ENUM('READ_ME', 'UPDATE_ME', 'CREATE_VEHICLE', 'VIEW_VEHICLE', 'READ_VEHICLE')`
    );
    await queryRunner.query(
      `ALTER TABLE "grants" ALTER COLUMN "name" TYPE "public"."grants_name_enum_old" USING "name"::"text"::"public"."grants_name_enum_old"`
    );
    await queryRunner.query(`DROP TYPE "public"."grants_name_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."grants_name_enum_old" RENAME TO "grants_name_enum"`);
  }
}
