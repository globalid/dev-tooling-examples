import * as Joi from 'joi';

export default Joi.object({
  CLIENT_ID: Joi.string(),
  CLIENT_SECRET: Joi.string(),
  BASE_URL: Joi.string().uri(),
  GID_CREDENTIALS_BASE_URL: Joi.string().uri(),
  GID_API_BASE_URL: Joi.string().uri()
});
