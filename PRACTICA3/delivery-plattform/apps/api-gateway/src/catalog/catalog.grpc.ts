import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices'; // ! import type
import { firstValueFrom, Observable } from 'rxjs';
import {
  CreateCompanyRequest,
  CreateCompanyResponse,
  GetRestaurantByOwnerIdResponse,
} from './types/Types_Restaurant_Owner';
import { GetRestaurantByOwnerIdInput } from './types/get-restaurant-by-owner-id.input.type';
import {
  ListMenuItemsByRestaurantRequest,
  ListMenuItemsByRestaurantResponse,
  MenuItem,
} from './types/menut-item.type';
import {
  CreateMenuItemRequest,
  CreateMenuItemResponse,
} from './types/create-menut-item.type';
import {
  ListRestaurantsRequest,
  ListRestaurantsResponse,
} from './types/list-restaurants.request.type';

type HealhRequest = {};
type HealthResponse = { status: string; service: string; ts: number };

type MerchantType = {
  id: string;
  code: string;
  name: string;
  description: string;
};

type ListMerchantTypesResponse = { merchantTypes: MerchantType[] };
interface CatalogServiceGrpc {
  Health(req: {}): Observable<HealthResponse>;
  GetRestaurantByOwnerId(
    req: GetRestaurantByOwnerIdInput,
  ): Observable<GetRestaurantByOwnerIdResponse>;
  CreateCompany(req: CreateCompanyRequest): Observable<CreateCompanyResponse>;
  ListMerchantTypes(req: {}): Observable<ListMerchantTypesResponse>;
  // ? list menu items by restaurant id with pagination and filter by availability
  ListMenuItemsByRestaurant(
    req: ListMenuItemsByRestaurantRequest,
  ): Observable<ListMenuItemsByRestaurantResponse>;
  // ? Crear Menu Item de empresa:
  CreateMenuItem(
    req: CreateMenuItemRequest,
  ): Observable<CreateMenuItemResponse>;
  ListRestaurants(
    req: ListRestaurantsRequest,
  ): Observable<ListRestaurantsResponse>;
}
@Injectable()
export class CatalogGrpcService implements OnModuleInit {
  private catalogSvc: CatalogServiceGrpc;

  constructor(@Inject('CATALOG_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.catalogSvc = this.client.getService('CatalogService');
  }

  async health(): Promise<HealthResponse> {
    return await firstValueFrom(this.catalogSvc.Health({}));
  }

  async getRestaurantByOwnerId(
    params: GetRestaurantByOwnerIdInput,
  ): Promise<GetRestaurantByOwnerIdResponse> {
    return firstValueFrom(this.catalogSvc.GetRestaurantByOwnerId(params));
  }

  async createCompany(
    params: CreateCompanyRequest,
  ): Promise<CreateCompanyResponse> {
    console.log('Create company grpc ');
    return firstValueFrom(this.catalogSvc.CreateCompany(params));
  }

  async listMerchantTypes(): Promise<ListMerchantTypesResponse> {
    const res = await firstValueFrom(this.catalogSvc.ListMerchantTypes({}));
    console.log('[API-GW] listMerchantTypes res:', res);
    return res;
  }
  listMenuItemsByRestaurant(
    params: ListMenuItemsByRestaurantRequest,
  ): Promise<ListMenuItemsByRestaurantResponse> {
    return firstValueFrom(this.catalogSvc.ListMenuItemsByRestaurant(params));
  }

  createMenuItem(
    params: CreateMenuItemRequest,
  ): Promise<CreateMenuItemResponse> {
    return firstValueFrom(this.catalogSvc.CreateMenuItem(params));
  }

  listRestaurants(
    params: ListRestaurantsRequest,
  ): Promise<ListRestaurantsResponse> {
    return firstValueFrom(this.catalogSvc.ListRestaurants(params));
  }
}
