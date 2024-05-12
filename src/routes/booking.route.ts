
import express from 'express'

import * as bookingController from '../controllers/booking.controller'

import {authMiddleware }from '../middlewares/authMiddleware'

import { adminMiddleware } from '../middlewares/adminMiddleware'

const bookingRouter = express.Router()

bookingRouter.get('/', [authMiddleware],bookingController.getBookings)

bookingRouter.get('/:id', [authMiddleware],bookingController.getBooking)

bookingRouter.get('/owner/accept/:id', [authMiddleware],bookingController.ownerAcceptsBooking)

bookingRouter.get('/owner/reject/:id', [authMiddleware],bookingController.ownerRejectsBooking)

bookingRouter.post('/buy/:id', [authMiddleware],bookingController.buyProperty)

bookingRouter.post('/rent/:id', [authMiddleware],bookingController.rentProperty)

bookingRouter.delete('/:id', [authMiddleware, adminMiddleware], bookingController.deleteBooking)

export default bookingRouter

