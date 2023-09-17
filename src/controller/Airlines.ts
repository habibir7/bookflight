import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import response from '../helpers/Common'
import { CustomRequest } from '../helpers/Token'
import { airport,airline } from "../../lib/seeder";
import { v4 as uuidv4 } from 'uuid';
const prisma = new PrismaClient()

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
    const { name, photo} = req.body
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
  const result = await prisma.flightSchedule.findMany({include:{FlightFacilities:{include:{listSchedule:true}},airline:true,from:true,to:true,_count:true}})
  let new_result = result.map((item:any,index)=> {
    if(item.FlightFacilities){
      item.facilities = item.FlightFacilities.map((item:any)=>{
        return item.listSchedule.name
      })
    }
    let { code,takeoff,landing,transit,airline:{name,photo},from,to} = item
    let new_item = {
      code,
      takeoff,
      landing,
      name,
      photo,
      transit,
      from,
      to,
      facilities : item.facilities
    }
    return new_item
  })
  return response(res, 200, 'get flightSchedule success', new_result)
}

export async function postFlight(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, photo} = req.body
    // let data = {
    //   name, photo
    // }
    let code = uuidv4()
    let data = {
      code,
      takeoff: "2023-09-25T12:00:00Z",
      landing: "2023-09-25T15:00:00Z",
      airportIdfrom: 1,
      airportIdto: 2,
      airlineId:2,
      FlightFacilities : {
        create: 
        [
          {listScheduleId:1},
          {listScheduleId:2},
          {listScheduleId:3},
        ]
      }
    }
    const result = await prisma.flightSchedule.create({ data })
    return response(res, 200, 'post airline success', result)
  } catch (error) {
    console.error('Error:', error);
    return response(res, 500, 'Failed to create airline');
  }
}
export async function postFlightSeeder(req: Request, res: Response, next: NextFunction) {
  try {
    let data = JSON.parse(airline)
    const result = await prisma.airline.createMany({ data })
    return response(res, 200, 'post airline success', result)
  } catch (error) {
    console.error('Error:', error);
    return response(res, 500, 'Failed to create airline');
  }
}

