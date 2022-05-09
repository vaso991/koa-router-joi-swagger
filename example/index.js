const Koa = require('koa');
const KoaJsonError = require('koa-json-error');
const { Router, Validator, Joi, Swagger } = require('../dist');
const routes = require('./routes');

const app = new Koa();

app.use(KoaJsonError());

const router = new Router();

router.get(
  '/test/:param1',
  Validator({
    query: {
      queryParam: Joi.string().required(),
    },
    body: {
      bodyParam: Joi.number().optional(),
    },
    params: {
      param1: Joi.string().required(),
    },
  }),
  (ctx) => {
    ctx.body = {
      query: ctx.request.query,
      params: ctx.params,
      body: ctx.request.body
    }
  }
);

router.use(routes.routes());

router.get(
  '/docs',
  Swagger({
    router,
    uiConfig: {
      routePrefix: false,
      swaggerOptions: {
        spec: {
          info: {
            title: 'Test Api',
            version: '1.0.0',
            description: 'This is test api specs',
          },
        },
      },
    },
  })
);

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server started in port 3000');
});
