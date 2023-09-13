import express,{ Request, Response, NextFunction } from "express";
import {activateAccount,register,login} from "../controller/Auth"
import SendEmail from "../middleware/Email"

const router = express.Router()


const EmailProvider = async (req: Request, res: Response, next: NextFunction) => {
    let sendEmail = await SendEmail(req.params.id+'@gmail.com', "http://localhost:3000/location/11", "test sandbox");
    console.log('send email success +> ', sendEmail)
    return res.json({status:200,sendEmail})
}

router.post('/register',register)
router.post('/login',login)
router.post('/activated',activateAccount)
router.get('/email/:id',EmailProvider)


export default router