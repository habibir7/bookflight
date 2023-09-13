
import createHttpError from "http-errors";
import express from "express"
import { PrismaClient, Prisma } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import response from '../helpers/Common'
import { z } from 'zod';


import argon2 from "argon2"
import Token from "../helpers/Token";
const prisma = new PrismaClient()

interface DataUSer {
  uniqId: String;
  email: String;
  password: String;
}

interface LoginResult {
  uniqId: String;
  email: String;
  name?: String | undefined;
  phone?: String;
  fullname?: String;
  isActive: boolean;
}

interface LoginResultToken extends LoginResult {
  access_token: String
}

// zod schema
const emailSchema = z.string().email();
const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@#$%^&+=!)',
  });

// email validator
const validateEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch (error) {
    return false;
  }
}
// password validator
const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  try {
    passwordSchema.parse(password);
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map((err) => err.message));
    }
  }
  return errors;
}

const checkPassword = (password: string): any => {
  const errors = validatePassword(password);
  if (errors.length === 0) {
    return true
  } else {
    let errorValidator: String;
    errorValidator = 'Password is invalid. Errors: '
    errors.forEach((error) => {
      console.error(`- ${error}`);
      errorValidator += `- ${error}`
    });
    console.log(errorValidator)
    return errorValidator
  }
}
const UserController = {
  register: async (req: any, res: any, next: any) => {
    let { email, password, name } = req.body
    if (!email || !password || !name) {
      return response(res, 404, 'invalid value')
    }
    if (!validateEmail(email)) {
      return response(res, 404, 'invalid email')
    }
    if (checkPassword(password) !== true) {
      return response(res, 404, checkPassword(password))
    }
    password = await argon2.hash(req.body.password);
    let data: any = {
      uniqId: uuidv4(),
      email,
      password,
      name,
    }

    try {
      let result = await prisma.user.create({ data })
      return res.status(200).json({ data: result, status: 200, message: 'register success' })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          console.log(
            'There is a unique constraint violation, a new user cannot be created with this email'
          )
        }
        return response(res, 404, 'user already register')
      }
      console.log('Error : ', e)
      return response(res, 404, 'failed register user')
    }
  },
  login: async (req: any, res: any, next: any) => {
    let { email, password } = req.body
    if (!email || !password) {
      return response(res, 404, 'invalid value')
    }
    if (!validateEmail(email)) {
      return response(res, 404, 'invalid email')
    }
    if (checkPassword(password) !== true) {
      return response(res, 404, checkPassword(password))
    }
    const searchUser = await prisma.user.findMany({
      where: { email },
    })
    // console.log(searchUser)
    if (searchUser.length === 0) {
      return response(res, 404, 'failed email user not found')
    }

    let userPassword = searchUser[0].password

    let verify = await argon2.verify(userPassword, password);

    if (!verify) {
      return response(res, 404, 'failed wrong password')
    }

    let resultLogin: LoginResult = {
      name: searchUser[0].name !== null ? searchUser[0].name : undefined,
      uniqId: searchUser[0].uniqId,
      email: searchUser[0].email,
      phone: searchUser[0].phone !== null ? searchUser[0].phone : undefined,
      fullname: searchUser[0].fullname !== null ? searchUser[0].fullname : undefined,
      isActive: searchUser[0].isActive,
    }

    let access_token = Token.generateToken(resultLogin)
    let result: LoginResultToken = { ...resultLogin, access_token }

    return response(res, 200, 'login success', result)
  },
  checkToken: async (req: any, res: any, next: any) => {
    req.payload.iat = new Date(req.payload.iat * 1000)
    req.payload.exp = new Date(req.payload.exp * 1000)
    console.log(req.payload)
    return response(res, 200, 'token is active', req.payload)
  },
  get: async (req: any, res: any, next: any) => {
    const result = await prisma.user.findMany({
      include: { Address: true, TicketFlight: true, regency: true, posts: true }
    })
    res.json(result)
  },
  activated: async (req: any, res: any, next: any) => {
    let { email } = req.body
    if (!validateEmail(email)) {
      return response(res, 404, 'invalid email')
    }
    const searchUser = await prisma.user.findMany({
      where: { email },
    })
    if (searchUser.length === 0) {
      return response(res, 404, 'failed email user not found')
    }
    const updateUser = await prisma.user.update({
      where: { email },
      data: { isActive: true },
    })
    if (!updateUser) {
      return response(res, 404, 'failed email cannot active')
    }
    return response(res, 200, 'success email user activated')
  },

}

export default UserController 