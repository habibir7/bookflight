
import createHttpError from "http-errors";
import express from "express"
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

import argon2 from "argon2"
const prisma = new PrismaClient()

interface DataUSer {
  uniqId : String;

}

const UserController = {
  posts: async (req: any, res: any, next: any) => {
    let data = {
      
    }
    console.log("from user controller")
    const posts = await prisma.post.findMany({
      include: { author: true }
    })
    res.json(posts)
  }, 
  get: async (req: any, res: any, next: any) => {
    let data = {

    }
    console.log("from user controller")
    const posts = await prisma.post.findMany({
      include: { author: true }
    })
    res.json(posts)
  },
  create: async (req:any,res:any,next:any) => {
    // const dataUser : DataUSer = {
    //   uniqId: uuidv4()
    // }

    // const result = await prisma.user.create({
    //   dataUser
    // })
  } 
}

export default UserController 