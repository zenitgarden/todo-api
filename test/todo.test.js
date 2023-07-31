import supertest from "supertest";
import { app } from "../src/application/app";
import { assignCategoriesOnTodo, createCategory, createCustomCategory, createCustomUser, createTodo, createTodos, createUserAndLogin, getCategoriesOnTodos, getTodo, getTodos, getUserToken, login, newTodo, removeAllCategories, removeTodos, removeUsers } from "./util-test";

describe('Todo API', () => {
    beforeEach(async () => {
        await createUserAndLogin();
    })

    afterEach(async () => {
        await removeAllCategories()
        await removeTodos()
        await removeUsers()
    })

    describe('POST /api/todos', () => {

        it('should be able to create todo', async () => {
            const user = await getUserToken()
            const category = await createCategory()
            const categories = [
                {
                    id: category.id,
                    name: category.name
                },
                {
                    name: "Bermain"
                }
            ]

            const result = await supertest(app).post('/api/todos')
            .set('Authorization', user.token)
            .send({
                title: newTodo.title,
                description: newTodo.description,
                categories,
            }) 
            const todo = await getTodo()
            expect(result.status).toBe(200)
            expect(result.body.data).toStrictEqual(JSON.parse(todo))
        });

        it('should return response 400 if request is invalid', async () => {
            const user = await getUserToken()
            const result = await supertest(app).post('/api/todos')
            .set('Authorization', user.token)
            .send({
                categories: []
            })
            expect(result.status).toBe(400)
            expect(result.body.errors).toBeDefined()
        });

        it('should return response 400 if request.categories is not owned by user', async () => {
            const user = await getUserToken()

            const user2 = await createCustomUser()
            const user2category1 = await createCustomCategory('Jadwal Penting',user2.username)
            const user2category2 = await createCustomCategory('Main Jalangkung',user2.username)

            const categories = [
                {
                    id: user2category1.id,
                    name: user2category1.name
                },
                {
                    id: user2category2.id,
                    name: user2category2.name
                },
                {
                    name: "Bermain"
                }
            ]

            const result = await supertest(app).post('/api/todos')
            .set('Authorization', user.token)
            .send({
                title: newTodo.title,
                description: newTodo.description,
                categories,
            })

            expect(result.status).toBe(400)
            expect(result.body.errors).toBeDefined()
        });
        
        
    });

    describe('PUT /api/todos/:todoId', () => {
        it('should be able to update todo', async () => {
            const user = await getUserToken()
            const data = {
                owner: user.username,
                title: 'test todo title 1 updated',
                description: 'test todo description 1 updated',
                // without categories
            }
            const category = await createCategory()
            const todo = await createTodo(data)
            const result = await supertest(app).put('/api/todos/' + todo.id)
                .set('Authorization', user.token)
                .send({
                    title: 'test todo title 1 updated',
                    description: 'test todo description 1 updated',
                    categories: [
                        {
                            name: 'Homework'
                        },
                        {
                            id: category.id,
                            name: category.name
                        },
                    ]
                })
            
            const expectedResult = await getTodo(data.title)
            expect(result.status).toBe(200)
            expect(result.body.data).toStrictEqual(JSON.parse(expectedResult))
        });

        it('should be able to update todo 2', async () => {
            const user = await getUserToken()
            const data = {
                owner: user.username,
                title: 'test todo title 1 updated',
                description: 'test todo description 1 updated',
                // with categories
                categories: [
                    {
                        name: 'Homework'
                    },
                ]
            }
            const category = await createCategory()
            const todo = await createTodo(data)
            const result = await supertest(app).put('/api/todos/' + todo.id)
                .set('Authorization', user.token)
                .send({
                    title: 'test todo title 1 updated',
                    description: 'test todo description 1 updated',
                    categories: [
                        {
                            id: category.id,
                            name: category.name
                        },
                        {
                            id: todo.categories[0].id,
                            name: todo.categories[0].name
                        },
                    ]
                })

            const expectedResult = await getTodo(data.title)
            expect(result.status).toBe(200)
            expect(result.body.data).toStrictEqual(JSON.parse(expectedResult))
            expect(todo).not.toEqual(expectedResult)
        });

        it('should return response 400 if request is invalid', async () => {
            const user = await getUserToken()
            const data = {
                owner: user.username,
                title: 'test todo title 1 updated',
                description: 'test todo description 1 updated',
                // without categories
            }
            const todo = await createTodo(data)
            const result = await supertest(app).put('/api/todos/' + todo.id)
                .set('Authorization', user.token)
                .send({
                    title: 'test todo title 1 updated',
                    categories: []
                })
            expect(result.status).toBe(400)
            expect(result.body.errors).toBeDefined()
        });
        
        it('should return response 400 if request.categories is not owned by user', async () => {
            const user = await getUserToken()
            const data = {
                owner: user.username,
                title: 'test todo title 1 updated',
                description: 'test todo description 1 updated',
                // without categories
            }

            const user2 = await createCustomUser()
            const user2category1 = await createCustomCategory('Jadwal Penting',user2.username)
            const user2category2 = await createCustomCategory('Main Jalangkung',user2.username)

            const categories = [
                {
                    id: user2category1.id,
                    name: user2category1.name
                },
                {
                    id: user2category2.id,
                    name: user2category2.name
                },
                {
                    name: "Bermain"
                }
            ]
            const todo = await createTodo(data)
            const result = await supertest(app).put('/api/todos/' + todo.id)
                .set('Authorization', user.token)
                .send({
                    title: 'test todo title 1 updated',
                    description: 'test todo description 1 updated',
                    categories,
                })
            
            expect(result.status).toBe(400)
            expect(result.body.errors).toBeDefined()
        });

        
    });

    describe('GET /api/todos/:todoId', () => {
        it('should be able to get todo', async () => {
            const user = await getUserToken()
            const data = {
                owner: user.username,
                title: 'test todo title 1 updated',
                description: 'test todo description 1 updated',
                categories: [
                    {
                        id: 'test-1',
                        name: 'Halo dunia'
                    },
                    {
                        id: 'test-2',
                        name: "Jadwal Main"
                    }
                ]
            }
            const todo = await createTodo(data)
            const result = await supertest(app).get('/api/todos/' + todo.id).set('Authorization', user.token)

            const expectedResult = await getTodo(data.title)
            expect(result.status).toBe(200)
            expect(result.body.data).toStrictEqual(JSON.parse(expectedResult))
        });

        it('should return response 404 if todo is not found', async () => {
            const user = await getUserToken()
            const result = await supertest(app).get('/api/todos/' + 'not_found').set('Authorization', user.token)

            expect(result.status).toBe(404)
            expect(result.body.errors).toBeDefined()
        });

        it('should return response 404 if todo is not owned by actual user', async () => {
            const user = await getUserToken()
            const data = {
                owner: user.username,
                title: 'test todo title 1 updated',
                description: 'test todo description 1 updated',
                categories: [
                    {
                        id: 'test-1',
                        name: 'Halo dunia'
                    },
                    {
                        id: 'test-2',
                        name: "Jadwal Main"
                    }
                ]
            }
            // create todo
            const todo = await createTodo(data)
            // create user2
            let user2 = await createCustomUser()
            // login as user2
            await login(user2.username, 'test_token02')
            // get user2 token
            user2= await getUserToken(user2.username)
            const result = await supertest(app).get('/api/todos/' + todo.id).set('Authorization', user2.token)
            
            expect(result.status).toBe(404)
            expect(result.body.errors).toBeDefined()
        });
        
    });

    describe('GET /api/todos', () => {
        beforeEach(async () => {
            await createTodos()
            await assignCategoriesOnTodo()
        })

        it('should be able to get the list of todos without query params', async () => {
            const user = await getUserToken()
            const result = await supertest(app).get('/api/todos').set('Authorization', user.token)

            expect(result.status).toBe(200)
            expect(result.body.data.length).toBe(3)
        });

        it('should be able to get the list of todos with query params', async () => {
            const user = await getUserToken()
            const result = await supertest(app).get('/api/todos').set('Authorization', user.token)
                .query({
                    category: ['test_name_3', 'test_name_2'],
        
                })
            
            expect(result.status).toBe(200)
            expect(result.body.data.length).toBe(1)
        });

        it('should response empty array if todo is not found', async () => {
            const user = await getUserToken()
            const result = await supertest(app).get('/api/todos').set('Authorization', user.token)
                .query({
                    search: 'coy',
                    category: ['test_name_1'],
        
                })

            expect(result.status).toBe(200)
            expect(result.body.data.length).toBe(0)
        });
        
    });
    
    describe('DELETE /api/todos/:todoId', () => {
        beforeEach(async () => {
            await createTodos()
            await assignCategoriesOnTodo()
        })

        it('should be able to delete todo', async () => {
            const user = await getUserToken()
            let todos = await getTodos()
            const result = await supertest(app).delete('/api/todos/' + 'todo-id-1').set('Authorization', user.token)

            expect(result.status).toBe(200)
            expect(result.body.success).toBe('OK')
            todos = await getTodos()
            expect(todos.length).toBe(2)

            const categoriesOnTodo = await getCategoriesOnTodos()
            expect(categoriesOnTodo).toBe(0)

            
        });

        it('should be able to delete todo', async () => {
            const user = await getUserToken()
            const result = await supertest(app).delete('/api/todos/' + 'not_found').set('Authorization', user.token)

            expect(result.status).toBe(404)
            expect(result.body.errors).toBeDefined()
        });
        
    });
    
});
