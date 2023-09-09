
import createHttpError from "http-errors";
import express from "express"
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2"
const prisma = new PrismaClient()

const LocationController = {
  getRegency: async (req: any, res: any, next: any) => {
    const city = await prisma.city.findMany({})
    res.json(city)
  },
  getProvince: async (req: any, res: any, next: any) => {
    const province = await prisma.provinces.findMany({})
    res.json(province)
  },
  getById: async (req: any, res: any, next: any) => {
    console.log(req.params.id)
    const city = await prisma.city.findMany({where:{
        provinceId: parseInt(req.params.id)
    }})
    if(!city.length) {
        const result = await prisma.city.findMany({where:{
            id: parseInt(req.params.id)
        }})
        if(!result.length) return res.json({status:404})
        return res.status(200).json({status:200,data:result[0]})
    }
    res.status(200).json(city)
  },


}

export default LocationController