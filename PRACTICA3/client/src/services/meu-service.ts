import api from "../api/axios";
import { MenuCategory } from "../interfaces/menu/Menu.interfaces";

export const getAllMenus = async (): Promise<MenuCategory[]> => {
  const response = await api.get<{ menus: MenuCategory[] }>(
    "/catalog/menu-all-items",
  );
  return response.data.menus || [];
};
