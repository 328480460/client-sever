const router = require("koa-router")();
import login from "../controllers/login";

const routers = router.post("/", login);

export default routers;
