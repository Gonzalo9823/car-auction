import { injectable } from 'inversify';

import { ContextErrorType, CustomError, ErrorCode, ErrorType } from 'apps/core/CustomError';
import { User } from 'apps/core/domain/user';
import { UUID } from 'apps/core/domain/uuid';
import { Publication } from 'apps/publication/domain/publication';
import { CreatePublicationDto, PublicationDBRepository } from 'apps/publication/domain/publication-db-repository';

import { AppDataSource } from 'infrastructure/typeorm';
import { PublicationModel } from 'infrastructure/typeorm/entities/Publication';
import { ErrorHandler } from 'infrastructure/typeorm/ErrorHandler';
import { PublicationTransformer } from 'infrastructure/typeorm/transformers/Publication';
import { UserTransformer } from 'infrastructure/typeorm/transformers/User';
import { VehicleTransformer } from 'infrastructure/typeorm/transformers/Vehicle';

@injectable()
export class PublicationTypeORMRepository implements PublicationDBRepository {
  async create(user: User, publicationData: CreatePublicationDto): Promise<Publication> {
    const newPublication = new PublicationModel();

    await this.addDataToPublication(newPublication, user, publicationData);

    return PublicationTransformer.toDomain(newPublication);
  }

  async findMany(): Promise<Publication[]> {
    const publications = await this.getPublications();

    return publications.map((publication) => PublicationTransformer.toDomain(publication));
  }

  async findManyByVehicleId(id: string): Promise<Publication[]> {
    const publications = await this.getPublicationsByVehicleId(id);

    return publications.map((publication) => PublicationTransformer.toDomain(publication));
  }

  async findById(id: UUID): Promise<Publication> {
    const publication = await this.getPublicationById(id);

    return PublicationTransformer.toDomain(publication);
  }

  async findMine(user: User): Promise<Publication[]> {
    const publications = await this.getMyPublications(user.id);

    return publications.map((publication) => PublicationTransformer.toDomain(publication));
  }

  async findBidded(user: User): Promise<Publication[]> {
    const publications = await this.getBiddedPublications(user.id);

    return publications.map((publication) => PublicationTransformer.toDomain(publication));
  }

  // Private Methods
  async addDataToPublication(publication: PublicationModel, user: User, publicationData: CreatePublicationDto): Promise<void> {
    try {
      const { vehicle, endDate } = publicationData;

      publication.vehicle = VehicleTransformer.toInfrastructure(vehicle);
      publication.endDate = endDate;
      publication.user = UserTransformer.toInfrastructure(user, 'User');
      publication.bids = [];

      await AppDataSource.getRepository(PublicationModel).save(publication);
    } catch (err) {
      throw ErrorHandler(err);
    }
  }

  async getPublications(): Promise<PublicationModel[]> {
    const publications = await AppDataSource.getRepository(PublicationModel).find({
      relations: {
        user: true,
        vehicle: true,
        winner: true,
        bids: true,
      },
      order: {
        endDate: 'ASC',
      },
    });

    return publications;
  }

  async getPublicationsByVehicleId(id: UUID): Promise<PublicationModel[]> {
    const publications = await AppDataSource.getRepository(PublicationModel).find({
      relations: {
        user: true,
        vehicle: true,
        winner: true,
        bids: true,
      },
      where: {
        vehicle: {
          id,
        },
      },
      order: {
        endDate: 'ASC',
      },
    });

    return publications;
  }

  async getPublicationById(id: UUID): Promise<PublicationModel> {
    const publication = await AppDataSource.getRepository(PublicationModel).findOne({
      relations: {
        user: true,
        vehicle: true,
        winner: true,
        bids: true,
      },
      where: {
        id,
      },
    });

    if (!publication) throw new CustomError(ErrorType.NotFound, ErrorCode.DataNotFound, [{ type: ContextErrorType.NotFound, path: 'publication' }]);

    return publication;
  }

  async getMyPublications(userId: UUID): Promise<PublicationModel[]> {
    const publications = await AppDataSource.getRepository(PublicationModel).find({
      relations: {
        user: true,
        vehicle: true,
        winner: true,
        bids: true,
      },
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        endDate: 'ASC',
      },
    });

    return publications;
  }

  async getBiddedPublications(userId: UUID): Promise<PublicationModel[]> {
    const publications = await AppDataSource.getRepository(PublicationModel).find({
      relations: {
        user: true,
        vehicle: true,
        winner: true,
        bids: {
          bidder: true,
        },
      },
      where: {
        bids: {
          bidder: {
            id: userId,
          },
        },
      },
      order: {
        endDate: 'ASC',
      },
    });

    return publications;
  }
}
