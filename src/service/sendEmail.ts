import { Resend } from "resend";
import dotenv from 'dotenv'

import { Category } from "@prisma/client";

import { ErrorMiddleware } from "../middlewares/errorMiddleware";

dotenv.config()

const apiKey = process.env.RESEND_API_KEY!

const resend = new Resend(apiKey);


export async function sendBuyerBookingEmail(buyerEmail: string, type:Category, name:string, buyer:string) {
    const { data, error } = await resend.emails.send({
        from: "oni.oluwatomiwa@stu.cu.edu.ng",
        to: [buyerEmail],
        subject: "Booking Confirmation to " + " " + type.toLocaleLowerCase() + "property" +  " " + name,
        html: "Hello " + buyer + ", <br> <br> Your booking to " + type.toLocaleLowerCase() + "property" + 
         " " + name + " has been sent please wait for the seller to accept or reject the transaction. <br> <br> Thank you for using our platform. <br> <br> Regards, <br> <br>  Team"
    });

    if (error) {
        console.error(error)
        throw new ErrorMiddleware(500, "An error occured while sending email")
        
    }

    return data


}

export async function sendSellerBookingEmail(sellerEmail: string, type:Category, propertyName:string, buyer:string) {
    const { data, error } = await resend.emails.send({
        from: "oni.oluwatomiwa@stu.cu.edu.ng",
        to: [sellerEmail],
        subject: "Booking Confirmation to " + " " + type.toLocaleLowerCase() + "property" +  " " + name,
        html: "Hello, A booking has been placed to  " + type.toLocaleLowerCase() + " your property " + 
         " " + propertyName + " by " + buyer + 
        " please accept or reject the transaction. <br> <br> Thank you for using our platform. <br> <br> Regards, <br> <br>  Team"
    });

    if (error) {
        console.error(error)
        throw new ErrorMiddleware(500, "An error occured while sending email")
        
    }

    return data
}

export async function sendBuyerBookingAcceptedEmail(email: string, type:Category, propertyName:string, seller:string, buyer:string) {
    const { data, error } = await resend.emails.send({
        from: "oni.oluwatomiwa@stu.cu.edu.ng",
        to: [email],
        subject: "Booking Accepted",
        html: "Hello, your booking to  " + type.toLocaleLowerCase() + " property " + 
         " " + propertyName +
        " has been accepted please contact the seller for further information. <br> <br> Thank you for using our platform. <br> <br> Regards, <br> <br>  Team"
    });

    if (error) {
        console.error(error)
        throw new ErrorMiddleware(500, "An error occured while sending email")
        
    }

    return data

}

export async function sendBuyerBookingRejectionEmail(email: string, type:Category, propertyName:string, seller:string) {
     const { data, error } = await resend.emails.send({
        from: "oni.oluwatomiwa@stu.cu.edu.ng",
        to: [email],
        subject: "Booking Rejected",
        html: "Hello, your booking to  " + type.toLocaleLowerCase() + " property " + 
         " " + propertyName +
        " has been declined by the seller. <br> <br> Thank you for using our platform. <br> <br> Regards, <br> <br>  Team"
    });

    if (error) {
        console.error(error)
        throw new ErrorMiddleware(500, "An error occured while sending email")
        
    }

    return data
}
