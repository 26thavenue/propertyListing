import express from 'express'

import * as userController from '../controllers/user.controller'

import {authMiddleware }from '../middlewares/authMiddleware'

import { adminMiddleware } from '../middlewares/adminMiddleware'


const userRouter = express.Router()

userRouter.get('/', authMiddleware,userController.getAllUsers)

userRouter.get('/bookings/user', authMiddleware,userController.getBookingsForUser)

userRouter.get('/user/bookings', authMiddleware,userController.getUserBookings)

userRouter.get('/:id', authMiddleware,userController.getOneUser)

userRouter.put('/:id', authMiddleware,userController.updateUserDetails)

userRouter.delete('/', authMiddleware,userController.deleteUser)

// userRouter.put('/email/:id', authMiddleware,userController.updateUserEmail)

userRouter.put('/verify/:id', [authMiddleware, adminMiddleware],userController.verifyUser)


export default userRouter
