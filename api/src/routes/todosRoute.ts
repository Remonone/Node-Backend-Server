import { Router } from "express"
import { dataBase } from ".."
import {dateFormat, Status, TodoItem} from '@src/types/types'
import { validateParams } from "@src/utils/utils"
import moment from "moment"
import { convertToken } from "@src/utils/jwt"

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
    const validatorObject = {
        webToken: 'string',
        todos: {
            name: 'string',
            status: 'expecting'
        }
    }
    if(!validateParams(req.body, validatorObject)) return res.status(400).json({message: 'Invalid body'})
    const payload = convertToken(req.body.webToken)
    if(!!payload.message) return res.status(payload.status).json({message: payload.message})
    dataBase.query(`SELECT ID FROM users WHERE EMAIL = $1`, [payload.email], (err, result) => {
        if(err) return res.status(500).json({message: "Unhandled Error"})
        if(result.rows.length < 1) return res.status(400).json({message: "User was not found"})

        const id = result.rows[0].id
        const date = moment(Date.now()).format(dateFormat)

        const request = `INSERT INTO todos(NAME, STATUS, DESCRIPTION, USER_ID, CREATED_ON, UPDATED_ON) VALUES ($1, $2, $3, $4, $5, $6)`
        let dependencies = Object.values(req.body.todos)

        if(!Object.keys(req.body.todos).find(key => key === 'description')){
            dependencies = [...dependencies, null]
        }
        dependencies.push(...[id, date, date])
        
        dataBase.query(request, dependencies, (error, result) => {
            if(error) {
                return res.status(500).json({message: error.message})
            }
            res.status(200).json({message: 'Successfully uploaded'})
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