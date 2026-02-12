import {
  Logger,
  Controller,
  Get,
  Post,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OrdersGrpsService } from './orders.grpc';
import { CreateOrderDto } from './dto/crate-order.dto';
import type { RequestWithUser } from '../common/types/request-with-user.type';
import { UserGuard } from '../guards/UserOperation.guard';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);
  constructor(private readonly ordersService: OrdersGrpsService) {}

  @Get('health')
  health() {
    return this.ordersService.health();
  }

  @UseGuards(UserGuard)
  @Post()
  async createOrder(@Req() req: RequestWithUser, @Body() body: CreateOrderDto) {
    this.logger.debug(
      `Received create order request from user ${req.user.id} for restaurant ${body.restaurantId}`,
    );
    return this.ordersService.createOrder({
      customerUserId: req.user.id,
      restaurantId: body.restaurantId,
      deliveryAddress: body.deliveryAddress,
      items: body.items.map((it) => ({
        menuItemId: it.menuItemId,
        quantity: it.quantity,
        expectedPrice: it.expectedPrice, // ✅ nuevo
      })),
    });
  }
}
