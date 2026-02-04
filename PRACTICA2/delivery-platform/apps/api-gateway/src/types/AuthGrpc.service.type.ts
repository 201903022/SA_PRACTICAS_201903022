import { RegisterRequest } from './RegisterRequest.type';

export type AuthGrpcService = {
  Validate(data: { access_token: string }): any;
  Login(data: { email: string; password: string }): any;
  Register(data: RegisterRequest): any;
};
