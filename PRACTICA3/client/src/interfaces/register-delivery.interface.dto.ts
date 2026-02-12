export interface RegisterDeliveryDTO {
  name: string;
  email: string;
  phone_number: string; // El que viene del formulario
  password?: string; // Opcional si el backend la genera
}