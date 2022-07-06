import * as Joi from 'joi';

export const validationSchema = Joi.object({
  BASE_URL: Joi.string().uri().required(),
  CLIENT_ID: Joi.string().required(),
  CLIENT_SECRET: Joi.string().required()
}).unknown();
