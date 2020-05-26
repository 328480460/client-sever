import dbUtils from "../utils/db-util";

class StandardObject {
  /**
   *创建标准对象
   *
   * @memberof StandardObject
   */
  async createStandardObj() {}

  /**
   * 查询标准对象数据
   *
   * @param {string} objName 标准对象名
   * @param {offset} number 开始位置
   * @param {limit} number 数据长度
   * @memberof StandardObject
   */
  async query(objName, offset, limit) {
    const _sql = `
        SELECT * from ${objName} limit ${offset},${limit}
      `;
    let result = await dbUtils.query(_sql);

    return result ? result : null;
  }

  /**
   * 新增一条标准对象数据
   *
   * @param {string} objName 标准对象名
   * @param {object} value 新增的数据
   * @memberof StandardObject
   */
  async add(objName, value) {}

  /**
   * 编辑一条标准对象数据
   *
   * @param {string} objName 标准对象名
   * @param {object} value 要编辑的数据
   * @memberof StandardObject
   */
  async edit(objName, value) {}

  /**
   * 删除一条标准对象数据
   *
   * @param {string} objName 标准对象名
   * @param {string} id id
   * @memberof StandardObject
   */
  async delete(objName, id) {}
}

export default new StandardObject();
