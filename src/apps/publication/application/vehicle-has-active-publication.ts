import { inject, injectable } from 'inversify';

import { TYPES } from 'apps/core/container/injection-types';
import { UUID } from 'apps/core/domain/uuid';
import { GetPublicationsByVehicleId } from 'apps/publication/application/get-publications-by-vehicle-id';

@injectable()
export class VehicleHasActivePublication {
  constructor(@inject(TYPES.GetPublicationsByVehicleId) private readonly getPublicationsByVehicleId: GetPublicationsByVehicleId) {}

  async execute(vehicleId: UUID): Promise<boolean> {
    const publications = await this.getPublicationsByVehicleId.execute(vehicleId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activePublications = publications.filter((publication) => {
      const endDate = publication.endDate;
      endDate.setHours(0, 0, 0, 0);

      return endDate >= today;
    });

    return activePublications.length > 0;
  }
}
