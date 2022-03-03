import * as Joi from 'joi';

export default Joi.object({
  CLIENT_ID: Joi.string(),
  CLIENT_SECRET: Joi.string(),
  CONNECT_URL: Joi.string().uri(),
  REDIRECT_URI: Joi.string().uri(),
  PRIVATE_KEY: Joi.string(),
  PRIVATE_KEY_PASSPHRASE: Joi.string()
});
