const Router = require('koa-router');

const router = new Router({
  prefix: '/api'
});

router.post('/asd', (ctx) => {
  ctx.body = 'test';
})
router.get('/asd', (ctx) => {
  ctx.body = 'test';
})

router.get('/asd/:dsa', (ctx) => {
  ctx.body = 'test';
})

module.exports = router;