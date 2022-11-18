import { Router } from "express";
import users from "./usersRoute";

const api = Router()

api.get('', (req, res) => {
    res.send('Home page')
})

api.use('/users', users)


export default api