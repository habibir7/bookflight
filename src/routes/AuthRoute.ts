import express,{ Request, Response, NextFunction } from "express";
import {activateAccount,register,login,newToken,forgotPassword,changePassword} from "../controller/Auth"
import {sendEmailActivated} from "../middleware/Email"

const router = express.Router()


const EmailProvider = async (req: Request, res: Response, next: NextFunction) => {
    let sendEmail = await sendEmailActivated(req.body.email, "http://localhost:3000/location/11", "test sandbox");
    console.log('send email success +> ', sendEmail)
    return res.json({status:200,sendEmail})
}

router.post('/register',register)
router.post('/login',login)
router.post('/newtoken',newToken)
router.post('/activated',activateAccount)
router.post('/email_checker',EmailProvider)
router.post('/forgot_password',forgotPassword)
router.post('/new_password', changePassword)


export default router