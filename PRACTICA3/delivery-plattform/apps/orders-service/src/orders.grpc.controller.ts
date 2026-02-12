import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateOrderUseCase } from './usecases/create-order.usecase';

type OrderItemInput = {
  menuItemId: string;
  quantity: number;
  expectedPrice?: number;
};
type CreateOrderRequest = {
  customerUserId: string;
  restaurantId: string;
  items: OrderItemInput[];
  notes?: string;
  deliveryAddress: string;
};

@Controller()
export class OrdersGrpcController {
  constructor(private readonly createUC: CreateOrderUseCase) {}

  @GrpcMethod('OrdersService', 'CreateOrder')
  createOrder(req: CreateOrderRequest) {
    return this.createUC.execute(req);
  }
}
