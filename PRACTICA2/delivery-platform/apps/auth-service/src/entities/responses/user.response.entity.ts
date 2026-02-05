import { UserData } from '../../interfaces/user.data.interface';

export class UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;

  constructor(data: UserData) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.role = data.role;
  }
}
