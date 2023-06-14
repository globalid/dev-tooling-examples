import * as Joi from 'joi';

export const validationSchema = Joi.object({
  BASE_URL: Joi.string().uri().required(),
  CLIENT_ID: Joi.string().required(),
  PRESENTATION_REQUIREMENTS_PATH: Joi.string().default('src/presentation-request/presentation-requirements'),
  CLIENT_SECRET: Joi.string().required(),
  APP_UUID: Joi.string().required()
}).unknown();
