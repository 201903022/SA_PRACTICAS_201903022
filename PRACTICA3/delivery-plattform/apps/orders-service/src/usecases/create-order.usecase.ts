import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { OrdersRepository } from '../repo/orders.repo';
import { CatalogGrpcService } from '../catalog/catalogo.grpc';
function toCents(v: number) {
  return Math.round(v * 100);
}
@Injectable()
export class CreateOrderUseCase {
  private readonly logger = new Logger(CreateOrderUseCase.name);
  constructor(
    private readonly repo: OrdersRepository,
    private readonly catalogGrpc: CatalogGrpcService,
  ) {}

  async execute(input: {
    customerUserId: string;
    restaurantId: string;
    items: { menuItemId: string; quantity: number; expectedPrice?: number }[];
    deliveryAddress: string;
  }) {
    this.logger.debug(
      `Creating order for customer ${input.customerUserId} at restaurant ${input.restaurantId}`,
    );
    //log items
    this.logger.debug(`Order items: ${JSON.stringify(input.items)}`);
    if (!input.customerUserId || !input.restaurantId) {
      throw new RpcException({
        code: 3,
        message: 'customerUserId and restaurantId are required',
      });
    }
    if (!Array.isArray(input.items) || input.items.length === 0) {
      throw new RpcException({ code: 3, message: 'items are required' });
    }

    // 1) Traer menu disponible desde catalog
    const menuRes = await this.catalogGrpc.listMenuItemsByRestaurant({
      restaurantId: input.restaurantId,
      onlyAvailable: false,
      limit: 1000,
      offset: 0,
    });
    const menu = menuRes.items ?? [];
    this.logger.debug(
      `Catalog returned ${menu.length} items. First IDs: ${menu
        .slice(0, 5)
        .map((x) => x.id)
        .join(', ')}`,
    );

    // 2) Index por id para validar rapido
    const byId = new Map(menu.map((m) => [m.id, m]));

    // 3) Validar items y armar precios reales

    const normalized = input.items.map((it) => {
      this.logger.debug(`Validating item: ${JSON.stringify(it)}`);
      const mi = byId.get(it.menuItemId);
      if (!mi) {
        throw new RpcException({
          code: 3,
          message: `menuItemId not found on restaurant ${input.restaurantId}: ${it.menuItemId}`,
        });
      }

      if (!mi.isAvailable) {
        throw new RpcException({
          code: 3,
          message: `Item not available: ${mi.name}`,
        });
      }

      if (!Number.isInteger(it.quantity) || it.quantity <= 0) {
        throw new RpcException({
          code: 3,
          message: `invalid quantity for ${mi.name}`,
        });
      }

      if (it.expectedPrice != null) {
        if (
          typeof it.expectedPrice !== 'number' ||
          !Number.isFinite(it.expectedPrice) ||
          it.expectedPrice <= 0
        ) {
          throw new RpcException({
            code: 3,
            message: `invalid expectedPrice for ${mi.name}`,
          });
        }

        const expectedCents = toCents(it.expectedPrice);
        const officialCents = toCents(mi.price);

        if (expectedCents !== officialCents) {
          throw new RpcException({
            code: 3,
            message: `Price mismatch for ${mi.name}. Expected ${it.expectedPrice.toFixed(2)} ${mi.currency}, current ${mi.price.toFixed(2)} ${mi.currency}`,
          });
        }
      }

      return {
        menuItemId: mi.id,
        itemNameSnapshot: mi.name,
        quantity: it.quantity,
        unitPrice: mi.price, // ?  SIEMPRE precio oficial
      };
    });

    // 4) Moneda: usa la del restaurant/menu (asumo todos igual)
    const currency = menu[0]?.currency ?? 'GTQ';

    const r = await this.catalogGrpc.getRestaurant(input.restaurantId);
    if (!r?.restaurant?.id) {
      throw new RpcException({ code: 3, message: 'Restaurant not found' });
    }
    const restaurantNameSnapshot = r.restaurant?.name ?? 'Unknown Restaurant'; // <- sacalo de donde puedas

    // 5) Guardar en DB (transaccion)
    const order = await this.repo.createOrderTx({
      customerUserId: input.customerUserId,
      restaurantId: input.restaurantId,
      restaurantNameSnapshot: restaurantNameSnapshot, // <- sacalo de donde puedas
      deliveryAddress: input.deliveryAddress, // <- del request
      currency,
      items: normalized,
    });

    return {
      orderId: order.id,
      subtotal: Number(order.total_amount),
      currency: order.currency,
      status: 'CREATED',
    };
  }
}
