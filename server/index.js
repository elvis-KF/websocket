// 导入
const Koa = require('koa')
const ws = require('ws')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const router = require('./router/router')
console.log(router)
app.use(bodyParser())

app.use(async (ctx, next) => {
  //设置跨域访问
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (ctx.request.method == 'OPTIONS') {
      ctx.response.status = 200 /*让options请求快速返回*/
  }else {
    await next();
  }
})

app.use(router.router.routes())
const server = app.listen(2333)


// 引用
const WsServer = ws.Server

// 实例化
// 创建wbecocketServer
const wss = new WsServer({
  server
})

// 有websocket请求接入，wss响应connection处理
wss.on('connection', function (ws) {
  console.log(`[SERVER] connection()`);
  // 识别成功，把user绑定到websocket对象
  // ws.user = user
  // 绑定webscoketServer对象
  ws.wss = wss
  ws.on('message', function (message) {
      console.log(ws)
      console.log(`[SERVER] Received: ${message}`)
      wss.boradcast(message)
  })
});

wss.boradcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data)
  })
}
