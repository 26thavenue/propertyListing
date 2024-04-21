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


const secret = process.env.TOKEN_SECRET as string;

export async function login(req: Request, res: Response){
    const { email, password} = req.body

    if(!email || !password ){    
        const error = new ErrorMiddleware(400, 'Email and password are required');
        return res.status(error.status).json(error);
    }

    try {

        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if(!user){
            const error = new ErrorMiddleware(404, 'No such user exists please sign up');
            return res.status(error.status).json(error);
        }

        if(!compareSync(password,user.hashedPassword)){
            const error = new ErrorMiddleware(403, 'Invalid credentials');
            return res.status(error.status).json(error);
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

        return res.json({user , accessToken})

        
    } catch (error:any) {
        console.error('Unexpected error:', error);
        return res.json({error: 'Unexpected error'}).status(500);
        
    }


    
}

export async function register(req: Request, res: Response){
    
    const {name, email, password} = req.body

    if(!email || !password || !name){    
        const error = new ErrorMiddleware(400, 'Email and password are required');
        return res.status(error.status).json(error);
    }

    try {
        userValidator.validate(req.body)

        const checkIfUserEmailExists = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if(checkIfUserEmailExists){
            const error = new ErrorMiddleware(409, 'Email already exists');
            return res.status(error.status).json(error);
        }

        const user = await prisma.user.create({
            data: {
                    email: email,
                    hashedPassword: hashSync(password,10),
                    name: name
            }
        })

        return res.json(user)

    } catch (error:any) {
        if (error instanceof ZodMiddleware) {
            console.error(`Validation Error: ${error.message}`);
        } else {
            console.error('Unexpected error:', error);
            return res.json({error: 'Unexpected error'}).status(500);
        }
    }
}

export const getNewAccessToken = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
        const payload = jwt.verify(refreshToken, secret) as any;

        const user = await prisma.user.findFirst({
            where: {
                id: payload.id
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const accessToken = generateAccessToken(user);

        return res.json({ accessToken });
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

}

export async function forgotPassword(req: Request, res: Response){

}

export async function resetPassword(req: Request, res: Response){

}
