import express from "express"
import UserRouter from "./UserRoute"
import LocationRoute from "./LocationRoute"
import AuthRoute from "./AuthRoute"
const router = express.Router()

router.use('/users',UserRouter)
router.use('/location',LocationRoute)
router.use('/auth',AuthRoute)

export default router