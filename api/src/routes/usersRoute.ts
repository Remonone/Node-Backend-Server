import { convertToken, getToken } from "@src/utils/jwt";
import { validateParams } from "@src/utils/utils";
import { Router } from "express";
import bcrypt from "bcrypt"
import { roundsSalt, UserCredentials } from "@src/types/types";
import { dataBase } from "..";
import moment from "moment";

const users = Router()

users.post('/signup', (req, res) => {
    const validatorObject: UserCredentials = {
        email: 'string',
        password: 'string'
    }
    if(!validateParams(req.body, validatorObject)) return res.status(400).json({message: "Invalid body"})
    const jwtToken = getToken(req.body.email)
    const date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    const request = `INSERT INTO users(EMAIL, PASSWORD, CREATED_ON, UPDATED_ON) VALUES ($1, $2, $3, $4)`
    bcrypt.hash(req.body.password, roundsSalt, (err, hash) => {
        if(err) return res.status(500).json({message: "Internal Server Error"})
        dataBase.query(request, [req.body.email, hash, date, date], (err, result) =>{
            if(err) return res.status(500).json({message: err.message})
            return res.status(200).json({webToken: jwtToken})
        })
    })
})



users.post('/signin', (req, res) => {
    const validatorObject: UserCredentials = {
        email: 'string',
        password: 'string'
    }
    if(!validateParams(req.body, validatorObject)) return res.status(400).json({message: "Invalid body"})
    const request = `SELECT * FROM users WHERE EMAIL = $1 LIMIT 1;`
    const dependencies = [req.body.email]
    dataBase.query(request, dependencies, (err, result) => {
        if(err) return res.status(500).json({message: err.message})
        if(result.rows.length < 1) res.status(400).json({message: "User not found"})
        bcrypt.compare(req.body.password, result.rows[0].password, (error, result)=>{
            if(error) return res.status(500).json({message: "Unhandled error"})
            if(!result) return res.status(401).json({message: "Invalid credentials"})
            const jwtToken = getToken(req.body.email)
            return res.status(200).json({webToken: jwtToken})
        })
    })
})

users.put('/changePassword', (req, res) => {
    res.send('This is a login form')
})

users.get('/profile', (req, res) => {
    const validatorObject = {
        webToken: 'string'
    }
    if(!validateParams(req.body, validatorObject)) return res.status(400).json({message: "Invalid body."})
    const payload = convertToken(req.body.webToken)
    if(!!payload.message) return res.status(payload.status).json({message: payload.message})
    const request = `SELECT * FROM users WHERE EMAIL = $1`
    const dependencies = [payload.email]
    dataBase.query(request, dependencies, (err, result) => {
        if(err) return res.status(500).json({message: err.message})
        res.status(200).json(result.rows[0])
    })
})

export default users