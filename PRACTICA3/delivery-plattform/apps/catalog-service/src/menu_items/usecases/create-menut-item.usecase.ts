import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../../prisma/prisma.service';
import type { IMenuItemsRepo } from '../interfaces/menut-items.repo.interface';

function isUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v,
  );
}

export type CreateMenuItemRequest = {
  ownerUserId: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  isAvailable?: boolean;
  categoryIds?: string[];
};

@Injectable()
export class CreateMenuItemUseCase {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('IMenuItemsRepo') private readonly repo: IMenuItemsRepo,
  ) {}

  async execute(input: CreateMenuItemRequest) {
    // 1) Validaciones basicas
    if (!isUuid(input.ownerUserId)) {
      throw new RpcException({
        code: 3,
        message: 'ownerUserId must be a valid UUID',
      });
    }
    const name = (input.name ?? '').trim();
    if (!name) {
      throw new RpcException({ code: 3, message: 'name is required' });
    }
    if (!Number.isFinite(input.price) || input.price < 0) {
      throw new RpcException({
        code: 3,
        message: 'price must be a number >= 0',
      });
    }

    const currency = (input.currency ?? 'GTQ').trim() || 'GTQ';
    const isAvailable = input.isAvailable ?? true;

    // 2) Resolver restaurant por ownerUserId
    const restaurant = await this.prisma.restaurants.findFirst({
      where: { owner_user_id: input.ownerUserId, is_active: true },
      select: { id: true },
    });

    if (!restaurant) {
      throw new RpcException({
        code: 5,
        message: 'restaurant not found for this owner',
      });
    }

    // 3) Limpiar/validar categoryIds (opcional)
    const categoryIds = Array.from(new Set(input.categoryIds ?? []))
      .map((x) => x.trim())
      .filter((x) => x.length > 0);

    for (const id of categoryIds) {
      if (!isUuid(id)) {
        throw new RpcException({
          code: 3,
          message: 'categoryIds must be valid UUIDs',
        });
      }
    }

    // Validar que las categorias pertenezcan al restaurant
    if (categoryIds.length > 0) {
      const count = await this.prisma.menu_item_categories.count({
        where: { id: { in: categoryIds }, restaurant_id: restaurant.id },
      });

      if (count !== categoryIds.length) {
        throw new RpcException({
          code: 3,
          message: 'some categoryIds do not belong to this restaurant',
        });
      }
    }

    // 4) Crear item + map en una sola transaccion
    const createdRow = await this.prisma.$transaction(async (tx) => {
      // OJO: aqui uso tx para el map.
      // Para crear el item, podemos usar tx.menu_items.create directamente
      // o reutilizar tu repo pero el repo usa this.prisma, no tx.
      // Asi que lo hacemos con tx para que sea 1 transaccion real.

      const item = await tx.menu_items.create({
        data: {
          restaurant_id: restaurant.id,
          name,
          description: input.description?.trim()
            ? input.description.trim()
            : null,
          price: input.price,
          currency: currency.slice(0, 3),
          is_available: isAvailable,
        },
        select: {
          id: true,
          restaurant_id: true,
          name: true,
          description: true,
          price: true,
          currency: true,
          is_available: true,
        },
      });

      if (categoryIds.length > 0) {
        await tx.menu_item_category_map.createMany({
          data: categoryIds.map((categoryId) => ({
            menu_item_id: item.id,
            category_id: categoryId,
          })),
          skipDuplicates: true,
        });
      }

      return item;
    });

    // 5) Respuesta (proto)
    return createdRow;
  }
}
