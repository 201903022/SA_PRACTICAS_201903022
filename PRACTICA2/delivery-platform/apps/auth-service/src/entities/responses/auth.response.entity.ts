import { UserData } from '../../interfaces/userData.interface';
import { UserResponse } from './user.response.entity';

export class AuthResponse {
  access_token: string;
  refresh_token: string;
  user: UserResponse;

  constructor(accessToken: string, refreshToken: string, userData: UserData) {
    this.access_token = accessToken;
    this.refresh_token = refreshToken;
    this.user = new UserResponse(userData);
  }
}
