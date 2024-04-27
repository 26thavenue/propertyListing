import express from 'express'

import * as userController from '../controllers/user.controller'

import {authMiddleware }from '../middlewares/authMiddleware'

import { adminMiddleware } from '../middlewares/adminMiddleware'


const router = express.Router()

router.get('/', authMiddleware,userController.getAllUsers)

router.get('/', authMiddleware,userController.getBookingsForUser)

router.get('/', authMiddleware,userController.getUserBookings)

router.get('/:id', authMiddleware,userController.getOneUser)

router.put('/:id', authMiddleware,userController.updateUserDetails)

router.delete('/', authMiddleware,userController.deleteUser)

router.put('/:id', authMiddleware,userController.updateUserEmail)

router.put('/:id', [authMiddleware, adminMiddleware],userController.verifyUser)