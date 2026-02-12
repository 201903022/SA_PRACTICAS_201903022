import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices'; // ! import type
import { firstValueFrom, Observable } from 'rxjs';
import {
  CreateOrderRequest,
  CreateOrderResponse,
} from './types/create-order.type';
type HealhRequest = {};
type HealthResponse = { status: string; service: string; ts: number };

interface OrderGrpcService {
  Health(req: HealhRequest): Observable<HealthResponse>;
  CreateOrder(req: CreateOrderRequest): Observable<CreateOrderResponse>;
}
@Injectable()
export class OrdersGrpsService implements OnModuleInit {
  private readonly logger = new Logger(OrdersGrpsService.name);
  private ordersSvc: OrderGrpcService;

  constructor(@Inject('ORDERS_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.ordersSvc = this.client.getService('OrdersService');
  }

  async health(): Promise<HealthResponse> {
    return await firstValueFrom(this.ordersSvc.Health({}));
  }

  async createOrder(req: {
    customerUserId: string;
    restaurantId: string;
    deliveryAddress: string;
    items: {
      menuItemId: string;
      quantity: number;
      expectedPrice?: number;
    }[];
  }) {
    this.logger.debug(
      `Sending create order request for user ${req.customerUserId} to restaurant ${req.restaurantId}`,
    );
    this.logger.debug(`Order items: ${JSON.stringify(req.items)}`);
    return firstValueFrom(this.ordersSvc.CreateOrder(req));
  }
}
