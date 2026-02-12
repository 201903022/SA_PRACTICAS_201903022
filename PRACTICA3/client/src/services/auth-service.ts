import axios, { AxiosError } from "axios";
import { validatePassword } from "../utils/validatePassword";
import {
  setCookieToken,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "../utils/cookies";
import { RegisterData } from "../interfaces/auth.register.interface";
import { AuthResponse } from "../interfaces/auth.response.interface";

const API_URL = import.meta.env.VITE_API_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "";
const BASE_URL = `${API_URL}${API_PREFIX}`;

export const registerUser = async (userData: RegisterData): Promise<any> => {
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
      phone_number: userData.phone_number,
      // Mapeo seguro de roles
      role: userData.role === "USER" ? "CUSTOMER" : userData.role,
    };

    const response = await axios.post(
      `${BASE_URL}/auth/register`,
      dataToBackend,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error("Detalle real del error:", axiosError.response?.data);
    throw new Error(
      axiosError.response?.data?.message || "Error en el registro",
    );
  }
};

export const loginUser = async (
  credentials: Pick<RegisterData, "email" | "password">,
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/login`, {
      email: credentials.email,
      password: credentials.password,
    });

    const { access_token, refresh_token } = response.data;

    if (access_token && refresh_token) {
      // Usamos tus funciones de cookies.ts con sus tiempos de expiración correctos
      setCookieToken(ACCESS_TOKEN_KEY, access_token, 1); // 1 día
      setCookieToken(REFRESH_TOKEN_KEY, refresh_token, 14); // 14 días
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error("Error en login:", axiosError.response?.data);
    throw new Error(
      axiosError.response?.data?.message || "Credenciales inválidas",
    );
  }
};
