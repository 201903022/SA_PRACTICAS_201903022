export interface RegisterMerchantDTO {
  name: string;
  email: string;
  password?: string;
  phone_number?: string;
  // Agrega aquí cualquier otro campo que pida tu DTO de Merchant
}