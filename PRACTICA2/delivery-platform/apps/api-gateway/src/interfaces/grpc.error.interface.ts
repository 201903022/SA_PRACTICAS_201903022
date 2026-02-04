export interface GrpcError {
  code: number;
  details: string;
  message?: string;
}
