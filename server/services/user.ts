/**
 * 用户业务操作
 */
import userModel from "../models/user";

const user = {
  /**
   * 登录业务操作
   * @param  {object} formData 登录表单信息
   * @return {object}          登录业务操作结果
   */
  async signIn(formData) {
    const resultData = await userModel.getOneByUserNameAndPassword({
      password: formData.password,
      name: formData.username,
    });
    return resultData;
  },
  /**
   * 查找存在的用户信息
   * @param {object} formData 查找的表单数据
   * @return {object | null} 查找结果
   */
  async getExistOne(formData) {
    const resultData = await userModel.getExistOne({
      email: formData.email || null,
      name: formData.username || null,
    });
    return resultData;
  },
};


export default user;
