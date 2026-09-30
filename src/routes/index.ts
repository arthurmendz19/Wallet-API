import Express from "express";
import assetsRoute from "./assets.js"
import { errorHandler } from "./errorhandler.js";
import { notFoundRequest  } from "./errorhandler.js";
import operationRoute from "./operations.js"

const router = Express.Router()

router.use("/", assetsRoute)
router.use("/", operationRoute)
router.use("/", notFoundRequest)
router.use("/", errorHandler)
 
export default router