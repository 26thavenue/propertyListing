import {prisma} from '../utils/prisma'
import { STATUS,Category} from '@prisma/client'
import {Request, Response} from 'express'
import { ErrorMiddleware } from '../middlewares/errorMiddleware'
import { isDateRangeAvailable } from '../utils/utils'

interface DateRange {
    startDate: Date;
    endDate: Date;
}

type DateOrDateRange = Date | DateRange;


export async function buyProperty(req: Request, res:Response){
    // CHECK IF PROPERTY EXISTS
    // CHECK IF PROPERTY IS OF CATEGORY BUY
    // CHECK IF PROPERTY IS AVAILABLE
    // CREATE A BOOKING
    // GET OWNER DETAILS
    // SEND EMAIL AND PUSH NOTIFICATIONS TO OWNER 

    const id = req.user?.id

    if(!id){
        const error = new ErrorMiddleware(400, 'User ID is required')
        return res.json(error.message).status(error.status)
    }

    const propertyId = req.params.id

    if(!propertyId){
        const error = new ErrorMiddleware(400, 'Property ID is required')
        return res.json(error.message).status(error.status)
    }

    try {
        const property = await prisma.property.findUnique({
            where:{
                id:propertyId
            }
        })

        if(!property){
            const error = new ErrorMiddleware(400, 'Property does not exist')
            return res.json(error.message).status(error.status)
        }

        const propertyCategory = property?.category as Category
        const isproductAvailable = property?.isAvailable

        if(propertyCategory !== 'SALE' && isproductAvailable == false){
            return res.json({message:"Property parameters mismatch"}).status(400)
        }

        

        const booking = await prisma.booking.create({
            data:{
                propertyId,
                buyerId:id,
            }
        })

        return res.json(booking).status(201)


        // sendEmail()

        
    } catch (err:any) {
        console.error(err)
        const error = new ErrorMiddleware(500, err.toString())
        return res.json(error.message).status(error.status)
    }

}


export async function rentProperty(req: Request, res:Response){
    // CHECK IF PROPERTY EXISTS
    // CHECK IF PROPERTY IS OF CATEGORY RENT OR SHORTLET
    // CHECK IF PROPERTY IS AVAILABLE
    // CHECK IF THERE IS NO BOOKING ON THE PROPERTY BETWEEN THE DATES
    // CREATE A BOOKING
    // GET OWNER DETAILS
    // SEND EMAIL AND PUSH NOTIFICATIONS TO OWNER 

    const id = req.user?.id

    if(!id){
        const error = new ErrorMiddleware(400, 'User ID is required')
        return res.json(error.message).status(error.status)
    }

    const { startDate, endDate} = req.body

    const propertyId = req.params.id

    if(!propertyId || !startDate || !endDate ){
        const error = new ErrorMiddleware(400, 'All fields are required')
        return res.json(error.message).status(error.status)
    }

    try {

        const property = await prisma.property.findUnique({
            where:{
                id:propertyId
        }

        })

        const propertyCategory = property?.category as Category

        if(propertyCategory == 'SALE' ){
            return res.json({message: 'Property parameters mismatch'}).status(400)
        }

        
        const areDatesAvailable = isDateRangeAvailable(new Date(startDate), new Date(endDate), property?.datesBooked as any[])

        if(!areDatesAvailable){
            return res.json({message:"Property is not available for the selected dates"}).status(400)
        }

        const booking = await prisma.booking.create({
            data:{
                propertyId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                buyerId:id,
            }
        })

        return res.json(booking).status(201)


        // sendEmail()
        
    } catch (err:any) {
        console.error(err)
        const error = new ErrorMiddleware(500, err.toString())
        return res.json(error.message).status(error.status)
    }

   
}

