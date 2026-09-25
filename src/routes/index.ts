import Express from "express";
import assetsRoute from "./assets.js"
import { errorHandler } from "./errorhandler.js";
import { notFoundRequest  } from "./errorhandler.js";

const router = Express.Router()

router.use("/", assetsRoute)
router.use("/", notFoundRequest)
router.use("/", errorHandler)
 
export default router