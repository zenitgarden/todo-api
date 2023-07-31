import supertest from "supertest";
import { app } from "../src/application/app";
import { createCategories, createCategory, createUserAndLogin, getCategory, getUserToken, newCategory, removeAllCategories, removeUsers } from "./util-test";

describe('Category API', () => {
    beforeEach(async () => {
        await createUserAndLogin();
    })

    afterEach(async () => {
        await removeAllCategories()
        await removeUsers()
    })

    describe('POST /api/categories', () => {
        it('should be able to create 1 category', async () => {
            const user = await getUserToken()
            const result = await supertest(app).post('/api/categories')
                .set('Authorization', user.token)
                .send({
                    categoryName: ['Belajar']
                })
            expect(result.status).toBe(200)
            expect(result.body.data.length).toBe(1)
        });

        it('should be able to create categories', async () => {
            const user = await getUserToken()
            const result = await supertest(app).post('/api/categories')
                .set('Authorization', user.token)
                .send({
                    categoryName: ['Belajar', 'Jadwal']
                })
            expect(result.status).toBe(200)
            expect(result.body.data.length).toBe(2)
        });

        it('should response 400 if request is invalid', async () => {
            const user = await getUserToken()
            const result = await supertest(app).post('/api/categories')
                .set('Authorization', user.token)
                .send({
                    categoryName: []
                })
            expect(result.status).toBe(400)
        });
        
    });

    describe('PUT /api/categories/:categoryId', () => {
        it('should be able to update category', async () => {
            const categoryName = 'Olahraga'
            const user = await getUserToken()
            const category = await createCategory()
            const result = await supertest(app).put('/api/categories/' + category.id)
                .set('Authorization', user.token)
                .send({ categoryName })

            expect(result.status).toBe(200)
            expect(result.body.data.category.name).toBe(categoryName)
        });

        it('should response 404 if categoryId is not found', async () => {
            const categoryName = 'Olahraga'
            const user = await getUserToken()
            const result = await supertest(app).put('/api/categories/' + 'not_found')
                .set('Authorization', user.token)
                .send({ categoryName })

            expect(result.status).toBe(404)
            expect(result.body.errors).toBeDefined()
        });

        it('should response 400 if request is not valid', async () => {
            const categoryName = 'Olahraga'
            const user = await getUserToken()
            const category = await createCategory()
            const result = await supertest(app).put('/api/categories/' + category.id)
                .set('Authorization', user.token)
                .send({})

            expect(result.status).toBe(400)
            expect(result.body.errors).toBeDefined()
        });
        
    });

    describe('GET /api/categories/:categoryId', () => {

        it('should be able to get category', async () => {
            const user = await getUserToken()
            const category = await createCategory()
            
            const result = await supertest(app).get('/api/categories/' + category.id).set('Authorization', user.token)

            expect(result.status).toBe(200)
            expect(result.body.data.category.name).toBe(newCategory.name)
        });

        it('should response 404 if category is not found', async () => {
            const user = await getUserToken()
            const category = await createCategory()
            
            const result = await supertest(app).get('/api/categories/' + 'not_found').set('Authorization', user.token)
            
            expect(result.status).toBe(404)
            expect(result.body.errors).toBeDefined()
        });
                
    });

    describe('GET /api/categories', () => {
        beforeEach(async () => {
            await createCategories()
        })

        it('should be able to get the list of categories', async () => {
            const user = await getUserToken()
            const result = await supertest(app).get('/api/categories').set('Authorization', user.token)

            expect(result.status).toBe(200)
            expect(result.body.data.categories.length).toBe(10)
        });
        
    });
    
    describe('DELETE /api/categories/:categoryId', () => {

        it('should be able to delete category', async () => {
            const user = await getUserToken()
            const category = await createCategory() 
            const result = await supertest(app).delete('/api/categories/' + category.id).set('Authorization', user.token)

            expect(result.status).toBe(200)
            expect(result.body.success).toBe('OK')

            const countCategory = await getCategory(category.id)
            expect(countCategory).toBe(0)
        });

        it('should response 404 if categoryId is not found', async () => {
            const user = await getUserToken()
            const result = await supertest(app).delete('/api/categories/' + 'not_found').set('Authorization', user.token)
            
            expect(result.status).toBe(404)
            expect(result.body.errors).toBeDefined()
        });
        
    });
    
    
});
