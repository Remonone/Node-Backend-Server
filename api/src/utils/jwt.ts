import jwt from "jsonwebtoken";

const jwtKey = 'secretKey'
const jwtExpires = 432000


export const getToken = (email: string): string => {
    const token = jwt.sign({email}, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpires
    })

    console.log(token)
    return token
}

export const convertToken = (token: string): any => {
    if(!token) return {status: 400, message: "Empty token"}
    try{
        const payload = jwt.verify(token, jwtKey)
        return payload
    }catch(e) {
        if(e instanceof jwt.JsonWebTokenError){
            return {status: 401, message: "Unauthorized"}
        }
        return {status: 400, message: "Bad Request"}
    }
}