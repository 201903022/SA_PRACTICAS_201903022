import { MerchantTypesRow } from './merchant-type-row.interface';

export interface IMerchantTypesRepository {
  list(): Promise<MerchantTypesRow[]>;
  findById(id: string): Promise<MerchantTypesRow | null>;
}
