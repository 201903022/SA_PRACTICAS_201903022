import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { GetRestaurantResponse } from '../types/menu-items.types';

type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  isAvailable: boolean;
};

type ListMenuItemsByRestaurantResponse = { items: MenuItem[] };

type ListMenuItemsByRestaurantRequest = {
  restaurantId: string;
  onlyAvailable?: boolean;
  limit?: number;
  offset?: number;
};
interface CatalogServiceGrpc {
  ListMenuItemsByRestaurant(req: {
    restaurantId: string;
    onlyAvailable?: boolean;
    limit?: number;
    offset?: number;
  }): Observable<ListMenuItemsByRestaurantResponse>;
  GetRestaurant(req: { id: string }): Observable<GetRestaurantResponse>;
}

@Injectable()
export class CatalogGrpcService implements OnModuleInit {
  private svc!: CatalogServiceGrpc;

  constructor(@Inject('CATALOG_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.svc = this.client.getService<CatalogServiceGrpc>('CatalogService');
  }

  listMenuItemsByRestaurant(data: ListMenuItemsByRestaurantRequest) {
    return firstValueFrom(
      this.svc.ListMenuItemsByRestaurant({
        restaurantId: data.restaurantId,
        onlyAvailable: data.onlyAvailable ?? false,
        limit: data.limit ?? 200,
        offset: data.offset ?? 0,
      }),
    );
  }

  getRestaurant(id: string) {
    return firstValueFrom(this.svc.GetRestaurant({ id }));
  }
}
