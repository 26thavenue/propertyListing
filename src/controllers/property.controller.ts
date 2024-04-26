import {prisma} from '../utils/prisma'
import { Property , Location, User} from '@prisma/client'
import {Request,Response} from 'express'
import {ErrorMiddleware} from '../middlewares/errorMiddleware'

export async function createProperty(req:Request,res:Response){
   
}

export async function deleteProperty(req:Request,res:Response){

    const {id} = req.params

    if(!id){
        const error = new ErrorMiddleware(400, 'Property ID is required')
        return res.json(error.message).status(error.status)
    }

    try {

        const property = await prisma.property.findUnique({
            where:{
                id:id
            }
        })
        if(!property){
            const error = new ErrorMiddleware(400, 'Property does not exist')
            return res.json(error.message).status(error.status)
        }
        await prisma.property.delete({
            where:{
                id:id
            }
        })  

        return res.json({message:"Property succesfully deleted"}).status(201)
    } catch (err) {
        console.error(err)
        const error = new ErrorMiddleware(500, 'Internal Server Error')
        return res.json(error.message).status(error.status)

    }

}


export async function updateProperty(req:Request,res:Response){}

export async function getAllProperties(req:Request,res:Response){
    try {
        const properties = await prisma.property.findMany({
            include:{
                location:true
            }
        })
        return res.json(properties).status(201)
    } catch (err) {
        console.error(err)
        const error = new ErrorMiddleware(500, 'Internal Server Error')
        return res.json(error.message).status(error.status)
        
    }
}

export async function getPropertyById(req:Request,res:Response){
    const {id} = req.params

    if(!id){
        const error = new ErrorMiddleware(400, 'Property ID is required')
        return res.json(error.message).status(error.status)
    }

    try {

        const property = await prisma.property.findUnique({
            where:{
                id:id
            }
        })
        if(!property){
            const error = new ErrorMiddleware(400, 'Property does not exist')
            return res.json(error.message).status(error.status)
        }

        return res.json(property).status(201)
    } catch (err) {
        console.error(err)
        const error = new ErrorMiddleware(500, 'Internal Server Error')
        return res.json(error.message).status(error.status)
        
    }
}

