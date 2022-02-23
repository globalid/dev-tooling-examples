import { readFileSync } from 'fs';
import * as Joi from 'joi';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = process.env.YAML_CONFIG_FILENAME || 'config.yaml';

const validationStructure = {
  YAML_CONFIG_FILENAME: Joi.string().pattern(/.+\.yaml/),
  CLIENT_ID: Joi.string().uuid(),
  CLIENT_SECRET: Joi.string().uuid({ separator: false }),
  ATTESTATIONS_CONNECT_URL: Joi.string().uri(),
  ATTESTATIONS_REDIRECT_URI: Joi.string().uri(),
  IDENTITY_CONNECT_URL: Joi.string().uri(),
  IDENTITY_REDIRECT_URI: Joi.string().uri(),
  PII_CONNECT_URL: Joi.string().uri(),
  PII_REDIRECT_URI: Joi.string().uri(),
  PRIVATE_KEY: Joi.string(),
  PRIVATE_KEY_PASSPHRASE: Joi.string(),
};

const getYamlConfig = () => {
  return yaml.load(
    readFileSync(join(__dirname, '..', YAML_CONFIG_FILENAME), 'utf8'), {
      schema: yaml.DEFAULT_SCHEMA,
    }
  ) as Map<string, any>;
}

const getMergedConfig = () => {
  const yamlConfig = getYamlConfig();
  return Object.keys(validationStructure).reduce((accum, key) => {
    return accum[key] = process.env[key] || yamlConfig[key.toLowerCase()];
  }, {});
}

export const validationSchema = Joi.object(validationStructure);
export default () => getMergedConfig();
