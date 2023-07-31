import { isUsernameUndefined } from "../commons/utils.js"
import UserService from "../services/userService.js"

const register = async (req, res, next) => {
    try {
        const result = await UserService.register(req.body)
        res.status(200).json({ data: result })
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const result = await UserService.login(req.body)
        res.status(200).json({ data: result })
    } catch (error) {
        next(error)
    }
}

const getUser = async (req, res, next) => {
    try {
        const username = isUsernameUndefined(req.user?.username)
        const result = await UserService.getUser(username)
        res.status(200).json({ data: result })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const request = req.body
        const username = isUsernameUndefined(req.user?.username)
        request.username = username
        const result = await UserService.update(request)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const logout = async (req, res, next) => {
    try {
        const username = isUsernameUndefined(req.user?.username)
        const result = await UserService.logout(username)
        res.status(200).json({ success: 'OK' })
    } catch (error) {
        next(error)
    }
}

export default{
    register,
    login,
    getUser,
    update,
    logout
}
