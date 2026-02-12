export const EnvConfig = () => ({
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'localhost:50052',
  catalogServiceUrl: process.env.CATALOG_SERVICE_URL || 'localhost:50053',
  orderServiceUrl: process.env.ORDER_SERVICE_URL || 'localhost:50054',
});
