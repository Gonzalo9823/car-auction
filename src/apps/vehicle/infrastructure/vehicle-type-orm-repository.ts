import { injectable } from 'inversify';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { User } from 'apps/core/domain/user';
import { UUID } from 'apps/core/domain/uuid';
import { Vehicle } from 'apps/vehicle/domain/vehicle';
import { CreateVehicleDto, VehicleDBRepository } from 'apps/vehicle/domain/vehicles-db-repository';

import { AppDataSource } from 'infrastructure/typeorm';
import { VehicleModel } from 'infrastructure/typeorm/entities/Vehicle';
import { ErrorHandler } from 'infrastructure/typeorm/ErrorHandler';
import { UserTransformer } from 'infrastructure/typeorm/transformers/User';
import { VehicleTransformer } from 'infrastructure/typeorm/transformers/Vehicle';

@injectable()
export class VehicleTypeORMRepository implements VehicleDBRepository {
  async create(user: User, vehicleData: CreateVehicleDto): Promise<Omit<Vehicle, 'owner'>> {
    const newVehicle = new VehicleModel();

    await this.addDataToVehicle(newVehicle, user, vehicleData);

    return VehicleTransformer.toDomain(newVehicle, false, false);
  }

  async findMany(): Promise<Vehicle[]> {
    const vehicles = await this.getVehicles();

    return vehicles.map((vehicle) => VehicleTransformer.toDomain<Vehicle>(vehicle, true, false));
  }

  async findById(id: UUID): Promise<Vehicle> {
    const vehicle = await this.getVehicleById(id);

    return VehicleTransformer.toDomain<Vehicle>(vehicle, true, false);
  }

  async findManyMine(user: User): Promise<(Omit<Vehicle, 'owner'> & { sold: boolean })[]> {
    const vehicles = await this.getMineVehicles(user.id);

    return vehicles.map((vehicle) => VehicleTransformer.toDomain(vehicle, false, true));
  }

  async findMineById(user: User, id: string): Promise<Vehicle & { sold: boolean }> {
    const vehicle = await this.getMineVehicleById(user.id, id);

    return VehicleTransformer.toDomain<Vehicle & { sold: boolean }>(vehicle, true, true);
  }

  async addAsFavorite(user: User, vehicle: Vehicle): Promise<void> {
    const _vehicle = await this.getVehicleByIdWithFavorites(vehicle.id);
    await this.addVehicleAsFavorite(user, _vehicle);
  }

  async findFavorites(user: User): Promise<Vehicle[]> {
    const vehicles = await this.getVehiclesWithFavorites(user.id);

    return vehicles.map((vehicle) => VehicleTransformer.toDomain<Vehicle>(vehicle, true, false));
  }

  // Private Method
  private async addDataToVehicle(vehicle: VehicleModel, user: User, vehicleData: CreateVehicleDto): Promise<void> {
    try {
      const { licensePlate, brand, model, year, kilometers } = vehicleData;

      vehicle.licensePlate = licensePlate;
      vehicle.brand = brand;
      vehicle.model = model;
      vehicle.year = year;
      vehicle.kilometers = kilometers;
      vehicle.sold = false;
      vehicle.owner = UserTransformer.toInfrastructure<User>(user, 'User');

      await AppDataSource.getRepository(VehicleModel).save(vehicle);
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  private async getVehicles(): Promise<VehicleModel[]> {
    const vehicles = await AppDataSource.getRepository(VehicleModel).find({
      relations: {
        owner: true,
      },
      where: {
        sold: false,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return vehicles;
  }

  private async getVehicleById(id: UUID): Promise<VehicleModel> {
    const vehicle = await AppDataSource.getRepository(VehicleModel).findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
      },
    });

    if (!vehicle) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ type: ContextErrorType.NotFound, path: 'vehicle' }]);

    return vehicle;
  }

  private async getVehiclesWithFavorites(userId: UUID): Promise<VehicleModel[]> {
    const vehicles = await AppDataSource.getRepository(VehicleModel).find({
      where: {
        userFavorites: {
          id: userId,
        },
      },
      relations: {
        owner: true,
        userFavorites: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return vehicles;
  }

  private async getVehicleByIdWithFavorites(id: UUID): Promise<VehicleModel> {
    const vehicle = await AppDataSource.getRepository(VehicleModel).findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        userFavorites: true,
      },
    });

    if (!vehicle) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ type: ContextErrorType.NotFound, path: 'vehicle' }]);

    return vehicle;
  }

  private async getMineVehicles(userId: UUID): Promise<VehicleModel[]> {
    const vehicles = await AppDataSource.getRepository(VehicleModel).find({
      where: {
        owner: {
          id: userId,
        },
      },
      relations: {
        owner: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return vehicles;
  }

  private async getMineVehicleById(userId: UUID, id: UUID): Promise<VehicleModel> {
    const vehicle = await AppDataSource.getRepository(VehicleModel).findOne({
      where: {
        id,
        owner: {
          id: userId,
        },
      },
      relations: {
        owner: true,
      },
    });

    if (!vehicle) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ type: ContextErrorType.NotFound, path: 'vehicle' }]);

    return vehicle;
  }

  private async addVehicleAsFavorite(user: User, vehicle: VehicleModel): Promise<void> {
    try {
      const userModel = UserTransformer.toInfrastructure(user, 'User');
      vehicle.userFavorites.push(userModel);

      await AppDataSource.getRepository(VehicleModel).save(vehicle);
    } catch (err) {
      throw ErrorHandler(err);
    }
  }
}
