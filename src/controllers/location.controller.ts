import { prisma } from "../utils/prisma";

import {Request,Response} from 'express'
import { ErrorMiddleware } from "../middlewares/errorMiddleware";


export async function getAllLocations(req: Request, res: Response){
    try {
        const locations = await prisma.location.findMany();
        return res.json(locations);
    } catch (err:any) {
        console.error('Unexpected error:', err);
        const error = new ErrorMiddleware(500, err.toString())
        return res.json({error: error}).status(error.status);
    }
}

export async function getLocationsInState(req: Request, res: Response){
    const state = req.query.state as string;

    if(!state){
        const error = new ErrorMiddleware(400, 'State is required');
        return res.status(error.status).json(error);
    }
    try {
        const locations = await prisma.location.findMany({
            where: {
                state: state
            }
        });
        return res.json(locations);
    } catch (err:any) {
        console.error('Unexpected error:', err);
        const error = new ErrorMiddleware(500, err.toString())
        return res.json({error: error}).status(error.status);
    }
}

export async function getLocationsInACountry(req: Request, res: Response){
    const country = req.query.country as string;

    if(!country){
        const error = new ErrorMiddleware(400, 'Country is required');
        return res.status(error.status).json(error);
    }
    try {
        const locations = await prisma.location.findMany({
            where: {
                country: country
            }
        });
        return res.json(locations);
    } catch (err:any) {
        console.error('Unexpected error:', err);
        const error = new ErrorMiddleware(500, err.toString())
        return res.json({error: error}).status(error.status);
    }
}

export async function getAllLocationsInACity(req:Request, res:Response){
     const city = req.query.city as string;

    if(!city){
        const error = new ErrorMiddleware(400, 'City is required');
        return res.status(error.status).json(error);
    }
    try {
        const locations = await prisma.location.findMany({
            where: {
                city
            }
        });
        return res.json(locations);
    } catch (err:any) {
        console.error('Unexpected error:', err);
        const error = new ErrorMiddleware(500, err.toString())
        return res.json({error: error}).status(error.status);
    }
}

export async function getLocationById(req:Request , res:Response){
    const id = req.params.id;

    if(!id){
        const error = new ErrorMiddleware(400, 'Id is required');
        return res.status(error.status).json(error);
    }
    try {
        const location = await prisma.location.findUnique({
            where: {
                id
            }
        });
        return res.json(location);
    } catch (err:any) {
        console.error('Unexpected error:', err);
        const error = new ErrorMiddleware(500, err.toString())
        return res.json({error: error}).status(error.status);
    }
}