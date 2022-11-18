import { Router } from "express";

const users = Router()

users.get('', (req, res) => {
    res.send('This is a user API')
})

users.get('/:id', (req, res) => {
    const { id } = req.params
    res.send(`Selected id: ${id}`)
})

export default users