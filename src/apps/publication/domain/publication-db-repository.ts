import { User } from 'apps/core/domain/user';
import { UUID } from 'apps/core/domain/uuid';
import { Publication } from 'apps/publication/domain/publication';
import { Vehicle } from 'apps/vehicle/domain/vehicle';

export interface CreatePublicationDto {
  vehicle: Vehicle;
  endDate: Date;
}

export interface PublicationDBRepository {
  create(user: User, publicationData: CreatePublicationDto): Promise<Publication>;
  findMany(): Promise<Publication[]>;
  findById(id: UUID): Promise<Publication>;
  findManyByVehicleId(id: UUID): Promise<Publication[]>;
  findMine(user: User): Promise<Publication[]>;
  findBidded(user: User): Promise<Publication[]>;
}
