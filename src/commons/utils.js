import { ResponseError } from "./error/responseError.js"

export const isUsernameUndefined = (username) => {
    if(!username) {
        throw new ResponseError(401, 'Unauthorized')
    }else {
        return username
    }
}