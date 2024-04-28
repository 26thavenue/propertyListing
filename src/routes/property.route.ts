import express from 'express'

import * as propertyController from '../controllers/property.controller'

import {authMiddleware }from '../middlewares/authMiddleware'

import { upload } from '../utils/utils'

const propertyRouter = express.Router()

propertyRouter.get('/', authMiddleware,propertyController.getAllProperties)

propertyRouter.post('/', [authMiddleware, upload.array('images', 5)],propertyController.createProperty)

propertyRouter.get('/:id', authMiddleware,propertyController.getPropertyById)


propertyRouter.delete('/:id', authMiddleware,propertyController.deleteProperty)

export default propertyRouter