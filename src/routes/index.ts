import authRouter from './auth.route'

import bookingRouter from './booking.route'

import locationRouter from './location.route'

import propertyRouter from './property.route'

import userRouter from './user.route'

import { Router } from 'express'

const router: Router = Router()


router.use('/auth', authRouter)

router.use('/location', locationRouter)

router.use('/booking', bookingRouter)

router.use('/property', propertyRouter)

router.use('/user', userRouter)



