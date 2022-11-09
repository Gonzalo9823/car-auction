import { rand, randBrand, randNumber, randSoonDate, randVehicleModel } from '@ngneat/falso';
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

    // Add Users
    const addedUserIds: string[] = [];

    for (let i = 0; i < 10; i++) {
      const addedUser = (await queryRunner.query(
        `INSERT INTO "users" (name, email, phone, encrypted_password, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [
          `User ${i + 1}`,
          `user${i + 1}@mail.com`,
          `+56 9 ${randNumber({ min: 11111111, max: 99999999 })}`,
          '$2b$10$73z0XmZY5cBvwX0ju0PPcu0JIHI6bGMuQ1oNaOPrexGSwgxyjmdhi',
          userRole.id,
        ]
      )) as { id: string }[];

      addedUserIds.push(addedUser[0].id);
    }

    // Add Vehicles
    const addedVehicles: { id: string; userId: string }[] = [];

    for (let i = 0; i < 40; i++) {
      const owner = rand(addedUserIds);
      const addedVehicle = (await queryRunner.query(
        `INSERT INTO "vehicles" (license_plate, brand, model, year, kilometers, sold, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          `${String.fromCharCode(randNumber({ min: 65, max: 90 }))}${String.fromCharCode(randNumber({ min: 65, max: 90 }))}-${randNumber({
            min: 1,
            max: 9,
          })}${randNumber({ min: 1, max: 9 })}${randNumber({ min: 1, max: 9 })}${randNumber({ min: 1, max: 9 })}`,
          randBrand(),
          randVehicleModel(),
          randNumber({ min: 2000, max: 2022 }),
          randNumber({ min: 800, max: 100000 }),
          false,
          owner,
        ]
      )) as { id: string }[];

      addedVehicles.push({ id: addedVehicle[0].id, userId: owner });
    }

    // Add Publications
    const addedPublicationsIds: string[] = [];
    let notAddedVehicles = addedVehicles.map((vehicle) => vehicle.id);

    for (const _vehicle of addedVehicles) {
      if (randNumber({ min: 0, max: 4 }) === 4) continue;
      const vehicle = rand(notAddedVehicles);

      const addedPublication = (await queryRunner.query(
        `INSERT INTO "publications" (vehicle_id, end_date, user_id) VALUES ($1, $2, $3) RETURNING id`,
        [vehicle, randSoonDate(), _vehicle.userId]
      )) as { id: string }[];

      notAddedVehicles = notAddedVehicles.filter((_vehicle) => _vehicle !== vehicle);
      addedPublicationsIds.push(addedPublication[0].id);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "users"`);
    await queryRunner.query(`DELETE FROM "role_grants"`);
    await queryRunner.query(`DELETE FROM "grants"`);
    await queryRunner.query(`DELETE FROM "roles"`);
    await queryRunner.query(`DELETE FROM "publications"`);
    await queryRunner.query(`DELETE FROM "vehicles"`);
  }
}
