# IN DEVELOPMENT. DO NOT USE FOR PRODUCTIOn.

## EXAMPLE
```js
const Koa = require('koa');
const { Router, Validator, Joi, Swagger } = require('../lib');
const routes = require('./routes');

const app = new Koa();

const router = new Router();

router.get('/test/:param1', Validator({
  query: {
    test: Joi.string().required()
  },
  body: {
    bodyParam: Joi.number().optional()
  },
  params: {
    param1: Joi.string().required()
  }
}))

router.use(routes.routes());

router.get('/docs', Swagger({
  router,
  uiConfig: {
    routePrefix: false,
    swaggerOptions: {
      spec: {
        info: {
          title: 'Test Api',
          version: '1.0.0',
          description: 'This is test api specs'
        }
      }
    }
  }
}));


app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);

```