import * as Joi from 'joi';

export const configValidationStructure = {
  NODE_ENV: Joi.string().not().empty(),
  CLIENT_ID: Joi.string().not().empty(),
  CLIENT_SECRET: Joi.string().not().empty(),
  ATTESTATIONS_CONNECT_URL: Joi.string().uri(),
  ATTESTATIONS_REDIRECT_URI: Joi.string().uri(),
  IDENTITY_CONNECT_URL: Joi.string().uri(),
  IDENTITY_REDIRECT_URI: Joi.string().uri(),
  PII_CONNECT_URL: Joi.string().uri(),
  PII_REDIRECT_URI: Joi.string().uri(),
  PRIVATE_KEY: Joi.string().not().empty(),
  PRIVATE_KEY_PASSPHRASE: Joi.string().not().empty()
};

export const validationSchema = Joi.object(configValidationStructure);

const getConfig = () => {
  const mergedConfig = Object.keys(configValidationStructure).reduce((accum, key) => {
    accum[key] = process.env[key];
    return accum;
  }, {});
  return mergedConfig;
};

export default () => getConfig();
