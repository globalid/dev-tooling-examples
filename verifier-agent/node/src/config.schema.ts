import * as Joi from 'joi';

export default Joi.object({
  CLIENT_ID: Joi.string(),
  CLIENT_SECRET: Joi.string(),
  CREDENTIALS_BASE_URL: Joi.string().uri(),
  API_BASE_URL: Joi.string().uri()
});
