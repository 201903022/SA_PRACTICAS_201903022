import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  // Recomendado: una sola variable host:port para gRPC
  AUTH_SERVICE_GRPC_URL: Joi.string()
    .pattern(/^[^:]+:\d+$/) // ejemplo: localhost:50052
    .required()
    .messages({
      'any.required':
        'AUTH_SERVICE_GRPC_URL es obligatoria (ej: localhost:50052)',
      'string.pattern.base':
        'AUTH_SERVICE_GRPC_URL debe tener formato host:puerto (ej: localhost:50052)',
    }),
  CATALOG_SERVICE_GRPC_URL: Joi.string()
    .pattern(/^[^:]+:\d+$/) // ejemplo: localhost:50052
    .required()
    .messages({
      'any.required':
        'CATALOG_SERVICE_GRPC_URL es obligatoria (ej: localhost:50052)',
      'string.pattern.base':
        'CATALOG_SERVICE_GRPC_URL debe tener formato host:puerto (ej: localhost:50052)',
    }),
  ORDER_SERVICE_GRPC_URL: Joi.string()
    .pattern(/^[^:]+:\d+$/) // ejemplo: localhost:50052
    .required()
    .messages({
      'any.required':
        'ORDER_SERVICE_GRPC_URL es obligatoria (ej: localhost:50052)',
      'string.pattern.base':
        'ORDER_SERVICE_GRPC_URL debe tener formato host:puerto (ej: localhost:50052)',
    }),

  // (Opcional) si quieres validar el port del gateway o similares:
  PORT: Joi.number().port().default(3000),
})
  // permite que existan otras variables en el .env sin romper
  .unknown(true);
