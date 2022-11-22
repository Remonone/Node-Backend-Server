import { Router } from "express"
import { dataBase } from ".."
import {dateFormat, Status, TodoItem} from '../types/types'
import { validateParams } from "../utils/utils"
import moment from "moment"
import { convertToken } from "../utils/jwt"

const todos = Router()

todos.get('', (req, res) => {
    const {status} = req.query
    let condition = ''
    condition += status ? `STATUS = '${status}'` : ''
    const request = `SELECT * FROM todos ${condition && 'WHERE ' + condition}`
    dataBase.query(request, (err, result) => {
        if(err) {
            return res.status(500).json({message: err.message})
        }
        return res.json(result.rows)
    })
})

todos.get('/:id', (req, res) => {
    const {id} = req.params
    const request = `SELECT * FROM todos WHERE ID = $1`
    const dependencies = [id]
    dataBase.query(request, dependencies, (err, result) => {
        if(err) return res.status(500).json({message: err.message})
        return res.status(200).json(result.rows)
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
    webToken: string
    name?: string
    description?: string
    status?: Status
}
function isAnCreditinal(obj: any): obj is CreditinalToChange {
    return 'webToken' in obj && ('name' in obj || 'description' in obj || 'status' in obj)
}


todos.put('/:id', (req, res) => {
    const {id} = req.params
    if(!isAnCreditinal(req.body)) return res.status(400).json({message: "Invalid body"})
    const payload = convertToken(req.body.webToken)
    if(!!payload.message) return res.status(401).json({message: "Unauthorized connection"})
    dataBase.query(`SELECT ID FROM users WHERE EMAIL = $1 LIMIT 1`, [payload.email], (err, result) => {
        if(err) return res.status(500).json({message: err.message})
        if(result.rows.length < 1) return res.status(400).json({message:"User was not found"})
        const user = result.rows[0]
        const request = `UPDATE todos SET ${Object.keys(req.body).map((item, index) => item.toUpperCase() + ` = $${index+1}`)} WHERE ID = ${id} AND USER_ID = ${user.id}`
        const dependencies = Object.values(req.body)
        dataBase.query(request, dependencies, (err, result)=>{
            if(err){
                res.status(500).json({message: err.message}) 
            }
            res.status(200).json({message: "Success"})
        })
    })
    
})

todos.delete('/:id', (req, res) => {
    const {id} = req.params
    const validatorObject = {webToken: 'string'}
    if(!validateParams(req.body, validatorObject)) return res.status(400).json({message: "Invalid body"})
    const payload = convertToken(req.body.webToken)
    if(!!payload.message) return res.status(payload.status).json({message: payload.message})
    dataBase.query(`SELECT ID FROM users WHERE EMAIL = $1 LIMIT 1`, [payload.email], (error, result) => {
        if(error) return res.status(500).json({message: "Unhandled error"})
        if(result.rowCount < 1) return res.status(400).json({message: "User was not found"})
        const userID = result.rows[0].id
        dataBase.query(`SELECT * FROM todos WHERE ID = $1`, [id], (errorSelection,result) => {
            if(errorSelection) return res.status(500).json({message: errorSelection.message})
            if(result.rows.length < 0) return res.status(400).json({message: 'ID was not found'})
            if(result.rows[0].user_id !== userID) return res.status(400).json({message: "Todos is not created by this user"})
            dataBase.query(`DELETE FROM todos WHERE ID = $1`, [id], (error))
        })
    })
})

export default todos