import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSoldToVehicle1664980114473 implements MigrationInterface {
  name = 'AddSoldToVehicle1664980114473';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vehicles" ADD "sold" boolean`);
    await queryRunner.query(`UPDATE "vehicles" SET sold = false`);
    await queryRunner.query(`ALTER TABLE "vehicles" ALTER COLUMN "sold" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "sold"`);
  }
}
