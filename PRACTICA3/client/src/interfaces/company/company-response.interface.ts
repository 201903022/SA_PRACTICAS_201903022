export interface CompanyResponse {
  found: boolean;
  restaurant?: {
    id: string;
    name: string;
    address: string;
    phone: string;
    alias: string;
    openingHours: string;
    isActive: boolean;
    merchantTypeId: string;
  };
}