import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserFavoriteVehiclesTable1664982584940 implements MigrationInterface {
  name = 'AddUserFavoriteVehiclesTable1664982584940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_favorite_vehicles" ("user_id" uuid NOT NULL, "vehicle_id" uuid NOT NULL, CONSTRAINT "PK_2f5ee9d7c2deb761c005c3405eb" PRIMARY KEY ("user_id", "vehicle_id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_4a62a872684bb02309741f5f6e" ON "user_favorite_vehicles" ("user_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_364c61a428c9e1c7831839be62" ON "user_favorite_vehicles" ("vehicle_id") `);
    await queryRunner.query(
      `ALTER TABLE "user_favorite_vehicles" ADD CONSTRAINT "FK_4a62a872684bb02309741f5f6ee" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_vehicles" ADD CONSTRAINT "FK_364c61a428c9e1c7831839be62a" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_favorite_vehicles" DROP CONSTRAINT "FK_364c61a428c9e1c7831839be62a"`);
    await queryRunner.query(`ALTER TABLE "user_favorite_vehicles" DROP CONSTRAINT "FK_4a62a872684bb02309741f5f6ee"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_364c61a428c9e1c7831839be62"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4a62a872684bb02309741f5f6e"`);
    await queryRunner.query(`DROP TABLE "user_favorite_vehicles"`);
  }
}
