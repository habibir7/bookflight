import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import response from '../helpers/Common'
import {CustomRequest} from '../helpers/Token'
const prisma = new PrismaClient()

interface LoginResult {
  uniqId: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  fullname?: string | null;
  isActive: boolean;
}

export async function get(req: Request, res: Response, next: NextFunction) {
  const result = await prisma.user.findMany({
    include: { Address: true, TicketFlight: true, posts: true }
  })
  res.json(result)
}

// private controller
export async function checkToken(req: CustomRequest, res: Response, next: NextFunction) {
  req.payload.iat = new Date(req.payload.iat * 1000)
  req.payload.exp = new Date(req.payload.exp * 1000)
  return response(res, 200, 'token is active', req.payload)
}

export async function detail(req: CustomRequest, res: Response, next: NextFunction) {
  let { email } = req.payload
  const detailUser = await prisma.user.findMany({
    where: { email },
    include: { Address: true, TicketFlight: true, posts: true }
  })
  // postpone
  const user = detailUser[0];
  const { name, phone, fullname, isActive } = user;
  const result: LoginResult = {
    uniqId: user.uniqId,
    email: user.email,
    name: name || undefined,
    phone: phone || undefined,
    fullname: fullname || undefined,
    isActive,
  };
  return response(res, 200, 'detail user success', result)
}

export async function getByUserId(req: Request, res: Response, next: NextFunction) {
  let { id } = req.params
  const detailUser = await prisma.user.findMany({
    where: { uniqId:id },
    include: { Address: true, TicketFlight: true, posts: true }
  })
  const user = detailUser[0];
  const { name, fullname, isActive } = user;
  const result: LoginResult = {
    uniqId: user.uniqId,
    email: user.email,
    name: name || undefined,
    fullname: fullname || undefined,
    isActive,
  };
  return response(res, 200, 'detail user success', result)
}

export async function update(req: CustomRequest, res: Response, next: NextFunction) {
  let { email } = req.payload
  const detailUser = await prisma.user.findMany({
    where: { email },
    include: { Address: true, TicketFlight: true, posts: true }
  })
  // postpone
  const result = {
    name: detailUser[0].name !== null ? detailUser[0].name : undefined,
    uniqId: detailUser[0].uniqId,
    email: detailUser[0].email,
    phone: detailUser[0].phone !== null ? detailUser[0].phone : undefined,
    fullname: detailUser[0].fullname !== null ? detailUser[0].fullname : undefined,
    isActive: detailUser[0].isActive,
  }
  return response(res, 200, 'detail user success', result)
}