import { MerchantTypesRow } from '../interfaces/merchant-type-row.interface';
import { MerchantTypesDto } from '../types/merchant-types.type';

export class MerchantTypesMapper {
  static toDto(r: MerchantTypesRow): MerchantTypesDto {
    return {
      id: r.id,
      code: r.code,
      name: r.name,
      description: r.description,
    };
  }
}
