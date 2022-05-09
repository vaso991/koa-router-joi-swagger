const Router = require('koa-router');

const router = new Router({
  prefix: '/api',
});

const router2 = new Router({
  prefix: '/users',
});

router.post('/asd', (ctx) => {
  ctx.body = 'test';
});
router.get('/asd', (ctx) => {
  ctx.body = 'test';
});

router.get('/asd/:dsa', (ctx) => {
  ctx.body = 'test';
});

router2.get('/test', (ctx) => {
  ctx.body = 'User Test';
});

router.use(router2.routes());

module.exports = router;
