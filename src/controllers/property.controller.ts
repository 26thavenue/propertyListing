import {prisma} from '../utils/prisma'
import { Property , Location, User} from '@prisma/client'
import {Request,Response} from 'express'

type LocationRequest = {
    address:string,
    city:string,
    state:string,
    country:string
}

type PropertyRequest = {
    name:string,
    details:Array<string>,
    price:number,
    datesBooked: Array<Date>,
    location:LocationRequest,
    cautionFee?: number,
    agencyFee?: number,
    legalFee?: number,
    images?: Array<string>


}

export async function createProperty(req:Request,res:Response){
    const {name,description,price,location} = req.body
   
}

