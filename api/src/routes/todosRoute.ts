import { Router } from "express";

const todos = Router()

todos.get('', (req, res) => {
    const {status} = req.query
    res.send(`Your status is: ${status}`)
})

todos.post('', (req, res) => {
    res.send('Your post were accepted.')
})

todos.put('/:id', (req, res) => {
    const {id} = req.params
    res.send(`Your id is: ${id}`)
})

todos.delete('/:id', (req, res) => {
    const {id} = req. params
    res.send(`Deleting todos with id: ${id}`)
})

export default todos