import express from 'express'

import * as propertyController from '../controllers/property.controller'

import {authMiddleware }from '../middlewares/authMiddleware'

import { upload } from '../utils/utils'

const router = express.Router()

router.get('/', authMiddleware,propertyController.getAllProperties)

router.post('/', [authMiddleware, upload.array('images', 5)],propertyController.createProperty)

router.get('/:id', authMiddleware,propertyController.getPropertyById)

router.put('/:id', authMiddleware,propertyController.updateProperty)

router.delete('/:id', authMiddleware,propertyController.deleteProperty)