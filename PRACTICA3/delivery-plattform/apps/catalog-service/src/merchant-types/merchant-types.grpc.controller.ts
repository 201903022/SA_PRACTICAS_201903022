import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ListMerchantTypesUseCase } from './lsit-merchant-types.usecase';

@Controller()
export class MerchantTypesGrpcController {
  constructor(private readonly listUc: ListMerchantTypesUseCase) {}

  @GrpcMethod('CatalogService', 'ListMerchantTypes')
  async listMerchantTypes() {
    return this.listUc.execute();
  }
}
