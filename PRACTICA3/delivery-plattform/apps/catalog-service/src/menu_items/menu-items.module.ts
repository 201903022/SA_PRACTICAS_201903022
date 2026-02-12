import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MenuItemsRepository } from './repo/menu-items.repo';
import { MenuItemsGrpcController } from './grpc/menu-items.grpc.controller';
import { ListMenuItemsByRestaurantUseCase } from './usecases/list-menu-items-by-restaurant.usecase';
import { CreateMenuItemUseCase } from './usecases/create-menut-item.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [MenuItemsGrpcController],
  providers: [
    MenuItemsRepository,
    ListMenuItemsByRestaurantUseCase,
    { provide: 'IMenuItemsRepo', useExisting: MenuItemsRepository },
    CreateMenuItemUseCase,
  ],
  exports: [
    { provide: 'IMenuItemsRepo', useExisting: MenuItemsRepository },
    // (opcional) exporta el repo si algun otro modulo lo necesita
    // MenuItemsRepository,
  ],
})
export class MenuItemsModule {}
