import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MerchantTypesModule } from './merchant-types/merchant-types.module';
import { MenuItemsModule } from './menu_items/menu-items.module';

import { CatalogServiceController } from './catalog-service.controller';
import { CatalogServiceService } from './catalog-service.service';
import { HealthController } from './health/health.controller';
import { RestaurantsGrpcController } from './restaurants/restaurant.grpc.controller';
import { GetRestaurantByOwnerIdUseCase } from './restaurants/get-restaurant-by-owner.usecase';
import { RestaurantsRepository } from './restaurants/restaurants.repository';
import { CreateCompanyUseCase } from './restaurants/create-restaurant.usecase';
import { MerchantTypesRepository } from './merchant-types/merchant-types.repository';
import { ListRestaurantsUseCase } from './restaurants/find-all.usecase';
import { FindOneUseCase } from './restaurants/usecases/find-by-id.usecase';

@Module({
  imports: [PrismaModule, MerchantTypesModule, MenuItemsModule],
  controllers: [
    CatalogServiceController,
    HealthController,
    RestaurantsGrpcController,
  ],
  providers: [
    CatalogServiceService,
    GetRestaurantByOwnerIdUseCase,
    RestaurantsRepository,
    CreateCompanyUseCase,
    MerchantTypesRepository,
    ListRestaurantsUseCase,
    FindOneUseCase,
  ],
})
export class CatalogServiceModule {}
