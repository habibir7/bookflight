import express,{ Request, Response, NextFunction } from "express";
import {postStatusSeeder,getStatus, postTickets, getTicketUser, getTicketById, updateTicketsStatus} from "../controller/Tickets"
import {Token} from "../helpers/Token"

const router = express.Router()



router.post('/status',postStatusSeeder)
router.post('/tickets/:code',Token.checkToken as any,postTickets as any)
router.get('/tickets',Token.checkToken as any,getTicketUser as any)
router.get('/tickets/:code',Token.checkToken as any,getTicketById as any)
router.get('/status',getStatus)
router.put('/status/:code',updateTicketsStatus)


export default router