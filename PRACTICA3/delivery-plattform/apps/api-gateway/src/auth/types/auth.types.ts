import { Roles } from 'libs/common/enums/roles.enum';

// lo que esperas que devuelva tu validate(token)
export interface AuthValidatedUser {
  id: string;
  email: string;
  role: Roles; // importante: tipado al enum
  name?: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  user?: AuthValidatedUser;
}
