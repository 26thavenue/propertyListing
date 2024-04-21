import { Router } from "express";

const router:Router = Router()

router.get('/login', (req, res) => {
    res.send('Login')
})

router.get('/register', (req, res) => {
    res.send('Register')
})
