import { request } from "express"
import { isUsernameUndefined } from "../commons/utils.js"
import todoService from "../services/todoService.js"

const create = async (req, res, next) => {
    try {
        const username = isUsernameUndefined(req.user?.username)
        const result = await todoService.create(username, req.body)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const username = isUsernameUndefined(req.user?.username)
        req.body.id = req.params.todoId
        const result = await todoService.update(username, req.body)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const getTodo = async (req, res, next) => {
    try {
        const username = isUsernameUndefined(req.user?.username)
        const result = await todoService.getTodo(username, req.params.todoId)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const list = async (req, res, next) => {
    try {
        const username = isUsernameUndefined(req.user?.username)
        const request = {
            search: req.query.search,
            category: req.query.category,
            page: req.query.page,
            size: req.query.size,
        }
        const result = await todoService.list(username, request)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        const username = isUsernameUndefined(req.user?.username)
        await todoService.remove(username, req.params.todoId)
        res.status(200).json({
            success: "OK"
        })
    } catch (error) {
        next(error)
    }
}

export default {
    create,
    update,
    getTodo,
    list,
    remove
}