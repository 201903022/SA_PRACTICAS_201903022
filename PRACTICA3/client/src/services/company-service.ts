import api from "../api/axios";
import { CompanyRegisterDTO } from "../interfaces/company/company.register.dto";
import { CreateMenuItemDto } from "../interfaces/company/crate-menu-item.dto";
import { MerchantType } from "../interfaces/company/MerchantType.interface";
import { Product } from "../interfaces/company/product.interface";
import { MenuResponse } from "../interfaces/menu-response.interface";

export const getCompanyInfo = async () => {
  try {
    console.log("Respuesta de getCompanyInfo");
    const response = await api.get("/catalog/my/company");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener información de la empresa:", error);
    throw error;
  }
};
/**
 * Registra una nueva empresa en el sistema
 */
export const registerCompany = async (
  companyData: CompanyRegisterDTO,
): Promise<void> => {
  try {
    await api.post("/catalog/my/company", companyData);
  } catch (error) {
    console.error("Error al registrar empresa:", error);
    throw error;
  }
};

export const getMerchantTypes = async (): Promise<MerchantType[]> => {
  try {
    const response = await api.get<{ merchantTypes: MerchantType[] }>(
      "/catalog/merchant-types",
    );

    // Aquí es donde sucede la magia: retornamos solo el array
    return response.data.merchantTypes || [];
  } catch (error) {
    console.error("Error al obtener tipos de comercio:", error);
    return [];
  }
};

/**
 * Obtiene los productos del menú del merchant logueado.
 * Si no hay productos o la respuesta es null, devuelve un array vacío.
 */
export const getMyProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<MenuResponse | null>(
      "/catalog/my/company/menu-items/",
    );

    // Si la respuesta es null o no tiene items, retornamos array vacío
    if (!response.data || !response.data.items) {
      return [];
    }

    return response.data.items;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};

export const createMenuItem = async (
  data: CreateMenuItemDto,
): Promise<void> => {
  try {
    await api.post("/catalog/my/company/menu-items/", data);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw error;
  }
};