export async function ownerAcceptsBooking(req: Request, res:Response){

    const id = req.user?.id

    if(!id){
        const error = new ErrorMiddleware(400, 'User ID is required')
        return res.json(error.message).status(error.status)
    }

    const {bookingId}  = req.params

    try {
       const booking = await prisma.booking.findUnique({
              where:{
                id:bookingId
              },
              include:{
                    property:{
                        include:{
                            user:true,
                            
                        }
                    
                    }
              }
         }) 

        if(!booking){
            const error = new ErrorMiddleware(400, 'Booking does not exist')
            return res.json(error.message).status(error.status)
        }


        const isUserProperty = booking.property.ownerId == id

        if(!isUserProperty){
            return res.json({message:"This is not your property, thief!!!!"}).status(401)
        }

        const property = await prisma.property.findUnique({
            where: { id: booking.propertyId },
        });

        if( property?.category == 'SALE'){

            const property = await prisma.property.update({
                where: { id: booking.propertyId },
                data:{
                    isAvailable:false
                }
            })
            const updatedBooking = await prisma.booking.update({
                where:{
                    id:bookingId
                },
                data:{
                    status: STATUS.APPROVED
                }
            })

            // MAKE PAYMENTS

            return res.json({updatedBooking, property}).status(201)
        }
        else if(property?.category == 'RENT' || property?.category == 'SHORTLET') {
            const dateRange: DateRange = {
                startDate: booking?.startDate as Date,
                endDate: booking?.endDate as Date,
            };

            const updatedDatesBooked:any[] = [...property?.datesBooked || [], dateRange];

            await prisma.property.update({
                where: { id: booking.propertyId },
                data:{
                    datesBooked: updatedDatesBooked,
                }
            });

            const updatedBooking = await prisma.booking.update({
                where:{
                    id:bookingId
                },
                data:{
                    status: STATUS.APPROVED
                }
            })

            // MAKE PAYMENTS

            return res.json({updatedBooking, property}).status(201)


        }

    } catch (err:any) {
        console.error(err)
        const error = new ErrorMiddleware(500, err.toString())
        return res.json(error.message).status(error.status)
    }



}

export async function ownerRejectsBooking(req: Request, res:Response){
    const id = req.user?.id

    if(!id){
        const error = new ErrorMiddleware(400, 'User ID is required')
        return res.json(error.message).status(error.status)
    }

    const {bookingId}  = req.params

    try {
        const booking = await prisma.booking.findUnique({
              where:{
                id:bookingId
              },
              include:{
                    property:{
                        include:{
                            user:true,
                            
                        }
                    
                    }
              }
         })

        if(!booking){
            const error = new ErrorMiddleware(400, 'Booking does not exist')
            return res.json(error.message).status(error.status)
        } 

        await prisma.booking.update({
                where:{
                    id:bookingId
                },
                data:{
                    status: STATUS.DECLINED
                }
            })

        return res.json({message:'Your booking was rejected'}).status(400)


    } catch (err:any) {
        console.error(err)
        const error = new ErrorMiddleware(500, err.toString())
        return res.json(error.message).status(error.status)
    }




}


export async function getBookings(req: Request, res:Response){
    const bookings = await prisma.booking.findMany();
    try {
        if(!bookings) return res.json({messge:'No bookings found'}).status(404)

        return res.json(bookings).status(200)
    } catch (error) {
        
    }

}

export async function getBooking(req: Request, res:Response){
    const {id} = req.params

    if(!id){
        const error = new ErrorMiddleware(400, 'Booking ID is required')
        return res.json(error.message).status(error.status)
    }

    try {

        const booking = await prisma.booking.findUnique({
            where:{
                id:id
            }
        })
        if(!booking){
            const error = new ErrorMiddleware(400, 'Booking does not exist')
            return res.json(error.message).status(error.status)
        }

        return res.json(booking).status(201)
    } catch (err:any) {
        console.error(err)
        const error = new ErrorMiddleware(500, err.toString)
        return res.json(error.message).status(error.status)
        
    }

}

export async function deleteBooking(req: Request, res: Response){
    const {id} = req.params

    if(!id){
        const error = new ErrorMiddleware(400, 'Booking ID is required')
        return res.json(error.message).status(error.status)
    }

    try {
        const booking = await prisma.booking.findUnique({
            where:{
                id
            }
        })

        if(!booking){
            const error = new ErrorMiddleware(400, 'Booking does not exist')
            return res.json(error.message).status(error.status)
        }

        const user = await prisma.user.findUnique({
            where:{
                id:booking.buyerId
            }
        })

        if(req.user?.id !== booking.buyerId || user?.role !== 'ADMIN'){
            return res.json({message:'You are not authorized to delete this booking'}).status(401)
        }

        await prisma.booking.delete({
            where:{
                id:id
            }
        })

        return res.json({message:'Booking deleted'}).status(200)
    } catch (err:any) {
        console.error(err)
        const error = new ErrorMiddleware(500, err.toString())
        return res.json(error.message).status(error.status)
    }
}






