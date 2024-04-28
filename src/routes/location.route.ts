import express from 'express'

import * as locationControler from '../controllers/location.controller'

import {authMiddleware }from '../middlewares/authMiddleware'



const locationRouter = express.Router()

locationRouter.get('/', authMiddleware,locationControler.getAllLocations)

locationRouter.get('/city', authMiddleware,locationControler.getAllLocationsInACity)

locationRouter.get('/country',authMiddleware, locationControler.getLocationsInACountry)

locationRouter.get('/state',authMiddleware, locationControler.getLocationsInState)

locationRouter.get('/:id',authMiddleware, locationControler.getLocationById)

export default locationRouter