import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { UUID } from 'apps/core/domain/uuid';
import { Vehicle } from 'apps/vehicle/domain/vehicle';
import { VehicleDBRepository } from 'apps/vehicle/domain/vehicles-db-repository';

@injectable()
export class GetVehicleById {
  constructor(@inject(TYPES.VehicleDBRepository) private readonly vehicleDBRepository: VehicleDBRepository) {}

  async execute(id: UUID): Promise<Vehicle> {
    return this.vehicleDBRepository.findById(id);
  }
}
