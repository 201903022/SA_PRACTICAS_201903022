import api from '../api/axios'; // Tu instancia de axios blindada
import { UserRole } from '../enums/roles.enum';
import { RegisterDeliveryDTO } from '../interfaces/register-delivery.interface.dto';
import { RegisterMerchantDTO } from '../interfaces/register-merchatn.dto';

/**
 * Registra un nuevo repartidor (DRIVER)
 * Solo accesible por ADMIN
 */

const userRole:UserRole = UserRole.ADMIN; // Forzamos el rol para asegurar integridad
export const registerDelivery = async (deliveryData: RegisterDeliveryDTO): Promise<any> => {
  try {
    // La URL coincide con tu @Post('register/delivery') en NestJS
    const response = await api.post('/auth/admin/register/delivery', {
      name: deliveryData.name,
      email: deliveryData.email,
      phone_number: deliveryData.phone, // Mapeo al campo que espera el Backend
      password: deliveryData.password,
      role: UserRole.DRIVER 
    });
    return response.data;
  } catch (error: any) {
    console.error('Error en registrar delivery:', error);
    const message = error.response?.data?.message || 'Error al registrar repartidor';
    throw new Error(message);
  }
};

/**
 * Registra una nueva empresa (MERCHANT)
 * Solo accesible por ADMIN
 */
export const registerCompany = async (companyData: RegisterMerchantDTO): Promise<any> => {
  try {
    const response = await api.post(`/auth/admin/register/merchant`, {
      ...companyData,
      role: UserRole.MERCHANT // Forzamos el rol para asegurar integridad
    });
    return response.data;
  } catch (error: any) {
    console.error('Error en registrar empresa:', error);
    const message = error.response?.data?.message || 'Error al registrar empresa';
    throw new Error(message);
  }
};