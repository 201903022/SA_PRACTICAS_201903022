import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RestaurantsRepository } from '../restaurants.repository';

type RestaurantOut = {
  id: string;
  name: string;
  address: string;
  phone: string;
  alias: string;
  openingHours: string;
  isActive: boolean;
  merchantTypeId: string;
};

type Input = {
  id: string;
};

function isUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v,
  );
}

@Injectable()
export class FindOneUseCase {
  private readonly logger = new Logger(FindOneUseCase.name);
  constructor(private readonly repo: RestaurantsRepository) {}

  async execute(input: Input): Promise<{ restaurant: RestaurantOut }> {
    // ? Imprimir input para debug
    this.logger.debug(`FindOneUseCase input: ${JSON.stringify(input)}`);
    if (!isUuid(input.id)) {
      throw new RpcException({ code: 3, message: 'id invalid uuid' });
    }

    const found = await this.repo.findOneById(input.id);

    if (!found) {
      throw new RpcException({ code: 5, message: 'Restaurant not found' }); // NOT_FOUND
    }
    return {
      restaurant: {
        id: found.id,
        name: found.name,
        address: found.address,
        phone: found.phone ?? '',
        alias: found.alias ?? '',
        openingHours: found.opening_hours ?? '', // ojo snake_case en prisma
        isActive: found.is_active,
        merchantTypeId: found.merchant_type_id,
      },
    };
  }
}
