import { Module } from '@nestjs/common';
import { MerchantTypesRepository } from './merchant-types.repository';
import { MerchantTypesGrpcController } from './merchant-types.grpc.controller';
import { ListMerchantTypesUseCase } from './lsit-merchant-types.usecase';

@Module({
  providers: [MerchantTypesRepository, ListMerchantTypesUseCase],
  controllers: [MerchantTypesGrpcController],
})
export class MerchantTypesModule {}
