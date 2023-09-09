import express from "express"
import UserRouter from "./UserRoute"
import LocationRoute from "./LocationRoute"
const router = express.Router()

router.use('/users',UserRouter)
router.use('/location',LocationRoute)

export default router