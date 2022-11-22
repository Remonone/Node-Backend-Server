import { Router } from "express";
import todos from "./todosRoute";
import users from "./usersRoute";

const api = Router()

api.use('', users)
api.use('/todos', todos)

export default api