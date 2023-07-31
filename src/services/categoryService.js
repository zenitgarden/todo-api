import { prismaClient } from "../application/database.js";
import { ResponseError } from "../commons/error/responseError.js";
import { createCategoryValidation, getCategoryValidation, updateCategoryValidation } from "../commons/validation/categoryValidation.js";
import { validate } from "../commons/validation/validation.js";
import { v4 as uuid } from "uuid"

const create = async (username, request) => {
    const { categoryName } = validate(createCategoryValidation, request)
    const categories = categoryName.map(value => { return { id: `category-${uuid().toString()}`, name: value , owner: username} })
    await prismaClient.category.createMany({ data: categories })
    return prismaClient.category.findMany({
        where: {
            id: {
                in: categories.map((value) => value.id)
            }
        },
        select: {
            id: true,
            name: true
        }
    })
}

const update = async (username, request) => {
    const { id, categoryName } = validate(updateCategoryValidation, request)
    const countCategory = await prismaClient.category.count({
        where: {
            owner: username,
            id: id,
        }
    }) 
    if(countCategory !== 1){
        throw new ResponseError(404, 'Category is not found')
    }
    return prismaClient.category.update({
        data: {
            name: categoryName
        },
        where: {
            owner: username,
            id: id
        },
        select: {
            id: true,
            name: true,
        }
    })

}

const getCategory = async (username, categoryId) => {
    categoryId = validate(getCategoryValidation, categoryId)
    const category = await prismaClient.category.findUnique({
        where: {
            owner: username,
            id: categoryId
        },
        select: {
            id: true,
            name: true
        }
    })
    
    if(!category){
        throw new ResponseError(404, 'Category is not found')
    }

    return category
}

const list = async (username) => {
    return prismaClient.category.findMany({
        where: {
            owner: username
        },
        select: {
            id: true,
            name: true
        }
    })
}

const remove = async (username, categoryId) => {
    categoryId = validate(getCategoryValidation, categoryId)

    const category = await prismaClient.category.findUnique({
        where: {
            owner: username,
            id: categoryId
        },
        select: {
            id: true,
            name: true
        }
    })
    
    if(!category){
        throw new ResponseError(404, 'Category is not found')
    }
    
    await prismaClient.category.delete({ where: { owner: username, id: categoryId } })
}

export default {
    create,
    update,
    getCategory,
    list,
    remove
}