const router = require("koa-router")();
import stdObjController from "../controllers/standardObject";

const routers = router
  .post("/", stdObjController.edit)
  .get("/", stdObjController.query)
  .put("/", stdObjController.create)
  .delete("/", stdObjController.delete);

export default routers;
