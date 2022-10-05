import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { ContextErrorType, CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { User } from 'apps/core/domain/user';
import { UUID } from 'apps/core/domain/uuid';
import { GetVehicleById } from 'apps/vehicle/application/get-vehicle-by-id';
import { VehicleDBRepository } from 'apps/vehicle/domain/vehicles-db-repository';

@injectable()
export class AddVehicleToFavorites {
  constructor(
    @inject(TYPES.VehicleDBRepository) private readonly vehicleDBRepository: VehicleDBRepository,
    @inject(TYPES.GetVehicleById) private readonly getVehicleById: GetVehicleById
  ) {}

  async execute(user: User, vehicleId: UUID): Promise<void> {
    const vehicle = await this.getVehicleById.execute(vehicleId);

    if (vehicle.owner.id === user.id) {
      throw new CustomError(ErrorType.Validation, ErrorCode.CantAddOwnVehicleToFavorites, [{ type: ContextErrorType.InvalidData, path: 'vehicle' }]);
    }

    return this.vehicleDBRepository.addAsFavorite(user, vehicle);
  }
}
