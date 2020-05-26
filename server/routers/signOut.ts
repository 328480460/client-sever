const router = require("koa-router")();
import signOurController from "../controllers/signOut";

const routers = router.post("/", signOurController);

export default routers;
