import { Roles } from 'libs/common/enums/roles.enum';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: Roles;
  iat?: number;
  exp?: number;
}
