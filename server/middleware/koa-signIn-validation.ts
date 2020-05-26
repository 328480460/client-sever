// 登陆状态校验
const koaSignInValidation = (options) => async (ctx, next) => {
  const { allowPage } = options;
  const { session } = ctx;
  console.log("ctx.url:", ctx.url);
  if (!session.userName && !allowPage.includes(ctx.url)) {
    console.log("not login");
    ctx.status = 302;
    ctx.body = {
      success: false,
      message: "not login",
      data: null,
      code: "302",
    };
  } else {
    await next();
  }
};

export default koaSignInValidation;
