export interface User {
    id: number
    email: string
    password: string
    user_created: string
    user_updated: string 
}
export type Status = 'expecting' | 'proccessing' | 'done'
export interface TodoItem {
    id?: number
    name: string
    description?: string
    user_id: number
    item_created: string
    item_updated: string
    status: Status
}

// USERS

export const dateFormat = 'YYYY-MM-DD HH:mm:ss'
export const roundsSalt = 10

export interface UserCredentials{
    email: string
    password: string
}