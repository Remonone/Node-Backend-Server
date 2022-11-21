import { Router } from "express"
import { dataBase } from ".."
import {Status, TodoItem} from '@src/types/types'
import { validateParams } from "@src/utils/utils"

const todos = Router()

todos.get('', (req, res) => {
    const request = `SELECT * FROM todos ${Object.keys(req.query).length > 0 ? 
        // Parse a request query to get a keys which are used for creating a request to DB.
        'WHERE ' + Object.keys(req.query).map((key, index) => {
            return key.toUpperCase() + ` = $${index + 1}`
        })
        : ''}`
    //Get values of query keys
    const dependencies = Object.values(req.query)

    dataBase.query(request, dependencies, (err, result) => {
        if(err) {
            return res.status(500).json({message: err.message})
        }
        return res.json(result.rows)
    })
})

todos.post('', (req, res) => {
    const body: TodoItem = req.body
    const validatorObject: TodoItem = {
        name: 'string',
        user_id: 0,
        item_created: 'string',
        item_updated: 'string',
        status: 'expecting'
    }
    if(!validateParams(body, validatorObject)) return res.status(400).send('Invalid body')
    const request = `INSERT INTO todos(NAME, USER_ID, CREATED_ON, UPDATED_ON, STATUS, DESCRIPTION) VALUES ($1, $2, $3, $4, $5, $6)`
    let arrayToPush = Object.values(body)
    if(!Object.keys(body).find(item => item === 'description')){
        arrayToPush = [...arrayToPush, null]
    }
    const dependencies = arrayToPush
    dataBase.query(request, dependencies, (err, result) => {
        if(err) {
            return res.status(500).json({message: err.message})
        }
        res.status(200).json({
            message: 'Successfully uploaded'
        })
    })
})

interface CreditinalToChange {
    name?: string
    description?: string
    status?: Status
}
function isAnCreditinal(obj: any): obj is CreditinalToChange {
    return 'name' in obj || 'description' in obj || 'status' in obj;
}


todos.put('/:id', (req, res) => {
    // Without auth verification for now
    const {id} = req.params
    const body = req.body
    if(!isAnCreditinal(body)) return res.status(400).send("Invalid body")
    const request = `UPDATE todos SET ${Object.keys(body).map((item, index) => item.toUpperCase() + ` = $${index+1}`)} WHERE ID = ${id}`
    const dependencies = Object.values(body)
    dataBase.query(request, dependencies, (err, result)=>{
        if(err){
            res.status(500).json({message: err.message}) 
        }
        res.status(200).send("Success")
    })
})

todos.delete('/:id', (req, res) => {
    const {id} = req. params
    dataBase.query(`SELECT FROM todos WHERE ID = $1`, [id], (err,result) => {
        if(result.rows.length < 0) return res.status(400).send('ID was not found')
    })
    dataBase.query(`DELETE FROM todos WHERE ID = $1`, [id], (err, result) => {
        if(err) return res.status(500).json({message: err.message})
        return res.status(200).send('Success')
    })
})

export default todos