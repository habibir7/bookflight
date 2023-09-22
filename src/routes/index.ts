import express from "express"
import UserRouter from "./UserRoute"
import LocationRoute from "./LocationRoute"
import AuthRoute from "./AuthRoute"
import Airlines from "./Airlines"
import Booking from "./Booking"
const router = express.Router()

router.use('/users',UserRouter)
router.use('/location',LocationRoute)
router.use('/auth',AuthRoute)
router.use('/airlines',Airlines)
router.use('/booking',Booking)

export default router