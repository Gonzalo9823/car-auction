import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleGrantsTable1664657670152 implements MigrationInterface {
  name = 'AddRoleGrantsTable1664657670152';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role_grants" ("role_id" uuid NOT NULL, "grant_id" uuid NOT NULL, CONSTRAINT "PK_7123f8531fd9b8c401070c3ff75" PRIMARY KEY ("role_id", "grant_id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_1364a7f427667b708054002b26" ON "role_grants" ("role_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_43dd6f4f47d421a24810cff1c4" ON "role_grants" ("grant_id") `);
    await queryRunner.query(
      `ALTER TABLE "role_grants" ADD CONSTRAINT "FK_1364a7f427667b708054002b26c" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "role_grants" ADD CONSTRAINT "FK_43dd6f4f47d421a24810cff1c4f" FOREIGN KEY ("grant_id") REFERENCES "grants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role_grants" DROP CONSTRAINT "FK_43dd6f4f47d421a24810cff1c4f"`);
    await queryRunner.query(`ALTER TABLE "role_grants" DROP CONSTRAINT "FK_1364a7f427667b708054002b26c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_43dd6f4f47d421a24810cff1c4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1364a7f427667b708054002b26"`);
    await queryRunner.query(`DROP TABLE "role_grants"`);
  }
}
