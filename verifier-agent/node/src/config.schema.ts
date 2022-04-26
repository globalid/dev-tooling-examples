import * as Joi from 'joi';

export const validate = (config: Record<string, unknown>) => {
  const schema = Joi.object({
    CLIENT_ID: Joi.string().required(),
    CLIENT_SECRET: Joi.string().required(),
    BASE_URL: Joi.string().uri().required(),
    GID_CREDENTIALS_BASE_URL: Joi.string().uri().required(),
    GID_API_BASE_URL: Joi.string().uri().required()
  });

  const { error, value } = schema.validate(config);
  if (process.env.NODE_ENV !== 'test' && error !== undefined) {
    throw new Error(error.message);
  }

  return value;
};
