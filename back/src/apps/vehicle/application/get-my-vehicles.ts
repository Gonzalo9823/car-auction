import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { User } from 'apps/core/domain/user';
import { Vehicle } from 'apps/vehicle/domain/vehicle';
import { VehicleDBRepository } from 'apps/vehicle/domain/vehicles-db-repository';

@injectable()
export class GetMyVehicles {
  constructor(@inject(TYPES.VehicleDBRepository) private readonly vehicleDBRepository: VehicleDBRepository) {}

  async execute(user: User): Promise<(Omit<Vehicle, 'owner'> & { sold: boolean })[]> {
    return this.vehicleDBRepository.findManyMine(user);
  }
}
