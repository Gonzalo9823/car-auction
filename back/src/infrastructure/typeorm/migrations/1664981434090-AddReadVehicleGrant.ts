import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReadVehicleGrant1664981434090 implements MigrationInterface {
  name = 'AddReadVehicleGrant1664981434090';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."grants_name_enum" RENAME TO "grants_name_enum_old"`);
    await queryRunner.query(
      `CREATE TYPE "public"."grants_name_enum" AS ENUM('READ_ME', 'UPDATE_ME', 'CREATE_VEHICLE', 'VIEW_VEHICLE', 'READ_VEHICLE')`
    );
    await queryRunner.query(
      `ALTER TABLE "grants" ALTER COLUMN "name" TYPE "public"."grants_name_enum" USING "name"::"text"::"public"."grants_name_enum"`
    );
    await queryRunner.query(`DROP TYPE "public"."grants_name_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."grants_name_enum_old" AS ENUM('READ_ME', 'UPDATE_ME', 'CREATE_VEHICLES', 'VIEW_VEHICLES')`);
    await queryRunner.query(
      `ALTER TABLE "grants" ALTER COLUMN "name" TYPE "public"."grants_name_enum_old" USING "name"::"text"::"public"."grants_name_enum_old"`
    );
    await queryRunner.query(`DROP TYPE "public"."grants_name_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."grants_name_enum_old" RENAME TO "grants_name_enum"`);
  }
}
