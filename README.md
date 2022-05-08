# EXAMPLE

```js
const Koa = require('koa');
const { Router, Validator, Joi, Swagger } = require('../lib');
const routes = require('./routes');

const app = new Koa();

const router = new Router();

router.get('/test', Validator({
  query: {
    test: Joi.string().required()
  },
  body: {
    bodyParam: Joi.string().required()
  },
  params: {
    param1: Joi.string().required()
  }
}))

router.use(routes.middleware());

router.get('/docs', Swagger({ router, routePrefix: false }));

app.use(router.allowedMethods()).use(router.middleware());

app.listen(3000);

```