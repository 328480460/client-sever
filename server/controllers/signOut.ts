// 登出操作
const signOut = async (ctx) => {
  if (ctx.session) {
    ctx.session = null;
    ctx.status = 302;
    ctx.body = {
      success: true,
      message: "",
      code: "302",
      data: null,
    };
    console.log("登出成功");
  } else {
    ctx.body = {
      success: false,
      message: "no login",
      code: "302",
      data: null,
    };
  }
};

export default signOut;
