import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri().required(),

  JWT_ACCESS_SECRET: Joi.string().min(10).required(),
  JWT_REFRESH_SECRET: Joi.string().min(10).required(),

  // TTLs tipo "15m", "14d", "1h", "30s"
  JWT_ACCESS_TTL: Joi.string()
    .pattern(/^\d+\s*(s|m|h|d)$/)
    .required()
    .messages({
      'string.pattern.base': 'JWT_ACCESS_TTL debe ser como 15m, 1h, 14d',
    }),

  JWT_REFRESH_TTL: Joi.string()
    .pattern(/^\d+\s*(s|m|h|d)$/)
    .required()
    .messages({
      'string.pattern.base': 'JWT_REFRESH_TTL debe ser como 15m, 1h, 14d',
    }),

  // gRPC url: host:port o 0.0.0.0:50052
  AUTH_SERVICE_GRPC_URL: Joi.string()
    .pattern(/^[^:]+:\d+$/)
    .default('0.0.0.0:50052')
    .messages({
      'string.pattern.base':
        'AUTH_SERVICE_GRPC_URL debe tener formato host:puerto (ej: 0.0.0.0:50052)',
    }),
}).unknown(true);
