import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { Vehicle } from 'apps/vehicle/domain/vehicle';
import { VehicleSarchValues, VehicleSearchRepository } from 'apps/vehicle/domain/vehicle-search-repository';
import { VehicleDBRepository } from 'apps/vehicle/domain/vehicles-db-repository';

@injectable()
export class GetVehicles {
  constructor(
    @inject(TYPES.VehicleDBRepository) private readonly vehicleDBRepository: VehicleDBRepository,
    @inject(TYPES.VehicleSearchRepository) private readonly vehicleSearchRepository: VehicleSearchRepository
  ) {}

  async execute(searchValues: VehicleSarchValues): Promise<Vehicle[]> {
    const ids = await this.vehicleSearchRepository.search(searchValues);

    return this.vehicleDBRepository.findMany(ids);
  }
}
