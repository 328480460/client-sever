import path from "path";
import Koa from "koa";
import session from "koa-session";
import bodyParser from "koa-bodyparser";
import koaLogger from "koa-logger";
import cors from "@koa/cors";
import serve from "koa-static";
import routers from "./routers";
import config from "./config";
import historyFallback from "./middleware/koa-histroy-fallback";
import signInValidation from "./middleware/koa-signIn-validation";

const app = new Koa();

// 使用cors
app.use(cors({ credentials: true }));

// 针对前端history路由做的处理
const staticPath = path.join(__dirname, "../client/build");
app.use(historyFallback({ path: "/", staticPath }));

// 使用静态资源
app.use(serve(staticPath));

// 登陆状态校验
const allowPage = ["/login", "/api/login"];
app.use(signInValidation({ allowPage }));

// 使用session
app.keys = ["koa"];
app.use(
  session(
    {
      key: "koa.sess" /** (string) cookie key (default is koa.sess) */,
      maxAge: 86400000,
      overwrite: true /** (boolean) can overwrite or not (default true) */,
      httpOnly: true /** (boolean) httpOnly or not (default true) */,
      signed: true /** (boolean) signed or not (default true) */,
      rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
      renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
      secure: false /** (boolean) secure cookie*/,
    },
    app
  )
);

// 配置控制台日志中间件
app.use(koaLogger());

// 配置ctx.body解析中间件
app.use(bodyParser());

// 初始化路由中间件
app.use(routers.routes());
app.use(routers.allowedMethods());

// 监听启动端口
app.listen(config.port);
console.log(`the server is start at port ${config.port}`);
