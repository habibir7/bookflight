import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import response from '../helpers/Common'
import { statusFlight } from "../seeder/seeder";
import { v4 as uuidv4 } from 'uuid';
import { checkListFacilities, validateInteger } from "../helpers/Validator";
import { CustomRequest } from "../helpers/Token";
const prisma = new PrismaClient()

const toHoursAndMinutes = (start: string, finish: string): string => {
    const startDate: any = new Date(start)
    const finishDate: any = new Date(finish)
    const totalMinutes = Math.floor((finishDate - startDate) / 60000)
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours ? `${hours} hours` : ''}${minutes > 0 ? ` ${minutes} minutes` : ''}`;
}

export async function postStatusSeeder(req: Request, res: Response, next: NextFunction) {
    try {
        let data = JSON.parse(JSON.stringify(statusFlight))
        const result = await prisma.ticketFlightStatus.createMany({ data })
        return response(res, 200, 'post status success', result)
    } catch (error) {
        console.error('Error:', error);
        return response(res, 500, 'Failed to create status');
    }
}

export async function getStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await prisma.ticketFlightStatus.findMany({})
        return response(res, 200, 'post status success', result)
    } catch (error) {
        console.error('Error:', error);
        return response(res, 500, 'Failed to create status');
    }
}


export async function postTickets(req: CustomRequest, res: Response, next: NextFunction) {
    try {
        // let data = JSON.parse(JSON.stringify(statusFlight))
        const email = req.payload.email
        const searchUser = await prisma.user.findMany({
            where: { email },
        });

        const { title, fullname, nationality } = req.body
        console.log(title, fullname, nationality)

        const { id } = searchUser[0]

        let ListPassengerDetail: any = []
        for (const key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                const index = key.match(/\d+/);
                if (index) {
                    const numericPart: any = index[0];
                    if (!ListPassengerDetail[numericPart - 1]) {
                        ListPassengerDetail[numericPart - 1] = {};
                    }
                    ListPassengerDetail[numericPart - 1][key.replace(/\d+/g, '')] = req.body[key];
                }
            }
        }
        console.log(ListPassengerDetail)

        let data = {
            passengerId: id,
            isRefundable: true,
            iscanReschedule: true,
            isWithInsurance: true,
            totalPayment: 200,
            statusId: 1,
            code: uuidv4(),
            PassengerDetail: {
                create: ListPassengerDetail
            },

        }
        console.log(searchUser)
        const result = await prisma.ticketFlight.create({ data })
        return response(res, 200, 'post tickets success', result)
    } catch (error) {
        console.error('Error:', error);
        return response(res, 500, 'Failed to create tickets');
    }
}

export async function getTicketUser(req: CustomRequest, res: Response, next: NextFunction) {
    try {
        const email = req.payload.email
        const searchUser = await prisma.user.findMany({
            where: { email },
        });

        const { name, phone, fullname, isActive, uniqId } = searchUser[0];
        const resultLogin = {
            uniqId,
            email,
            name: name || undefined,
            phone: phone || undefined,
            fullname: fullname || undefined,
            isActive,
        };

        const result = await prisma.ticketFlight.findMany({ include: { PassengerDetail: true, status: true, passenger: true } })

        const new_result = { user: resultLogin, result }

        return response(res, 200, 'get tickets success', new_result)
    } catch (error) {
        console.error('Error:', error);
        return response(res, 500, 'Failed to get tickets');
    }
}
export async function getTicketById(req: CustomRequest, res: Response, next: NextFunction) {
    try {
        const email = req.payload.email
        const searchUser = await prisma.user.findMany({
            where: { email },
        });
        const { code } = req.params

        const { name, phone, fullname, isActive, uniqId } = searchUser[0];
        const resultLogin = {
            uniqId,
            email,
            name: name || undefined,
            phone: phone || undefined,
            fullname: fullname || undefined,
            isActive,
        };

        const result = await prisma.ticketFlight.findMany({ include: { PassengerDetail: true, status: true, passenger: true }, where: { code } })

        const new_result = { user: resultLogin, result: result[0] }

        return response(res, 200, 'get tickets success', new_result)
    } catch (error) {
        console.error('Error:', error);
        return response(res, 500, 'Failed to get tickets');
    }
}


export async function updateTicketsStatus(req: Request, res: Response, next: NextFunction) {
    try {
        let { statusId } = req.body
        let { code } = req.params
        statusId = parseInt(statusId)
        console.log(statusId, code)
        if (!validateInteger(statusId) || !code) {
            return response(res, 400, 'invalid input');
        }

        const ticket_result = await prisma.ticketFlight.findMany({ include: { PassengerDetail: true, status: true, passenger: true }, where: { code } })

        const id = ticket_result[0].id

        const result = await prisma.ticketFlight.update({ where:{id} , data: { statusId } ,include: { PassengerDetail: true, status: true, passenger: true }})
        return response(res, 200, 'update tickets success', result)
    } catch (error) {
        console.error('Error:', error);
        return response(res, 500, 'Failed to update tickets');
    }
}