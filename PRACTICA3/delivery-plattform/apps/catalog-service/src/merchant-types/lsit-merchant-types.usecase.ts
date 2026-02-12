import { Injectable } from '@nestjs/common';
import { MerchantTypesRepository } from './merchant-types.repository';

@Injectable()
export class ListMerchantTypesUseCase {
  constructor(private readonly repo: MerchantTypesRepository) {}

  async execute() {
    const rows = await this.repo.list();

    return {
      merchantTypes: rows.map((r) => ({
        id: r.id,
        code: r.code,
        name: r.name,
        description: r.description ?? '',
      })),
    };
  }
}
