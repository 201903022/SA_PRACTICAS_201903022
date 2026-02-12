import { User } from "./auth.interface";

export interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (accessToken:string, refreshToken:string) => void;
  logout: () => void;
}