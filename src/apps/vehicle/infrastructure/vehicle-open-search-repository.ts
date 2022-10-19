import { injectable } from 'inversify';

import { UUID } from 'apps/core/domain/uuid';
import { Vehicle } from 'apps/vehicle/domain/vehicle';
import { VehicleSarchValues, VehicleSearchRepository } from 'apps/vehicle/domain/vehicle-search-repository';

import { OpenSearchClient } from 'infrastructure/opensearch';

@injectable()
export class VehicleOpenSearchRepository implements VehicleSearchRepository {
  async addToIndex(vehicle: Omit<Vehicle, 'owner'>): Promise<void> {
    await OpenSearchClient.index({
      id: vehicle.id,
      index: 'cars',
      body: vehicle,
      refresh: true,
    });
  }

  async search(searchValues: VehicleSarchValues): Promise<UUID[]> {
    const query = this.getSearchQuery(searchValues);

    if (!query) {
      return [];
    }

    const response = await OpenSearchClient.search({
      index: 'cars',
      body: query,
    });

    const hits = response.body.hits.hits as { _id: string }[];
    return hits.map((hit) => hit._id);
  }

  // Private method
  private getSearchQuery(values: VehicleSarchValues) {
    const { licensePlates, brands, models, years, kilometers } = { ...values };

    if (
      (!licensePlates || licensePlates.length < 1) &&
      (!brands || brands.length < 1) &&
      (!models || models.length < 1) &&
      (!years || years.length < 1) &&
      (!kilometers || kilometers.length < 1)
    ) {
      return undefined;
    }

    const base = {
      query: {
        bool: {
          should: [],
        },
      },
    };

    if (licensePlates) {
      for (const licensePlate of licensePlates) {
        base.query.bool.should.push(this.getQueryValue('licensePlate', licensePlate) as never);
      }
    }

    if (brands) {
      for (const brand of brands) {
        base.query.bool.should.push(this.getQueryValue('brand', brand) as never);
      }
    }

    if (models) {
      for (const model of models) {
        base.query.bool.should.push(this.getQueryValue('model', model) as never);
      }
    }

    if (years) {
      for (const year of years) {
        base.query.bool.should.push(this.getQueryValue('year', year) as never);
      }
    }

    if (kilometers) {
      for (const kilometer of kilometers) {
        base.query.bool.should.push(this.getQueryValue('kilometers', kilometer) as never);
      }
    }

    return base;
  }

  private getQueryValue(
    name: string,
    value: string | number
  ):
    | {
        wildcard: {
          [key: string]: {
            value: string;
          };
        };
      }
    | {
        match: {
          [key: string]: string;
        };
      } {
    if (typeof value === 'number') {
      return {
        match: {
          [name]: `${value}`,
        },
      };
    }

    return {
      wildcard: {
        [name]: {
          value: `*${value}*`,
        },
      },
    };
  }
}
