import { UUID } from 'apps/core/domain/uuid';
import { Vehicle } from 'apps/vehicle/domain/vehicle';

export interface VehicleSarchValues {
  licensePlates?: string[];
  brands?: string[];
  models?: string[];
  years?: number[];
  kilometers?: number[];
}

export interface VehicleSearchRepository {
  addToIndex(vehicle: Omit<Vehicle, 'owner'>): Promise<void>;
  search(searchValues: VehicleSarchValues): Promise<UUID[] | undefined>;
}
