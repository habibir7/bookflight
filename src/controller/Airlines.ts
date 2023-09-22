import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import response from '../helpers/Common'
import { CustomRequest } from '../helpers/Token'
import { airport, airline } from "../seeder/seeder";
import { v4 as uuidv4 } from 'uuid';
import { checkListFacilities, validateInteger } from "../helpers/Validator";
import { type } from "os";
const prisma = new PrismaClient()

const toHoursAndMinutes = (start: string, finish: string): string => {
  const startDate: any = new Date(start)
  const finishDate: any = new Date(finish)
  const totalMinutes = Math.floor((finishDate - startDate) / 60000)
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours ? `${hours} hours` : ''}${minutes > 0 ? ` ${minutes} minutes` : ''}`;
}

const flight_result = (item: any) => {
  let result = item.map((item: any) => {
    if (item.FlightFacilities) {
      item.facilities = item.FlightFacilities.map((item: any) => {
        return item.listSchedule.name
      })
    }
    let { code, takeoff, landing, transit, airline: { name, photo }, from, to, price } = item
    let new_item = {
      code,
      price,
      interval_time: toHoursAndMinutes(takeoff, landing),
      takeoff,
      landing,
      name,
      photo,
      transit,
      from,
      to,
      facilities: item.facilities
    }
    return new_item
  })
  return result
}

export async function getFacilities(req: Request, res: Response, next: NextFunction) {
  const result = await prisma.facilities.findMany({})
  return response(res, 200, 'get facilities success', result)
}


export async function postFacilities(req: Request, res: Response, next: NextFunction) {
  const { name } = req.body
  let data = { name }
  const result = await prisma.facilities.create({ data })
  return response(res, 200, 'post facilities success', result)
}

export async function getAirports(req: Request, res: Response, next: NextFunction) {
  const result = await prisma.airport.findMany({})
  return response(res, 200, 'get airport success', result)
}

export async function postAirports(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, code, location, terminal, country, latitude, longitude } = req.body
    let data = {
      name, code, location, terminal, country, latitude: parseFloat(latitude), longitude: parseFloat(longitude)
    }
    const result = await prisma.airport.create({ data })
    return response(res, 200, 'post airport success', result)
  } catch (error) {
    console.error('Error:', error);
    return response(res, 500, 'Failed to create airport');
  }
}
export async function postAirportsSeeder(req: Request, res: Response, next: NextFunction) {
  try {
    let data = JSON.parse(airport)
    const result = await prisma.airport.createMany({ data })
    return response(res, 200, 'post airport success', result)
  } catch (error) {
    console.error('Error:', error);
    return response(res, 500, 'Failed to create airport');
  }
}


export async function getAirline(req: Request, res: Response, next: NextFunction) {
  const result = await prisma.airline.findMany({})
  return response(res, 200, 'get airline success', result)
}

export async function postAirline(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, photo } = req.body
    let data = {
      name, photo
    }
    const result = await prisma.airline.create({ data })
    return response(res, 200, 'post airline success', result)
  } catch (error) {
    console.error('Error:', error);
    return response(res, 500, 'Failed to create airline');
  }
}
export async function postAirlineSeeder(req: Request, res: Response, next: NextFunction) {
  try {
    let data = JSON.parse(airline)
    const result = await prisma.airline.createMany({ data })
    return response(res, 200, 'post airline success', result)
  } catch (error) {
    console.error('Error:', error);
    return response(res, 500, 'Failed to create airline');
  }
}


export async function getFlight(req: Request, res: Response, next: NextFunction) {
  try{

    const {
    facilities,
    airlineId,
    minPrice,
    maxPrice,
  } = req.query;

  
  let listFacilities: number[] = [];
  if (facilities) {
    listFacilities = (facilities as string).split(',').map((item: string) => parseInt(item));
  } else{
    listFacilities = [1]
  }
  
  console.log('airline id',Number(airlineId))
  console.log('listFacilities',listFacilities)

  const result = await prisma.flightSchedule.findMany({
    include: {
      FlightFacilities: { include: { listSchedule: true } }, airline: true, from: true, to: true,
    }, where: {
      price: {
        gte: parseInt(minPrice as string | undefined ?? '0') || 0,
        lte: parseInt(maxPrice as string | undefined ?? '1000000')|| 1000000,
      },
      airlineId : Number(airlineId) || undefined,
      FlightFacilities:{some:{listScheduleId:{in:listFacilities}}}
    },
  })

  // FlightFacilities filter result
  let filtered_result =  result.filter((schedule) =>
  listFacilities.every((id) =>
    schedule.FlightFacilities.some((facility) => facility.listScheduleId === id)
  ))
  
  let new_result = flight_result(filtered_result)
  console.log(new_result.length)
  return response(res, 200, 'get flightSchedule success', new_result)
} catch(error){
    return response(res, 400, 'get flightSchedule failed')
  }
}
export async function getFlightAll(req: Request, res: Response, next: NextFunction) {
  const result = await prisma.flightSchedule.findMany({ include: { FlightFacilities: { include: { listSchedule: true } }, airline: true, from: true, to: true, _count: true } })
  let new_result = flight_result(result)
  const airlines = await prisma.airline.findMany({})
  const facilities = await prisma.facilities.findMany({})

  let data = { airlines, facilities, tickets: new_result }

  // get info

  console.log(new_result.length)
  let pagination = { count: new_result.length || 0 };
  return response(res, 200, 'get flightSchedule success', data, pagination)
}
export async function getFlightDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const { code } = req.params
    if (!code) return response(res, 400, 'invalide code flight')
    const result = await prisma.flightSchedule.findMany({ include: { FlightFacilities: { include: { listSchedule: true } }, airline: true, from: true, to: true, _count: true }, where: { code } })
    if (result.length === 0) return response(res, 400, 'get flightSchedule not found')
    let new_result = flight_result(result)
    return response(res, 200, 'get flightSchedule success', await new_result[0])
  } catch (err) {
    return response(res, 400, 'get flightSchedule failed', err)
  }
}

export async function postFlight(req: Request, res: Response, next: NextFunction) {
  try {
    let { facilities, airlineId, airportIdfrom, airportIdto,price } = req.body

    let listFacilities = facilities.split(',')
    listFacilities = await listFacilities.map((item: string) => parseInt(item))
    if (!checkListFacilities(listFacilities)) {
      return response(res, 400, 'invalid list facilities');
    }

    airlineId = parseInt(airlineId)
    airportIdfrom = parseInt(airportIdfrom)
    airportIdto = parseInt(airportIdto)
    price = parseInt(price)

    if (!validateInteger(airlineId) || !validateInteger(airportIdfrom) || !validateInteger(airportIdto) || !validateInteger(price)) {
      return response(res, 400, 'invalid input');
    }

    let listFacilitiesId: any = []
    listFacilities.map((item: string) => {
      listFacilitiesId = [...listFacilitiesId, { listScheduleId: item }]
    })

    let code = uuidv4()
    let data = {
      code,
      takeoff: "2023-09-25T12:00:00Z",
      landing: "2023-09-25T15:00:00Z",
      airportIdfrom,
      airportIdto,
      airlineId,
      FlightFacilities: {
        create: await listFacilitiesId
      },
      price
    }
    const result = await prisma.flightSchedule.create({ data, include: { FlightFacilities: { include: { listSchedule: true } }, airline: true, from: true, to: true } })
    return response(res, 200, 'post airline success', await flight_result([result])[0])
  } catch (error) {
    console.error('Error:', error);
    return response(res, 500, 'Failed to create airline');
  }
}
export async function postFlightSeeder(req: Request, res: Response, next: NextFunction) {
  try {
    // let data = JSON.parse(airline)
    let code = uuidv4()
    let data = {
      code,
      takeoff: "2023-09-25T12:00:00Z",
      landing: "2023-09-25T15:00:00Z",
      airportIdfrom: 1,
      airportIdto: 2,
      airlineId: 2,
      FlightFacilities: {
        create:
          [
            { listScheduleId: 1 },
            { listScheduleId: 2 },
            { listScheduleId: 3 },
          ]
      },
      price: 200
    }
    const result = await prisma.flightSchedule.create({ data })
    // const result = await prisma.airline.createMany({ data })
    return response(res, 200, 'post airline success', result)
  } catch (error) {
    console.error('Error:', error);
    return response(res, 500, 'Failed to create airline');
  }
}

