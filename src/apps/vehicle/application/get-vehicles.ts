import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { Vehicle } from 'apps/vehicle/domain/vehicle';
import { VehicleDBRepository } from 'apps/vehicle/domain/vehicles-db-repository';

@injectable()
export class GetVehicles {
  constructor(@inject(TYPES.VehicleDBRepository) private readonly vehicleDBRepository: VehicleDBRepository) {}

  async execute(): Promise<Vehicle[]> {
    return this.vehicleDBRepository.findMany();
  }
}
