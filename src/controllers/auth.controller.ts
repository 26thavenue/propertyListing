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
    // console.log(req.body)
    const { email, password } = req.body 

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
        console.log(refreshToken)

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken
            }
        })

        return res.json({user , refreshToken,accessToken})

        
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
        const {status, message} = userValidator.validate(req.body)

        if(status && message){
            const error = new ErrorMiddleware(400, message);
            return res.status(error.status).json(error);
        }

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
    const refreshToken = req.user?.refreshToken;

    if (!refreshToken) {
        const error = new ErrorMiddleware(401, 'No refresh token provided');
        return res.json(error.message).status(error.status);
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
            return res.status(error.status).json(error.message);
        }

        const accessToken = generateAccessToken(user);

        return res.json({ accessToken });
    } catch (error) {
        console.error(error)
        return res.status(401).json({ message: 'An error occurred ' });
    }

}
