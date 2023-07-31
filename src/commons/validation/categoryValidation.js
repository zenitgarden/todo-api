import Joi from "joi";

const createCategoryValidation = Joi.object({
    categoryName: Joi.array().min(1).required().items(Joi.string().max(50))
})

const updateCategoryValidation = Joi.object({
    id: Joi.string().max(100).required(),
    categoryName: Joi.string().max(50).required()
})

const getCategoryValidation = Joi.string().max(100).required()


export {
    createCategoryValidation,
    updateCategoryValidation,
    getCategoryValidation
}
