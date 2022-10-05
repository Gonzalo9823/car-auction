import { User } from 'apps/core/domain/user';
import { UUID } from 'apps/core/domain/uuid';
import { Vehicle } from 'apps/vehicle/domain/vehicle';

export interface CreateVehicleDto {
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  kilometers: number;
}

export interface VehicleDBRepository {
  create(user: User, vehicleData: CreateVehicleDto): Promise<Omit<Vehicle, 'owner'>>;
  findMany(): Promise<Vehicle[]>;
  findById(id: UUID): Promise<Vehicle>;
  findManyMine(user: User): Promise<(Omit<Vehicle, 'owner'> & { sold: boolean })[]>;
  findMineById(user: User, id: UUID): Promise<Vehicle & { sold: boolean }>;
  addAsFavorite(user: User, vehicle: Vehicle): Promise<void>;
  findFavorites(user: User): Promise<Vehicle[]>;
}
