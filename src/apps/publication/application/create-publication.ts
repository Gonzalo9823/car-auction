import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { ContextErrorType, CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { User } from 'apps/core/domain/user';
import { VehicleHasActivePublication } from 'apps/publication/application/vehicle-has-active-publication';
import { Publication } from 'apps/publication/domain/publication';
import { CreatePublicationDto, PublicationDBRepository } from 'apps/publication/domain/publication-db-repository';
import { GetMyVehicle } from 'apps/vehicle/application/get-my-vehicle';

@injectable()
export class CreatePublication {
  constructor(
    @inject(TYPES.PublicationDBRepository) private readonly publicationDBRepository: PublicationDBRepository,
    @inject(TYPES.GetMyVehicle) private readonly getMyVehicle: GetMyVehicle,
    @inject(TYPES.VehicleHasActivePublication) private readonly vehicleHasActivePublication: VehicleHasActivePublication
  ) {}

  async execute(user: User, publicationData: Omit<CreatePublicationDto, 'vehicle'> & { vehicleId: string }): Promise<Publication> {
    const { vehicleId, ..._publicationData } = publicationData;

    const vehicle = await this.getMyVehicle.execute(user, vehicleId);

    if (vehicle.sold) {
      throw new CustomError(ErrorType.MethodNotAllowed, ErrorCode.VehicleAlreadySold, [{ type: ContextErrorType.InvalidData, path: 'vehicle' }]);
    }

    const hasActivePublication = await this.vehicleHasActivePublication.execute(vehicle.id);
    if (hasActivePublication) {
      throw new CustomError(ErrorType.MethodNotAllowed, ErrorCode.VehicleHasActivePublication, [
        { type: ContextErrorType.InvalidData, path: 'vehicle' },
      ]);
    }

    return this.publicationDBRepository.create(user, { ..._publicationData, vehicle });
  }
}
