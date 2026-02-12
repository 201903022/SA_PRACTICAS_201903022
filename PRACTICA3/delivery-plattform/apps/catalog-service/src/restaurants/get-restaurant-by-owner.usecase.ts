import { Injectable } from '@nestjs/common';
import { RestaurantsRepository } from './restaurants.repository';
import { RestaurantsMapper } from './restaurants.mapper';
import { MerchantTypesRepository } from '../merchant-types/merchant-types.repository';

type GetRestaurantByOwnerIdRequest = {
  ownerUserId: string;
  onlyActive: boolean;
};

type Restaurant = {
  id: string;
  name: string;
  address: string;
  phone: string;
  alias: string;
  openingHours: string;
  isActive: boolean;
  merchantTypeId: string;
};

type GetRestaurantByOwnerIdResponse = {
  found: boolean;
  restaurant?: Restaurant;
};

@Injectable()
export class GetRestaurantByOwnerIdUseCase {
  constructor(
    private readonly repo: RestaurantsRepository,
    private readonly merchaTypesRepository: MerchantTypesRepository,
  ) {}

  async execute(
    req: GetRestaurantByOwnerIdRequest,
  ): Promise<GetRestaurantByOwnerIdResponse> {
    console.log('OwnerUserID', req.ownerUserId);
    const row = await this.repo.findOneByOwnerId({
      ownerUserId: req.ownerUserId,
      onlyActive: req.onlyActive,
    });

    if (!row) return { found: false };

    const merchantType = await this.merchaTypesRepository.findById(
      row.merchant_type_id,
    );

    if (!merchantType) {
      console.error(
        `Merchant type with id ${row.merchant_type_id} not found for restaurant ${row.id}`,
      );
      return { found: false };
    }
    return {
      found: true,
      restaurant: RestaurantsMapper.toDto({
        ...row,
        merchant_type_id: merchantType.code,
      }),
    };
  }
}
