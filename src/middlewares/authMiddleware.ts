import { Request,Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

export const authMiddleware = async(req:Request, res:Response, next:NextFunction) => {
    const bearerToken = req.headers.authorization

   

    if(!bearerToken){
        return next(res.json({message: 'No token provided'}).status(401))
    }

    const token = bearerToken.split(' ')[1]

    
    // console.log(token)
    try {

        console.log({token, secret: process.env.TOKEN_SECRET})

        const payload = jwt.verify(token as string, process.env.TOKEN_SECRET as string) as any

        console.log(payload)

        const user = await prisma.user.findFirst({
            where: {
                id: payload.id
            }
        })

        if(!user){
            return next(res.json({message: 'Unauthorized'}).status(401))
        }

        req.user = user
        next()
        
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    


}