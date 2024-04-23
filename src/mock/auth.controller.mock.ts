import {Request, Response} from 'express'
import {prisma} from '../utils/prisma'
import { hashSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { userValidator } from '../utils/schema';
import { ErrorMiddleware } from '../middlewares/errorMiddleware';
import { ZodMiddleware } from '../middlewares/errorMiddleware';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';


dotenv.config()

type userRequest ={
    name?: string,
    email: string,
    password: string,
    refreshToken?:string
}




const secret = process.env.TOKEN_SECRET as string;

export async function login(data:userRequest){
    const { email, password} = data

    if(!email || !password ){    
        const error = new ErrorMiddleware(400, 'Email and password are required');
        return error
    }

    try {

        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if(!user){
            const error = new ErrorMiddleware(404, 'No such user exists please sign up');
            return error.toJSON()
        }

        if(!compareSync(password,user.hashedPassword)){
            const error = new ErrorMiddleware(403, 'Invalid credentials');
            return error.toJSON();
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken
            }
        })

        return ({user , accessToken})

        
    } catch (error:any) {
        console.error('Unexpected error:', error);
        return error.toJson()
        
    }


    
}

export async function register(data:userRequest){
    
    const {name, email, password} = data

    if(!email || !password || !name){    
        const error = new ErrorMiddleware(400, 'Email and password are required');
        return error.toJSON()
    }

    try {
        userValidator.validate(data)

        const checkIfUserEmailExists = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if(checkIfUserEmailExists){
            const error = new ErrorMiddleware(409, 'Email already exists');
            return error.toJSON()
        }

        const user = await prisma.user.create({
            data: {
                    email: email,
                    hashedPassword: hashSync(password,10),
                    name: name
            }
        })

        return user

    } catch (error:any) {
        if (error instanceof ZodMiddleware) {
            console.error(`Validation Error: ${error.message}`);
        } else {
            console.error('Unexpected error:', error);
            return ({message: "An error occured"})
        }
    }
}

export const getNewAccessToken = async (data:userRequest) => {
    const {refreshToken }= data;

    if (!refreshToken) {
        const error = new ErrorMiddleware(401, 'No refresh token provided');
        return error.toJSON()
    }

    try {
        const payload = jwt.verify(refreshToken, secret) as any;

        const user = await prisma.user.findFirst({
            where: {
                id: payload.id
            }
        });

        if (!user) {
            const error = new ErrorMiddleware(401, 'Unauthorized');
            return error.toJSON();
        }

        const accessToken = generateAccessToken(user);

        return ({ accessToken });
    } catch (error) {
        console.error('Unexpected error:', error);
        return ({ message: 'Unauthorized' });
    }

}

export async function forgotPassword(req: Request, res: Response){

}

export async function resetPassword(req: Request, res: Response){

}
