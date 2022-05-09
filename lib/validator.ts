import { Next } from 'koa';
import { Context } from 'koa';
import Joi from 'joi';

export type InputSChema = {
  query: [Object],
  params: [Object],
  body: [Object]
}

function isKeyInContext(key: String): Boolean {
  return key === 'params';
}

function Validator(inputSchema: InputSChema) {
  async function ValidatorMiddleware(ctx: Context, next: Next) {
    const keys = Object.keys(inputSchema) as (keyof typeof inputSchema)[];
    const promises = keys.map((key) => {
      return Joi.object(inputSchema[key]).validateAsync(isKeyInContext(key) ? ctx[key]: ctx.request[key]);
    });
    try {
      await Promise.all(promises);
      return next();
    } catch (error) {
      // @ts-ignore
      ctx.throw(400, error);
    }
  }
  ValidatorMiddleware.$_IS_VALIDATOR_MIDDLEWARE = true;
  ValidatorMiddleware.$_VALIDATOR_SCHEMA = inputSchema;
  return ValidatorMiddleware;
}

export default Validator;