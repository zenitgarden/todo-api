import { prismaClient } from "../application/database.js"
import { ResponseError } from "../commons/error/responseError.js"
import { LoginUserValidation, registerUserValidation, updateUserValidation, usernameValidation } from "../commons/validation/userValidation.js"
import { validate } from "../commons/validation/validation.js"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"


const register = async (request) => {
    const user = validate(registerUserValidation, request)

    const countUser = await prismaClient.user.count({ where: { username: user.username }})

    if(countUser === 1) throw new ResponseError(400, 'Username already exist') 

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({ data: user, select: { username: true, name: true }})  
}

const login = async (request) => {
    const loginRequest = validate(LoginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username,
        },
        select: {
            username: true,
            password: true
        }
    })
    if(!user){
        throw new ResponseError(401, 'Username or Password wrong')
    } else {
        const isValidPassword = await bcrypt.compare(loginRequest.password, user.password)
        if(!isValidPassword){
            throw new ResponseError(401, 'Username or Password wrong')
        }

        const token = uuid().toString();

        return prismaClient.user.update({ data: { token: token }, where: { username: user.username }, select: { token: true }})
    }
}

const getUser = async (username) => {
    username = validate(usernameValidation, username)
    return prismaClient.user.findUnique({ where: { username: username }, select: { username: true, name: true}})
}

const update = async (request) => {
    const user = validate(updateUserValidation, request)
    const data = {}
    if(user.password){
        data.password = await bcrypt.hash(user.password, 10);
    }
    if(user.name){
        data.name = user.name
    }
    return prismaClient.user.update({
        data: data,
        where: { username: user.username },
        select: { username: true, name: true}
    })
}

const logout = async (username) => {
    username = validate(usernameValidation, username)
    await prismaClient.user.update({ data: { token: null},where: { username: username }})
}

export default{
    register,
    login,
    getUser,
    update,
    logout
}
