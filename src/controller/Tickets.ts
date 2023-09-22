import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import response from '../helpers/Common'
import { airport, airline } from "../seeder/seeder";
import { v4 as uuidv4 } from 'uuid';
import { checkListFacilities, validateInteger } from "../helpers/Validator";
const prisma = new PrismaClient()

const toHoursAndMinutes = (start: string, finish: string): string => {
    const startDate: any = new Date(start)
    const finishDate: any = new Date(finish)
    const totalMinutes = Math.floor((finishDate - startDate) / 60000)
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours ? `${hours} hours` : ''}${minutes > 0 ? ` ${minutes} minutes` : ''}`;
}

