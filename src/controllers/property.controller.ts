import {prisma} from '../utils/prisma'
import {Request,Response} from 'express'
import {ErrorMiddleware} from '../middlewares/errorMiddleware'


export async function createProperty(req:Request,res:Response){

    const {name, details, price, address,  city,state, country, category, cautionFee, agencyFee, legalFee} = req.body

    if(!name || !details || !price || !address || !city || !state || !country || !category ){
        const error = new ErrorMiddleware(400, 'All fields are required')
        return res.json(error.message).status(error.status)
    }

    if (!Array.isArray(req.files)) {
      const error = new ErrorMiddleware(400, 'Images are required')
      return res.status(error.status).json({message:error.message})
    }

    const imageUrls = req?.files?.map(file => file.path);


    try {
        const location = await prisma.location.create({
            data:{
                address:address,
                city:city,
                state:state,
                country:country
            }
        })

        const property = await prisma.property.create({
            data:{
                name:name,
                details:details,
                price:price,
                cautionFee:cautionFee,
                agencyFee:agencyFee,
                legalFee:legalFee,
                category:category,
                location:{
                    connect:{
                        id:location.id
                    }
                },
                imageUrls,
                user:{
                    connect:{
                        id:req.user?.id
                    }
                }
            }
        })

        return res.json(property).status(201)
        
    } catch (err:any) {

        console.error(err)
        const error = new ErrorMiddleware(500, 'Internal Server Error')
        return res.status(error.status).json(error.message)
        
    }

    

    
   
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
            },include:{
                user:true
            }
        })

        if(!property){
            const error = new ErrorMiddleware(400, 'Property does not exist')
            return res.json(error.message).status(error.status)
        }

        if(property?.user.id !== req.user?.id || req.user?.role !== 'ADMIN'){
            const error = new ErrorMiddleware(401, 'You are not authorized to delete this property')
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

