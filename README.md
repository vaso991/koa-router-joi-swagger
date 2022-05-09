# koa-router-joi-swagger

> Validate router input and generate swagger ui based on router and validation

## Installation

```sh
$ npm install koa-router-joi-swagger
```
> Uses [`Joi`](https://github.com/sideway/joi), [`@koa/router`](https://github.com/koajs/router) And [`koa2-swagger-ui`](https://github.com/scttcper/koa2-swagger-ui)

## Usage

### Import Packages

```js
const Koa = require('koa');
const { Router, Validator, Joi, Swagger } = require('koa-router-joi-swagger');
const app = new Koa();
const router = new Router();
```
### Validate Input ([See Joi Documentation](https://joi.dev/api/))
```js
router.post(
  '/api/:param1',
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
  })
);
```

### Serve Swagger Docs (pass [koa2-swagger-ui](https://github.com/scttcper/koa2-swagger-ui#config) config as `uiConfig`)

```js
router.get(
  '/docs',
  Swagger({
    // Pass router as parameter
    router,
    uiConfig: {
      routePrefix: false,
      swaggerOptions: {
        spec: {
          info: {
            title: 'Test Api',
            version: '1.0.0',
            description: 'This is test api specs',
            ...: ...
          },
        },
      },
    },
  })
);
```