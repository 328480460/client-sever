import stdObjtModal from "../models/standardObject";

const standardObject = {
  /**
   * 查询标准对象数据
   *
   * @param {string} objName 标准对象名
   * @param {object} query 参数
   * @memberof StandardObject
   */
  async query(objName, query) {
    const { limit, offset } = query;
    const resultData = await stdObjtModal.query(objName, offset, limit);
    return resultData;
  },
};

export default standardObject;
