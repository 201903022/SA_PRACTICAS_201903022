// Añade esto a auth.service.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const registerDelivery = async (data) => {
  const API_URL = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      ...data,
      role: 'DELIVERY' // Forzamos el rol
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al registrar repartidor');
  }
};

export const registerCompany = async (data) => {
  const API_URL = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      ...data,
      role: 'COMPANY' // Forzamos el rol
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al registrar empresa');
  }
};