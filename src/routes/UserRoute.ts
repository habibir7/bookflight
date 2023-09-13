import express from "express"
import {detail,checkToken,get,update,getByUserId} from "../controller/User"
import Token from "../helpers/Token"

const router = express.Router()


router.get('/',get)
router.get('/detail',Token.checkToken as any,detail as any)
router.get('/token',Token.checkToken as any,checkToken as any)
router.get('/:id',getByUserId)


export default router