import { ErrorMiddleware } from "../middlewares/errorMiddleware";
import { prisma } from "../utils/prisma";
import {Request, Response} from 'express'
import { ZodMiddleware } from '../middlewares/errorMiddleware';
import { userValidator } from '../utils/schema';
import { hashSync} from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function updateUserDetails(req:Request, res:Response){
    const {id} = req.params;
    const {name, password, email} = req.body

    

    if(!id || !name || !password || !email){
        

        const error = new ErrorMiddleware(400, 'Please provide all the required inputs')
        return res.json(error.message).status(error.status)
    }

    try {
        // userValidator.validate(req.body)

        const duplicateEmail = await prisma.user.findFirst({
            where: {email}
        })

        if(duplicateEmail){
            const error = new ErrorMiddleware(403, 'This email is already in use')
            return res.json(error.message).status(error.status)
        }
        await prisma.user.update({
            where: {id},
            data: {
                name,
                hashedPassword: hashSync(password,10),
                email
            }
        })

    } catch (error) {
        console.log(error);
    }
}

export async function updateUserEmail(req:Request, res:Response){
    const id = req.user?.id

    if(!id){
        const error = new ErrorMiddleware(400, 'User ID is required')
        return res.json(error.message).status(error.status)
    }

    const { name, password, email } = req.body;

    const { name: currentName, email: currentEmail, hashedPassword: currentHashedPassword } = req.user ?? {};


    try {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
        const error = new ErrorMiddleware(404, 'User not found');
        return res.status(error.status).json({ message: error.message });
        }

        const duplicateEmail = await prisma.user.findFirst({ 
            where: { email } 
        });

        if (duplicateEmail && duplicateEmail.id !== user.id) {
            const error = new ErrorMiddleware(403, 'This email is already in use');
            return res.status(error.status).json({ message: error.message });
        }

        const updateData: {
            name?: string;
            email?: string;
            hashedPassword?: string;
        } = {};

        updateData.name = name || currentName;
        updateData.email = email || currentEmail;
        updateData.hashedPassword = password ? hashSync(password, 10) : currentHashedPassword;

        userValidator.validate(updateData);

    
        const updatedUser = await prisma.user.update({
            where: { 
                id 
            },
            data: updateData,
            
        });

        res.json(updatedUser).status(201);

    } catch (error) {
        console.log(error);
    }
}


export async function getUserBookings(req:Request, res:Response){
    const userId = req.user?.id;
    if(!userId){
        const error = new ErrorMiddleware(400, 'User ID is required')
        return res.json(error.message).status(error.status)
    }

    try {
        const bookings = await prisma.booking.findMany({
            where: {
                buyerId: userId,
            },
            include: {
                property: true,
            },
        });
        return res.json(bookings).status(200)
    } catch (err:any) {
        console.log(err);
        const error = new ErrorMiddleware( 500,`Internal Server Error, ${err.toString()}`)
        return res.json(error.message).status(error.status)
    }

}

export async function getBookingsForUser(req:Request, res:Response){

    const userId = req.user?.id;
    if(!userId){
        const error = new ErrorMiddleware(400, 'User ID is required')
        return res.json(error.message).status(error.status)
    }

    try {
        const bookingRequests = await prisma.booking.findMany({
            where: {
                property: {
                    ownerId: userId,
                },
            },
            include: {
                property: true,
                user: true,
            },
        });
        return res.json(bookingRequests).status(200)
    } catch (err:any) {
        console.log(err);
        const error = new ErrorMiddleware( 500,`Internal Server Error, ${err.toString()}`)
        return res.json(error.message).status(error.status)
    }


}

export async function deleteUser(req:Request, res:Response){
    const id = req.user?.id 
    if(!id){
        const error = new ErrorMiddleware( 400,'User ID is required')
        return res.json(error.message).status(error.status)
    }

    

    try {

        const checkUser = await prisma.user.findUnique({
            where: {
                id
            }
        })  

        if(!checkUser){
            const error = new ErrorMiddleware( 404,'User not found')
            return res.json(error.message).status(error.status)
        }


        await prisma.user.delete({
            where: {
                id
            }
        })


        return res.json({message: 'User deleted'}).status(200)
    } catch (err:any) {
        console.log(err);
        const error = new ErrorMiddleware( 500,`Internal Server Error, ${err.toString()}`)
        return res.json(error.message).status(error.status)
    }

}

export async function getOneUser(req:Request, res:Response){
    const {id} = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {id: id}
        })
        return res.json(user).status(200)
    } catch (err:any) {
        console.log(err);
        const error = new ErrorMiddleware( 500,`Internal Server Error, ${err.toString()}`)
        return res.json(error.message).status(error.status)
    }
}

export async function getAllUsers(req:Request, res:Response){
    try {
        const users = await prisma.user.findMany()
        return res.json(users).status(200)
    } catch (err:any) {
        console.log(err);
        const error = new ErrorMiddleware( 500,`Internal Server Error, ${err.toString()}`)
        return res.json(error.message).status(error.status)
    }
}

export async function verifyUser(req:Request, res:Response){
    const {userId} = req.body

    if(!userId){
        const error = new ErrorMiddleware( 400,'User ID is required')
        return res.json(error.message).status(error.status)
    }

    try {

        const user = await prisma.user.findUnique({
            where: {id: userId}
        })

        if(!user){
            const error = new ErrorMiddleware( 404,'User not found')
            return res.json(error.message).status(error.status)
        }

        await prisma.user.update({ 
            where: {
                id: userId
            },
            data: {
                verified: true
            }
        })

        return res.json({message: 'User verified'}).status(200)
        
    } catch (err:any) {
        const error = new ErrorMiddleware( 500,`Internal Server Error, ${err.toString()}`)
        return res.json(error.message).status(error.status)
        
    }

}