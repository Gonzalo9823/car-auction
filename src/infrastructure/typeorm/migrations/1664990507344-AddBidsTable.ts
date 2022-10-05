import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBidsTable1664990507344 implements MigrationInterface {
  name = 'AddBidsTable1664990507344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bids" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "bidded_at" TIMESTAMP NOT NULL, "amount" real NOT NULL, "publication_id" uuid NOT NULL, "bidder_id" uuid NOT NULL, CONSTRAINT "PK_7950d066d322aab3a488ac39fe5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "bids" ADD CONSTRAINT "FK_d29f1c84ee585354f96686a8da0" FOREIGN KEY ("publication_id") REFERENCES "publications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "bids" ADD CONSTRAINT "FK_bc7e4d3d2bdc4c8d9695938d8e4" FOREIGN KEY ("bidder_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bids" DROP CONSTRAINT "FK_bc7e4d3d2bdc4c8d9695938d8e4"`);
    await queryRunner.query(`ALTER TABLE "bids" DROP CONSTRAINT "FK_d29f1c84ee585354f96686a8da0"`);
    await queryRunner.query(`DROP TABLE "bids"`);
  }
}
