import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { User } from 'apps/core/domain/user';
import { UUID } from 'apps/core/domain/uuid';
import { Vehicle } from 'apps/vehicle/domain/vehicle';
import { VehicleDBRepository } from 'apps/vehicle/domain/vehicles-db-repository';

@injectable()
export class GetMyVehicle {
  constructor(@inject(TYPES.VehicleDBRepository) private readonly vehicleDBRepository: VehicleDBRepository) {}

  async execute(user: User, id: UUID): Promise<Vehicle & { sold: boolean }> {
    return this.vehicleDBRepository.findMineById(user, id);
  }
}
