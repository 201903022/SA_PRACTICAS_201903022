export interface CompanyRegisterDTO {
  name: string;
  address: string;
  phone?: string;
  alias?: string;
  openingHours?: string;
  merchantTypeId: string;
}