import { MigrationInterface, QueryRunner } from 'typeorm';

import { AvailableGrant } from 'apps/core/domain/grant';

export class BaseMigration1665003829762 implements MigrationInterface {
  name = 'BaseMigration1665003829762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add Role
    const userRole = ((await queryRunner.query(`INSERT INTO "roles" (name) VALUES ('USER') RETURNING id`)) as { id: string }[])[0];

    // Add Grants
    for (const _grant of Object.values(AvailableGrant)) {
      const grant = ((await queryRunner.query(`INSERT INTO "grants" (name) VALUES ($1) RETURNING id`, [_grant])) as { id: string }[])[0];
      await queryRunner.query(`INSERT INTO "role_grants" (role_id, grant_id) VALUES ($1, $2)`, [userRole.id, grant.id]);
    }

    // User 1
    (await queryRunner.query(`INSERT INTO "users" (name, email, phone, encrypted_password, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`, [
      'User 1',
      'user1@mail.com',
      '12345678',
      '$2b$10$73z0XmZY5cBvwX0ju0PPcu0JIHI6bGMuQ1oNaOPrexGSwgxyjmdhi',
      userRole.id,
    ])) as { id: string }[];
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "users"`);
    await queryRunner.query(`DELETE FROM "role_grants"`);
    await queryRunner.query(`DELETE FROM "grants"`);
    await queryRunner.query(`DELETE FROM "roles"`);
  }
}
