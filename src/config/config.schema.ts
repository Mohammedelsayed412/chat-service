import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  ENV: Joi.string().required(),
  PORT: Joi.number().required(),
  PAGE_ACCESS_TOKEN: Joi.string().required(),
  VERIFY_TOKEN: Joi.string().required(),
});
