import dbUtils from "../utils/db-util";

class User {
  /**
   * 根据用户名密码查找用户
   * @param {object} options 用户名密码对象
   * @return {object | null} 查找结果
   */
  async getOneByUserNameAndPassword(options) {
    const _sql = `
        SELECT * from user_info
          where password="${options.password}" and name="${options.name}"
          limit 1`;
    let result = await dbUtils.query(_sql);
    if (Array.isArray(result) && result.length > 0) {
      result = result[0];
    } else {
      result = null;
    }
    return result;
  }

  /**
   * 查找一个存在用户的数据
   * @param  {obejct} options 查找条件参数
   * @return {object|null}        查找结果
   */
  async getExistOne(options) {
    const _sql = `SELECT * from user_info 
                    where name="${options.name}" or email="${options.email}"
                    limit 1`;
    let result = await dbUtils.query(_sql);
    if (Array.isArray(result) && result.length > 0) {
      result = result[0];
    } else {
      result = null;
    }
    return result;
  }
}

export default new User();
