import api from "../api/axios";
import { CreateOrderRequest } from "../interfaces/oders/create-orders.interfaces";

export const createOrder = async (orderData: CreateOrderRequest) => {
  const response = await api.post("/orders", orderData);
  return response.data; // Retorna orderId, status, subtotal, etc.
};
