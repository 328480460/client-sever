import userCode from "./../codes/user";
import userInfoService from "./../services/user";

/**
 * 登录操作
 * @param  {obejct} ctx 上下文对象
 */
const login = async (ctx) => {
  let formData = ctx.request.body;
  let result = {
    success: false,
    message: "",
    data: null,
    code: "",
  };
  try {
    // TODO:
    const userResult = (await userInfoService.signIn(formData)) as any;

    if (userResult) {
      result.success = true;
      ctx.session.isLogin = true;
      ctx.session.userName = userResult.name;
      ctx.session.userId = userResult.id;
    } else {
      const _userResult = await userInfoService.getExistOne(formData);
      if (_userResult) {
        result.message = userCode.FAIL_USER_NAME_OR_PASSWORD_ERROR;
        result.code = "FAIL_USER_NAME_OR_PASSWORD_ERROR";
      } else {
        result.code = "FAIL_USER_NO_EXIST";
        result.message = userCode.FAIL_USER_NO_EXIST;
      }
    }

    ctx.body = result;
  } catch (error) {
    ctx.body = error;
  }
};

export default login;
