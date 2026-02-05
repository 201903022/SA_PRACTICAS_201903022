import axios from "axios";
import { validatePassword } from "../utils/validatePassword";
import { storage } from "../utils/cookies";

const API_URL = import.meta.env.VITE_API_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "";
const BASE_URL = `${API_URL}${API_PREFIX}`;

export const registerUser = async (userData) => {
  if (!validatePassword(userData.password)) {
    throw new Error(
      "La contraseña debe tener al menos 6 caracteres, incluir una letra y un número.",
    );
  }

  try {
    const dataToBackend = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone_number: userData.phone,
      role: userData.role === "USER" ? "CUSTOMER" : userData.role,
    };

    const response = await axios.post(
      `${BASE_URL}/auth/register`,
      dataToBackend,
    );

    return response.data;
  } catch (error) {
    console.error("Detalle real del error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Error en el registro");
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: credentials.email,
      password: credentials.password,
    });

    if (response.data.access_token) {
      storage.setToken("access_token", response.data.access_token);
      storage.setToken("refresh_token", JSON.stringify(response.data.user));
      storage.setToken("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("Error en login:", error.response?.data);
    throw new Error(error.response?.data?.message || "Credenciales inválidas");
  }
};
