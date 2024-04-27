
import {Request,Response,NextFunction} from 'express'

export async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
   const user = req.user
   if(user?.role.toUpperCase() !== 'ADMIN'){
         return next(res.json({message: 'Unauthorized'}).status(403))
    }
    next()
}