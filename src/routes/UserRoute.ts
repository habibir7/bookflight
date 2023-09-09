import express from "express"
import UserController from "../controller/User"
import SendEmail from "./../middleware/Email"

const router = express.Router()


const EmailProvider = async (req: any, res: any, next: any) => {
    let sendEmail = await SendEmail(req.params.id+'@gmail.com', "http://localhost:3000/location/11", "test sandbox");
    console.log('send email success +> ', sendEmail)
    return res.json({status:200,sendEmail})
}

router.get('/',UserController.posts)
router.get('/email/:id',EmailProvider)


export default router