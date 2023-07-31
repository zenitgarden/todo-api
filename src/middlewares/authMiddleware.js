import { prismaClient } from "../application/database.js"
import { ResponseError } from "../commons/error/responseError.js"

export const authMiddleware = async (req, res, next) => {
    const token = req.get('Authorization')
    if(!token){
        next()
    }else {
        const user = await prismaClient.user.findFirst({
            where:{
                token: token
            },
            select: {
                username: true,
            }
        })
        if(!user){
            next(new ResponseError(401, 'Unauthorized'))
        }else {
            req.user = user
            next()
        }
    }
}