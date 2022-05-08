const Joi = require('joi');

function Validator({
  query,
  params,
  body
} = {}) {
  const ValidatorMiddleware = async (ctx, next) => {
    try {
      if (query) {
        await Joi.object(query).validateAsync(ctx.request.query);
      }
      if (params) {
        await Joi.object(params).validateAsync(ctx.params);
      }
      if (body) {
        await Joi.object(body).validateAsync(ctx.request.body);
      }
      return next();
    } catch (error) {
      ctx.throw(400, error);
    }
  }
  ValidatorMiddleware.IsValidatorMiddleware = true;
  ValidatorMiddleware.ObjectSchema = {
    query,
    params,
    body
  };
  return ValidatorMiddleware;
}

module.exports = Validator;