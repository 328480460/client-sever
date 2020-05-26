const router = require("koa-router")();
import login from "./login";
import signOut from "./signOut";
import standardObject from "./standardObject";

router.use("/api/login", login.routes(), login.allowedMethods());
router.use("/api/signOut", signOut.routes(), login.allowedMethods());
router.use("/api/:objName", standardObject.routes(), login.allowedMethods());

export default router;
