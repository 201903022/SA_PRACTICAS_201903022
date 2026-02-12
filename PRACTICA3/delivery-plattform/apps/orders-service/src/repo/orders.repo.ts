import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrderTx(input: {
    customerUserId: string;
    restaurantId: string;
    restaurantNameSnapshot: string;
    deliveryAddress: string;
    currency: string;
    items: {
      menuItemId: string;
      itemNameSnapshot: string;
      quantity: number;
      unitPrice: number;
    }[];
  }) {
    const totalAmount = input.items.reduce(
      (acc, it) => acc + it.unitPrice * it.quantity,
      0,
    );

    return this.prisma.$transaction(async (tx) => {
      // 1) Crear order (usa campos reales)
      const order = await tx.orders.create({
        data: {
          customer_user_id: input.customerUserId,
          restaurant_id: input.restaurantId,

          // OJO: tu status es enum postgres order_status, el default ya es CREATED.
          // Si queres setearlo, usa un valor que exista en ese enum.
          // Si no estas seguro, dejalo sin setear.
          // status: 'CREATED' as any,

          restaurant_name_snapshot: input.restaurantNameSnapshot,
          delivery_address: input.deliveryAddress,
          total_amount: totalAmount,
          currency: input.currency,
        },
        select: {
          id: true,
          total_amount: true,
          currency: true,
        },
      });

      // 2) Crear items (campos reales)
      await tx.order_items.createMany({
        data: input.items.map((it) => ({
          order_id: order.id,
          menu_item_id: it.menuItemId,
          item_name_snapshot: it.itemNameSnapshot,
          unit_price: it.unitPrice,
          quantity: it.quantity,
          line_total: it.unitPrice * it.quantity,
        })),
      });

      return order;
    });
  }
}
