import * as Joi from 'joi';

export const validate = (config: Record<string, unknown>) => {
  const schema = Joi.object({
    BASE_URL: Joi.string().uri().required(),
    CLIENT_ID: Joi.string().required(),
    CLIENT_SECRET: Joi.string().required(),
    GID_API_BASE_URL: Joi.string().uri().required(),
    GID_CREDENTIALS_BASE_URL: Joi.string().uri().required(),
    INITIATION_URL: Joi.string().uri().required(),
    NODE_ENV: Joi.string(),
    REDIRECT_URL: Joi.string().uri().required()
  }).unknown();

  const { error, value } = schema.validate(config);
  if (process.env.NODE_ENV !== 'test' && error !== undefined) {
    throw new Error(error.message);
  }

  return value;
};
