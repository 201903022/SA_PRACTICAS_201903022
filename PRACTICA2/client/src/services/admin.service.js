// Añade esto a auth.service.js
import api from '../api/axios';


export const registerDelivery = async (deliveryData) => {
  try {
    // Fíjate que la URL coincide con tu @Post('register/delivery')
    const response = await api.post('auth/admin/register/delivery', {
      name: deliveryData.name,
      email: deliveryData.email,
      phone_number: deliveryData.phone, // Ajustado al DTO del backend
      password: deliveryData.password,
      role: 'DRIVER' 
    });
    return response.data;
  } catch (error) {
    console.log('Hubo un error en registrar delivery',error)
    const message = error.response?.data?.message || 'Error al registrar repartidor';
    throw new Error(message);
  }
};
export const registerCompany = async (data) => {
  const API_URL = import.meta.env.VITE_API_URL;
  try {
    const response = await api.post(`/auth/admin/register/merchant`, {
      ...data,
      role: 'MERCHANT' // Forzamos el rol
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al registrar empresa');
  }
};