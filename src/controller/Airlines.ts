import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import response from '../helpers/Common'
import { CustomRequest } from '../helpers/Token'
import { airport,airline } from "../../lib/seeder";
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

