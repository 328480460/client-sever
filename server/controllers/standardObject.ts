import stdObjService from "./../services/standardObject";

export default {
  async create() {},

  async query(ctx) {
    const { query, params, session } = ctx;
    console.log("session", session.userName);
    let result = {
      success: false,
      message: "",
      data: null,
      code: "",
    };

    try {
      // TODO:
      const stdObjResult = (await stdObjService.query(
        params.objName,
        query
      )) as any;
      result.success = true;
      result.data = stdObjResult ? stdObjResult : [];
      console.log("result:", result);
      ctx.body = result;
    } catch (error) {
      ctx.body = error;
    }
  },

  async edit() {},

  async delete() {},
};
