import { isUsernameUndefined } from "../commons/utils.js"
import categoryService from "../services/categoryService.js"

const create = async (req, res, next) => {
   try {
        const username = isUsernameUndefined(req.user?.username)
        const result = await categoryService.create(username, req.body)
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
        req.body.id = req.params.categoryId
        const result = await categoryService.update(username, req.body)
        res.status(200).json({
            data: {
                category: result
            }
        })
    } catch (error) {
        next(error)
    }
}

const getCategory = async (req, res, next) => {
    try {
        const username = isUsernameUndefined(req.user?.username)
        const result = await categoryService.getCategory(username, req.params.categoryId)
        res.status(200).json({
            data: {
                category: result
            }
        })
    } catch (error) {
        next(error)
    }
}

const list = async (req, res, next) => {
    try {
        const username = isUsernameUndefined(req.user?.username)
        const result = await categoryService.list(username)
        res.status(200).json({
            data: {
                categories: result
            }
        })
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        const username = isUsernameUndefined(req.user?.username)
        const categoryId = req.params.categoryId
        await categoryService.remove(username, categoryId)
        res.status(200).json({
            success: 'OK'
        })
    } catch (error) {
        next(error)
    }
}

export default {
    create,
    update,
    getCategory,
    list,
    remove
}