import * as Joi from 'joi';

export default Joi.object({
  CLIENT_ID: Joi.string(),
  CLIENT_SECRET: Joi.string(),
  ATTESTATIONS_CONNECT_URL: Joi.string().uri(),
  ATTESTATIONS_REDIRECT_URI: Joi.string().uri(),
  IDENTITY_CONNECT_URL: Joi.string().uri(),
  IDENTITY_REDIRECT_URI: Joi.string().uri(),
  PII_CONNECT_URL: Joi.string().uri(),
  PII_REDIRECT_URI: Joi.string().uri(),
  PRIVATE_KEY: Joi.string(),
  PRIVATE_KEY_PASSPHRASE: Joi.string()
});
