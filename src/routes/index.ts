import express from "express"
import UserRouter from "./UserRoute"
import LocationRoute from "./LocationRoute"
import AuthRoute from "./AuthRoute"
import Airlines from "./Airlines"
const router = express.Router()

router.use('/users',UserRouter)
router.use('/location',LocationRoute)
router.use('/auth',AuthRoute)
router.use('/airlines',Airlines)

export default router