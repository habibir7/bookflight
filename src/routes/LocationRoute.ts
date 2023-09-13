import express from "express"
import {getProvince,getRegency,getById} from "../controller/Location"

const router = express.Router()

router.get('/provincy',getProvince)
router.get('/regency',getRegency)
router.get('/:id',getById)


export default router