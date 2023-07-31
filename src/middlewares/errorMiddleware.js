import { logger } from "../application/logging.js";
import { ResponseError } from "../commons/error/responseError.js"

export const errorMiddleware = async (err, req, res, next) => {
    if(!err){
        next();
    }
    
    if(err instanceof ResponseError){
        res.status(err.status).json({
            errors: err.message
        }).end()
    } else {
        logger.log({
            level: 'error',
            message: err.stack
        })
        res.status(500).json({
            errors: err.message
        }).end()
    }
}