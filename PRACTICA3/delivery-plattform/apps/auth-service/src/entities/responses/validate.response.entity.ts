import { UserResponse } from './user.response.entity';

export class ValidateResponse {
  valid: boolean;
  user: UserResponse;

  constructor(valid: boolean, user: UserResponse) {
    this.valid = valid;
    this.user = user;
  }
}
