import express from 'express'

import * as bookingController from '../controllers/booking.controller'

import {authMiddleware }from '../middlewares/authMiddleware'

import { adminMiddleware } from '../middlewares/adminMiddleware'

const router = express.Router()

router.get('/', [authMiddleware],bookingController.getBookings)

router.get('/:id', [authMiddleware],bookingController.getBooking)

router.get('/:id', [authMiddleware],bookingController.ownerAcceptsBooking)

router.get('/:id', [authMiddleware],bookingController.ownerRejectsBooking)

router.post('/:id', [authMiddleware],bookingController.buyProperty)

router.post('/:id', [authMiddleware],bookingController.rentProperty)

router.delete('/:id', [authMiddleware, adminMiddleware], bookingController.deleteBooking)

