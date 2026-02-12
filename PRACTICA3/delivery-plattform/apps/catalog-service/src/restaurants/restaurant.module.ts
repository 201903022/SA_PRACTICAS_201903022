import { Module } from '@nestjs/common';
import { RestaurantsRepository } from './restaurants.repository';
import { GetRestaurantByOwnerIdUseCase } from './get-restaurant-by-owner.usecase';
import { RestaurantsGrpcController } from './restaurant.grpc.controller';
import { ListRestaurantsUseCase } from './find-all.usecase';
import { CreateCompanyUseCase } from './create-restaurant.usecase';
import { FindOneUseCase } from './usecases/find-by-id.usecase';

@Module({
  controllers: [RestaurantsGrpcController],
  providers: [
    RestaurantsRepository,
    GetRestaurantByOwnerIdUseCase,
    ListRestaurantsUseCase,
    CreateCompanyUseCase,
  ],
  exports: [
    ListRestaurantsUseCase,
    CreateCompanyUseCase,
    GetRestaurantByOwnerIdUseCase,
    FindOneUseCase,
  ],
})
export class RestaurantsModule {}
