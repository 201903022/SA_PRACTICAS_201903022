/**
 * Valida si una contraseña cumple con los requisitos del backend:
 * - Mínimo 6 caracteres
 * - Al menos una letra
 * - Al menos un número
 */
export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  
  return passwordRegex.test(password);
};

export const PASSWORD_REQUIREMENT_TEXT = 
  "La contraseña debe tener al menos 6 caracteres, incluir una letra y un número.";