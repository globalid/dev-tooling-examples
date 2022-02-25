import { readFileSync } from 'fs';
import * as Joi from 'joi';
import * as yaml from 'js-yaml';
import { resolve } from 'path';

const YAML_CONFIG_FILENAME = process.env.YAML_CONFIG_FILENAME || 'config.yaml';

export const configValidationStructure = {
  NODE_ENV: Joi.string().valid('development', 'test', 'production'),
  YAML_CONFIG_FILENAME: Joi.string().pattern(/\.ya?ml$/),
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

const getYamlConfig = () => {
  const yamlConfig = yaml.load(readFileSync(resolve(`./${YAML_CONFIG_FILENAME}`), 'utf8'), {
    schema: yaml.DEFAULT_SCHEMA
  });
  return yamlConfig;
};

const getMergedConfig = () => {
  const yamlConfig = getYamlConfig();
  const mergedConfig = Object.keys(configValidationStructure).reduce((accum, key) => {
    accum[key] = yamlConfig[key] || process.env[key];
    return accum;
  }, {});
  return mergedConfig;
};

export default () => getMergedConfig();
