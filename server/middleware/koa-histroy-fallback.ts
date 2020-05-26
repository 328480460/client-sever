const fs = require("fs");

const koaHistoryFallback = (options) => async (ctx, next) => {
  const { path, staticPath } = options;
  await next(); // 等待请求执行完毕
  if (ctx.response.status === 404 && ctx.request.url.includes(path)) {
    ctx.type = "text/html; charset=utf-8"; // 修改响应类型
    ctx.body = fs.readFileSync(staticPath + path + "index.html"); // 修改响应体
  }
};

export default koaHistoryFallback;
