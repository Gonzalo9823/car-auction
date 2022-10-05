import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { User } from 'apps/core/domain/user';
import { Vehicle } from 'apps/vehicle/domain/vehicle';
import { CreateVehicleDto, VehicleDBRepository } from 'apps/vehicle/domain/vehicles-db-repository';

@injectable()
export class CreateVehicle {
  constructor(@inject(TYPES.VehicleDBRepository) private readonly vehicleDBRepository: VehicleDBRepository) {}

  async execute(user: User, vehicleData: CreateVehicleDto): Promise<Omit<Vehicle, 'owner'>> {
    return this.vehicleDBRepository.create(user, vehicleData);
  }
}
