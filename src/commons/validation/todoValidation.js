import Joi from "joi"

const createTodoValidation = Joi.object({
    title: Joi.string().max(100).required(),
    description: Joi.string().required(),
    categories: Joi.array().min(1).items(Joi.object({
        id: Joi.string().max(100).optional(),
        name: Joi.string().max(100).required(),
    }).required())
})

const updateTodoValidation = Joi.object({
    id: Joi.string().max(100).required(),
    title: Joi.string().max(100).required(),
    description: Joi.string().required(),
    categories: Joi.array().min(1).items(Joi.object({
        id: Joi.string().max(100).optional(),
        name: Joi.string().max(100).required(),
    }).required())
})

const getTodoValidation = Joi.string().max(100).required()

const listTodoValidation = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().positive().max(100).default(8),
    search: Joi.string().max(100).optional(),
    category: [Joi.string(), Joi.array()]
})

export {
    createTodoValidation,
    updateTodoValidation,
    getTodoValidation,
    listTodoValidation,
}