import { Controller } from '@nestjs/common';
import { GetRestaurantByOwnerIdUseCase } from './get-restaurant-by-owner.usecase';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import type { CreateCompanyRequest } from './types/create-company.requeste.type';
import { CreateCompanyResponse } from './types/restaurant-response';
import { CreateCompanyUseCase } from './create-restaurant.usecase';
import { ListRestaurantsUseCase } from './find-all.usecase';
import type { ListRestaurantsParams } from './types/list-restaurants-params.type';
import { FindOneUseCase } from './usecases/find-by-id.usecase';

type GetRestaurantByOwnerIdRequest = {
  ownerUserId?: string;
  onlyActive?: boolean;
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

@Controller()
export class RestaurantsGrpcController {
  constructor(
    private readonly getByOwner: GetRestaurantByOwnerIdUseCase,
    private readonly createCompanySvc: CreateCompanyUseCase,
    private readonly listRestaurantsSvc: ListRestaurantsUseCase,
    private readonly findOneUseCase: FindOneUseCase,
  ) {}

  @GrpcMethod('CatalogService', 'GetRestaurantByOwnerId')
  async getRestaurantByOwnerId(
    data: GetRestaurantByOwnerIdRequest,
  ): Promise<GetRestaurantByOwnerIdResponse> {
    return this.getByOwner.execute({
      ownerUserId: data.ownerUserId ?? '',
      onlyActive: data.onlyActive ?? true,
    });
  }

  @GrpcMethod('CatalogService', 'CreateCompany')
  async createCompany(
    data: CreateCompanyRequest,
  ): Promise<CreateCompanyResponse> {
    const name = data.name?.trim() ?? '';
    const address = data.address?.trim() ?? '';
    const merchantTypeId = data.merchantTypeId?.trim() ?? '';
    const ownerUserId = data.ownerUserId?.trim() ?? '';

    if (!name || !address || !merchantTypeId || !ownerUserId) {
      throw new RpcException({ code: 3, message: 'Invalid arguments' }); // INVALID_ARGUMENT
    }
    return this.createCompanySvc.execute({
      name,
      address,
      phone: data.phone?.trim() ?? '',
      alias: data.alias?.trim() ?? '',
      openingHours: data.openingHours?.trim() ?? '',
      merchantTypeId,
      ownerUserId,
    });
  }

  @GrpcMethod('CatalogService', 'ListRestaurants')
  async listRestaurants(data: ListRestaurantsParams) {
    return this.listRestaurantsSvc.execute({
      onlyActive: data.onlyActive ?? true,
      limit: data.limit,
      offset: data.offset,
    });
  }
  @GrpcMethod('CatalogService', 'GetRestaurant')
  async findOneRestaurant(data: { id: string }) {
    return await this.findOneUseCase.execute({ id: data.id });
  }
}
