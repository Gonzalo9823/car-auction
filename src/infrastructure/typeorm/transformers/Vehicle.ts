import { ContextErrorType, CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { PartialBy } from 'apps/core/util/partialBy';
import { Vehicle } from 'apps/vehicle/domain/vehicle';

import { UserModel } from 'infrastructure/typeorm/entities/User';
import { VehicleModel } from 'infrastructure/typeorm/entities/Vehicle';

export class VehicleTransformer {
  static toDomain<T extends Vehicle | Omit<Vehicle, 'owner'>>(vehicle: PartialBy<VehicleModel, 'owner'>, withOwner: boolean): T {
    const { id, licensePlate, brand, model, year, kilometers, owner } = vehicle;

    const baseVehicle = {
      id,
      licensePlate,
      brand,
      model,
      year,
      kilometers,
    };

    if (withOwner) {
      if (!owner) {
        throw new CustomError(ErrorType.InternalServerError, ErrorCode.CantTransformInfrastructureToDomain, [
          { type: ContextErrorType.Transformer, path: 'Vehicle' },
          { type: ContextErrorType.InvalidData, path: 'Vehicle/owner' },
        ]);
      }

      return {
        ...baseVehicle,
        owner: {
          id: owner.id,
          name: owner.name,
        },
      } as T;
    }

    return baseVehicle as T;
  }

  static toInfrastructure(vehicle: PartialBy<Vehicle, 'owner'>): VehicleModel {
    const { id, licensePlate, brand, model, year, kilometers, owner } = vehicle;

    const vehicleModel = new VehicleModel();

    vehicleModel.id = id;
    vehicleModel.licensePlate = licensePlate;
    vehicleModel.brand = brand;
    vehicleModel.model = model;
    vehicleModel.year = year;
    vehicleModel.kilometers = kilometers;

    if (owner) {
      const vehicleModelOwner = new UserModel();
      vehicleModelOwner.id = owner.id;
      vehicleModelOwner.name = owner.name;

      vehicleModel.owner = vehicleModelOwner;
    }

    return vehicleModel;
  }
}
