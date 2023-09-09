import express from "express"
import LocationController from "../controller/Location"

const router = express.Router()

router.get('/provincy',LocationController.getProvince)
router.get('/regency',LocationController.getRegency)
router.get('/:id',LocationController.getById)


export default router