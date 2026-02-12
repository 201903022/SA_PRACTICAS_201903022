import { ValidRoles } from "../types/valid.roles.type";

export interface User {
  id: string;
  name: string;
  email: string;
  role: ValidRoles;
}