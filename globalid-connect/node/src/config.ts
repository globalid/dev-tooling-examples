import { readFileSync } from 'fs';
import * as Joi from 'joi';
import * as yaml from 'js-yaml';
import { join, resolve } from 'path';

const YAML_CONFIG_FILENAME = process.env.YAML_CONFIG_FILENAME || 'config.yaml';

export const configValidationStructure = {
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

export const validationSchema = Joi.object(configValidationStructure);

const getYamlConfig = () => {
  const yamlConfig = yaml.load(
    readFileSync(resolve(`./${YAML_CONFIG_FILENAME}`), 'utf8'), {
      schema: yaml.DEFAULT_SCHEMA,
    }
  );
  console.log('yamlConfig', yamlConfig);
  return yamlConfig;
}

const getMergedConfig = () => {
  console.log('Config keys', JSON.stringify(Object.keys(configValidationStructure)));
  const yamlConfig = getYamlConfig();
  console.log('yamlConfig2', yamlConfig);
  return Object.keys(configValidationStructure).reduce((accum, key) => {
    console.log('accum', accum, 'key', key, 'yamlConfig[key.toLowerCase()]', yamlConfig[key.toLowerCase()]);
    return accum[key] = process.env[key] ?? yamlConfig[key.toLowerCase()];
  }, { something: 'initial'});
}

export default () => getMergedConfig();
