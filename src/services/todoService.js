import { prismaClient } from "../application/database.js"
import { ResponseError } from "../commons/error/responseError.js"
import { createTodoValidation, getTodoValidation, listTodoValidation, updateTodoValidation } from "../commons/validation/todoValidation.js"
import { validate } from "../commons/validation/validation.js"
import { v4 as uuid } from "uuid"

const validateCategoriesOwner = async (username, dataCategories, status, ...args) => {
    const [...categories] = dataCategories
    //isCategoryOwnerEqualToOwner.length will not more than categories.length
    const isCategoryOwnerEqualToOwner = await prismaClient.category.findMany({
        where: {
            id: {
                in: categories.map((category) => category.id)
            },
            owner: username
        },
        select: {
            id: true,
            name: true
        }
    })

    if(isCategoryOwnerEqualToOwner.length !== categories.length){
        // compare => categories = isCategoryOwnerEqualToOwner
        let validCategory = [];
        for (let i = 0; i < categories.length; i++) {
            isCategoryOwnerEqualToOwner.forEach(v => {
              if (v.id === categories[i]?.id) {
                validCategory.push(v.id);
              }
            });
        }
        const invalidRequestCategory = categories.filter(v => !validCategory.includes(v.id)).filter(v => v.id);

        if(invalidRequestCategory.length > 0){
            throw new ResponseError(400, `[${invalidRequestCategory.map(v => `"${v.name}"`)}] ${invalidRequestCategory.length > 1 ? "are" : "is"} not the category that user owned`)
        }
    }
    if(status === 'create'){
        return dataCategories.map((category) => {
            if (!category.id) {
                category.id = `category-${uuid().toString()}`;
            }
            return {
                category: {
                    connectOrCreate: {
                        where: {
                            id: category.id
                        },
                        create: {
                            id: category.id,
                            name: category.name,
                            owner: username
                        }
                    }
                }
            }
        })
    }

    if(status === 'update'){
        const todoInDatabase = mappingTodo(args[0])
        let result = {}
        let idCategories = [];
        let sameCategories = [];
        for (let i = 0; i < dataCategories.length; i++) {
            todoInDatabase.categories.forEach((v) => {
                if (v.id === dataCategories[i]?.id) {
                    idCategories.push(v.id);
                    sameCategories.push(v);
                }
            });
        }

        const shouldUpdate = dataCategories.filter((v) => !idCategories.includes(v.id));
        const shouldDelete = todoInDatabase.categories.filter((v) => !idCategories.includes(v.id));  

        if(shouldUpdate.length > 0) {
            const categories = shouldUpdate.map(category => {
                if (!category.id) {
                    category.id = `category-${uuid().toString()}`;
                }
                category.owner = username
                return {
                    category: {
                        connectOrCreate: {
                            where: {
                                id: category.id
                            },
                            create: {
                                id: category.id,
                                name: category.name,
                                owner: username
                            }
                        }
                    }
                }
            })
            result.create = categories
        }

        if(shouldDelete.length > 0){
            result = {
                ...result,
                deleteMany: {
                    category_id: {
                        in: shouldDelete.map(v => v.id)
                    }
                }
            }
        }
        
        return result
    }
}

const mappingTodo = (todos) => {
    if(todos instanceof Array){
        return todos.map(todo => {
            return {
              ...todo,
              categories: todo.categories.map(c => {
                return {
                  id: c.category.id,
                  name: c.category.name
                }
              }),
            }
        })
    }else {
        return {
            ...todos,
            categories: todos.categories.map(c => {
                return {
                  id: c.category.id,
                  name: c.category.name
                }
            }),
        }
    }
}

// categories is an array of objects
const removeDuplicateCategories = (categories) => {
    return categories.filter((category, index) =>  index === categories.findIndex(otherCategory => otherCategory.id === category.id))
}

const findTodo = async (username, todoId) => {
    return prismaClient.todo.findUnique({
        where: {
            id: todoId,
            owner: username
        },
        select: selectedRow,
    })
}

const selectedRow = {
    id: true,
    title:true,
    description: true,
    created_at: true,
    categories: {
        select: {
            category: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    }
}

const create = async (username, request) => {
    const todo = validate(createTodoValidation, request)
    const data = {
        id: `todo-${uuid().toString()}`,
        title: todo.title,
        description: todo.description,
        owner: username,
    }
    if(todo.categories) {
        let categories = removeDuplicateCategories(todo.categories)
        categories = await validateCategoriesOwner(username, todo.categories, 'create');
        if(categories.length > 0){
            data.categories = {
                create: categories
            }
        }
    }
   
    const result = await prismaClient.todo.create({
        data: data,
        select: selectedRow,
    })
    return mappingTodo(result)
}

const update = async (username, request) => {
    const todo = validate(updateTodoValidation, request)
    const todoInDatabase = await findTodo(username, todo.id)

    if(!todoInDatabase){
        throw new ResponseError(404, 'Todo is not found')
    }
    const data = {
        id: todo.id,
        title: todo.title,
        description: todo.description,
        owner: username,
    }

    if(todo.categories) {
        let categories = removeDuplicateCategories(todo.categories)
        categories = await validateCategoriesOwner(username, todo.categories, 'update', todoInDatabase);
        data.categories = categories
    } else {
        if(todoInDatabase.categories.length > 0){
            data.categories = {
                deleteMany: {}
            }
        }
    }

    const result = await prismaClient.todo.update({
        data: data,
        where: {
            id: data.id,
        },
        select: selectedRow,
    })

    return mappingTodo(result)
}

const getTodo = async (username, todoId) => {
    todoId = validate(getTodoValidation, todoId)
    const todo = await findTodo(username, todoId)

    if(!todo){
        throw new ResponseError(404, 'Todo is not found')
    }

    return mappingTodo(todo)
}

const list = async (username, request) => {
    request = validate(listTodoValidation, request)
    const filters = [] 
    filters.push({
        owner: username,
    })
    if(request.search){
        filters.push({
            OR: [
                {
                    title: {
                        contains: request.search
                    }
                },
                {
                    description: {
                        contains: request.search
                    }
                },
            ]
        })
    }

    if(request.category){
        const categories = {
            categories: {
                some: {
                    category: {
                        name: request.category
                    }
                }
            }
        }
        if(typeof request.category === 'string'){
            filters.push(categories)
        } else {
            categories.categories.some.category.name = {
                in: request.category
            }
            filters.push(categories)
        }
    }
    const result = await prismaClient.todo.findMany({
        where: {
            AND: filters
        },
        select: selectedRow
    })

    return mappingTodo(result);
}


const remove = async (username, todoId) => {
    todoId = validate(getTodoValidation, todoId)
    const todo = await prismaClient.todo.findUnique({
        where: { id: todoId, owner: username },
        select: { id: true }
    })
    if(!todo){
        throw new ResponseError(404, 'Todo is not found')
    }

    await prismaClient.todo.delete({ where: { id: todoId, owner: username }})
}

export default {
    create,
    update,
    getTodo,
    list,
    remove
}