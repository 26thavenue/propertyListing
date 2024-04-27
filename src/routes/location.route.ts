import express from 'express'

import * as locationControler from '../controllers/location.controller'

import {authMiddleware }from '../middlewares/authMiddleware'



const router = express.Router()

router.get('/', authMiddleware,locationControler.getAllLocations)

router.get('/', authMiddleware,locationControler.getAllLocationsInACity)

router.get('/',authMiddleware, locationControler.getLocationsInACountry)

router.get('/',authMiddleware, locationControler.getLocationsInState)

router.get('/:id',authMiddleware, locationControler.getLocationById)