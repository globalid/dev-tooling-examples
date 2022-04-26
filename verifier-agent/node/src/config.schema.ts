import * as Joi from 'joi';

export default Joi.object({
  CLIENT_ID: Joi.string().required(),
  CLIENT_SECRET: Joi.string().required(),
  BASE_URL: Joi.string().uri().required(),
  GID_CREDENTIALS_BASE_URL: Joi.string().uri().required(),
  GID_API_BASE_URL: Joi.string().uri().required()
});
