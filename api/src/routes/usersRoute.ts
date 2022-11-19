import { Router } from "express";

const users = Router()

users.post('/signup', (req, res) => {
    res.send('This is a registration form')
})

users.post('/signin', (req, res) => {
    res.send('This is a login form')
})

users.put('/changePassword', (req, res) => {
    res.send('This is a login form')
})

export default users