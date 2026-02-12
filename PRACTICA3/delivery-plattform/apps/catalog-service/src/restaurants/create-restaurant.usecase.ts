import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RestaurantsRepository } from './restaurants.repository';

type Input = {
  name: string;
  address: string;
  phone: string;
  alias: string;
  openingHours: string;
  merchantTypeId: string;
  ownerUserId: string;
};

type RestaurantOut = {
  id: string;
  name: string;
  address: string;
  phone: string;
  alias: string;
  openingHours: string;
  isActive: boolean;
  merchantTypeId: string;
};

function isUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v,
  );
}

@Injectable()
export class CreateCompanyUseCase {
  constructor(private readonly repo: RestaurantsRepository) {}

  async execute(input: Input): Promise<{ restaurant: RestaurantOut }> {
    // ? Imprimir input para debug
    console.log('CreateCompanyUseCase input:', input);
    // validaciones duras (evita errores Prisma tipo UUID)
    if (!isUuid(input.ownerUserId)) {
      throw new RpcException({ code: 3, message: 'ownerUserId invalid uuid' });
    }
    if (!isUuid(input.merchantTypeId)) {
      throw new RpcException({
        code: 3,
        message: 'merchantTypeId invalid uuid',
      });
    }

    // regla: 1 usuario = 1 empresa
    const existing = await this.repo.findOneByOwnerId({
      ownerUserId: input.ownerUserId,
      onlyActive: false,
    });

    if (existing) {
      // ALREADY_EXISTS
      throw new RpcException({
        code: 6,
        message: 'Company already exists for this user',
      });
    }

    // crea
    const created = await this.repo.createCompany(input);

    return {
      restaurant: {
        id: created.id,
        name: created.name,
        address: created.address,
        phone: created.phone ?? '',
        alias: created.alias ?? '',
        openingHours: created.opening_hours ?? '', // ojo snake_case en prisma
        isActive: created.is_active,
        merchantTypeId: created.merchant_type_id,
      },
    };
  }
}
