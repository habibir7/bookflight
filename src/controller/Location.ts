import {Request,Response,NextFunction} from "express"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
import response from '../helpers/Common'
import { validateInteger } from "../helpers/Validator";

export async function getRegency(req: Request, res: Response, next: NextFunction) {
  try {
    const cities = await prisma.city.findMany({});
    response(res, 200, 'get city success',cities)
  } catch (error) {
    return response(res, 404, 'error response')
  }
}

export async function getProvince(req: Request, res: Response, next: NextFunction) {
  try {
    const provinces = await prisma.provinces.findMany({});
    response(res, 200, 'get provinces success',provinces)
  } catch (error) {
    return response(res, 404, 'error response')
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);
  if(!validateInteger(id) || !id){
    return response(res, 404, 'location id invalid')
  }
  try {
    const cities = await prisma.city.findMany({
      where: {
        provinceId: id,
      },
    });
    if (cities.length === 0) {
      const result = await prisma.city.findMany({
        where: {
          id,
        },
      });

      if (result.length === 0) {
        return response(res, 404, 'error response')
      }
      return response(res, 200, 'get city detail success',result[0])
    }
    response(res, 200, 'get city detail success',cities)
  } catch (error) {
    return response(res, 404, 'error response')
  }
}
