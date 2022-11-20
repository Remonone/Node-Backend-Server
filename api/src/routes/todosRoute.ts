import { Router } from "express";
import { dataBase } from "..";

const todos = Router()

todos.get('', (req, res) => {
    const {status} = req.query
    res.send(`Your status is: ${status}`)
})

todos.post('', (req, res) => {
    res.send('Your post were accepted.')
})


// TEMPORARY PATH's FOR CHECKING DATABASE

todos.get('/create', (req, res) => {
    dataBase.query(`INSERT INTO todos(ID, NAME, USER_ID, CREATED_ON, UPDATED_ON, STATUS)
    VALUES (1, $1, $2, $3, $4, $5)`, ['Test1', '2', '2022-11-20 22:22:22', '2022-11-20 22:22:22', 'expecting'], (err, responce) => {
        res.send(responce)
    })
})

todos.get('/check', (req, res) => {
    dataBase.query('SELECT * FROM todos', (err, responce) => {
        res.send(responce)
    })
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