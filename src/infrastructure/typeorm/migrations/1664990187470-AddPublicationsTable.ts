import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPublicationsTable1664990187470 implements MigrationInterface {
  name = 'AddPublicationsTable1664990187470';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "publications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "end_date" TIMESTAMP NOT NULL, "user_id" uuid, "vehicle_id" uuid, "winner_id" uuid, CONSTRAINT "PK_2c4e732b044e09139d2f1065fae" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "publications" ADD CONSTRAINT "FK_9ee3bc3631b2e8919c05d9a1a81" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "publications" ADD CONSTRAINT "FK_63ca253e8d98517c28f4934ef7f" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "publications" ADD CONSTRAINT "FK_dbbff83f34dcc6021ff0d8fca4a" FOREIGN KEY ("winner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "publications" DROP CONSTRAINT "FK_dbbff83f34dcc6021ff0d8fca4a"`);
    await queryRunner.query(`ALTER TABLE "publications" DROP CONSTRAINT "FK_63ca253e8d98517c28f4934ef7f"`);
    await queryRunner.query(`ALTER TABLE "publications" DROP CONSTRAINT "FK_9ee3bc3631b2e8919c05d9a1a81"`);
    await queryRunner.query(`DROP TABLE "publications"`);
  }
}
