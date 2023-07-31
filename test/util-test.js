import { prismaClient } from "../src/application/database"
import bcrypt from "bcrypt"
import {v4 as uuid} from 'uuid'

// User API - utilities
export const newUser = {
    username: 'john',
    password: 'john123',
    name: 'Bang John'
}

export const loginRequest = {
    username: newUser.username,
    password: newUser.password
}

export const userData = {
    username: newUser.username,
    name: newUser.name
}

export const newCategory = {
    id: 'test_id',
    name: 'test_name',
    owner: newUser.username
}

export const newTodo = {
    title: 'test_todo_title',
    description: 'test_todo_description',
}

export const removeUsers = async () => {
    await prismaClient.user.deleteMany({});
}

export const createUser = async () => {
    const { password: rawPassword, ...data } = newUser
    const password = await bcrypt.hash(rawPassword, 10);
    await prismaClient.user.create({ data: { ...data, password }  })
}

export const getUserToken = async (username = loginRequest.username) => {
     return prismaClient.user.findUnique({ where: { username: username }, select: { token: true, username: true}})
}

export const login = async (username = userData.username, token = 'test_token') => {
    await prismaClient.user.update({ data: { token: token }, where: { username: username }})
}

export const createUserAndLogin = async () => {
    await createUser()
    await login()
}

export const removeAllCategories = async () => {
    await prismaClient.category.deleteMany({})
}

export const createCategory = async () => {
    return prismaClient.category.create({
        data: newCategory,
        select: { id: true, name: true}
    })
}

export const getCategory = async (id) => {
    return prismaClient.category.count({
        where: {
            id
        },
    })
}

export const createCategories = async (number = 10) => {
    let data = []
    for(let i = 1; i <= number; i++){
        data.push({
            id: `test_id_${i}`,
            name: `test_name_${i}`,
            owner: newUser.username
        })
    }
    await prismaClient.category.createMany({
        data: data
    })
}

// parameter categories do not need {id}
export const createTodo = async ({owner, title, description, categories}) => {
    const data = {
        id: 'todo-test-id',
        owner,
        title,
        description,
    }
    if(categories){
        if(categories instanceof Array){
            data.categories = {
                create: categories.map(category => {
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
                                    owner: owner
                                }
                            }
                        }
                    }
                })
            }
        }
    }
    const todo = await prismaClient.todo.create({
        data: data,
        select: {
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
    })

    return {
        ...todo,
        categories: todo.categories.map(v => {
            return {
                id: v.category.id,
                name: v.category.name
            }
        })
    }
}

export const removeTodos = async () => {
    await prismaClient.todo.deleteMany({})
}

export const getTodo = async (title = newTodo.title) => {
    const todo =  await prismaClient.todo.findFirst({
        where:{
            title: title
        },
        select: {
            id: true,
            title: true,
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
    })
    
    return JSON.stringify({
        ...todo,
        categories: todo.categories.map(v => {
            return {
                id: v.category.id,
                name: v.category.name
            }
        })
    })
}

export const createCustomUser = async (username = 'udin', password = 'udin123', name = 'Bang Udin') => {
    const data = {
        username,
        name,
        password: await bcrypt.hash(password, 10),
    }
    return prismaClient.user.create({ data: data, select: { username: true}  })
}

export const createCustomCategory = async (name, owner) => {
    const data = {
        id: `category-${uuid().toString()}`,
        name: name,
        owner: owner
    }
    return prismaClient.category.create({ data: data, select: { id: true, name: true}  })
}

export const createTodos = async (number = 3) => {
    let data = []
    for(let i = 1; i <= number; i++){
        data.push({
            id: `todo-id-${i}`,
            title: `todo-title-${i}`,
            description: `todo-description-${i}`,
            owner: newUser.username,
        })
    }
    await prismaClient.todo.createMany({
        data: data
    })
}

export const assignCategoriesOnTodo = async () => {
    await createCategories(3);

    await prismaClient.categoriesOnTodos.createMany({
        data: [
            {
                todo_id: 'todo-id-1',
                category_id: 'test_id_1'
            },
            {
                todo_id: 'todo-id-2',
                category_id: 'test_id_1'
            },
            {
                todo_id: 'todo-id-3',
                category_id: 'test_id_3'
            },
            {
                todo_id: 'todo-id-3',
                category_id: 'test_id_2'
            },
        ]
    })
}

export const getTodos = async () => {
    return prismaClient.todo.findMany({ where: { owner: newUser.username } })
}
