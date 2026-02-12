import { UserRole } from "../enums/roles.enum";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}