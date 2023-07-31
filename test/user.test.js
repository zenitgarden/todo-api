import supertest from "supertest";
import { app } from "../src/application/app.js";
import { createUser, getUserToken, newUser, removeUsers, loginRequest, userData, createUserAndLogin } from "./util-test.js";

describe('User API', () => {

    afterEach( async () => {
        await removeUsers();
    })

    describe('POST /api/users/', () => {
        it('should be able to create new user', async() => {
            const expectedBodyResponse = {
                data: {
                    username: newUser.username,
                    name: newUser.name,
                }
            }
            
            const result = await supertest(app).post('/api/users').send(newUser)
            expect(result.status).toBe(200);
            expect(result.body).toStrictEqual(expectedBodyResponse)
        });

        it('should return status code 400 if username is already exist', async() => {
            // create new user
            await createUser();

            const result = await supertest(app).post('/api/users').send(newUser)
            expect(result.status).toBe(400);
            expect(result.body.errors).toBeDefined();
        });

        it('should return status code 400 if payload is invalid', async() => {
            const result = await supertest(app).post('/api/users').send({})
            console.log(result.body)
            expect(result.status).toBe(400);
            expect(result.body.errors).toBeDefined();
        });
        
    });

    describe('POST /api/users/login', () => {

        it('should be able to login', async () => {
            // create new user
            await createUser()

            const result = await supertest(app).post('/api/users/login').send(loginRequest)
            const user = await getUserToken()
            expect(result.status).toBe(200)
            expect(result.body.data.token).toBe(user.token)
        });

        it('should return status code 401 if user is not created and username is invalid', async () => {
            const result = await supertest(app).post('/api/users/login').send({
                username: 'cokro',
                password: loginRequest.password
            })
            expect(result.status).toBe(401)
            expect(result.body.errors).toBeDefined()
        });

        it('should return status code 401 if user is not created password is invalid', async () => {
            const result = await supertest(app).post('/api/users/login').send({
                username: loginRequest.username,
                password: 'mikro'
            })
            expect(result.status).toBe(401)
            expect(result.body.errors).toBeDefined()
        });

        it('should return status code 401 if user has been created and username is invalid', async () => {
            // create new user
            await createUser()

            const result = await supertest(app).post('/api/users/login').send({
                username: 'cokro',
                password: loginRequest.password
            })
            expect(result.status).toBe(401)
            expect(result.body.errors).toBeDefined()
        });

        it('should return status code 401 if user has been created and password is invalid', async () => {
            // create new user
            await createUser()
            
            const result = await supertest(app).post('/api/users/login').send({
                username: loginRequest.username,
                password: 'mikro'
            })
            expect(result.status).toBe(401)
            expect(result.body.errors).toBeDefined()
        });

        it('should return status code 400 if request is invalid', async () => {
            const result = await supertest(app).post('/api/users/login').send( {})
            expect(result.status).toBe(400)
            expect(result.body.errors).toBeDefined()
        });
        
    });

    describe('GET /api/users/current', () => {

        it('should be able get current user data', async () => {
            // create new user & login
            await createUserAndLogin()
            // get user token
            const user = await getUserToken()
            const result = await supertest(app).get('/api/users/current').set('Authorization', user.token)

            expect(result.status).toBe(200)
            expect(result.body.data).toStrictEqual(userData)
        });

        it('should response 401 if token is not valid', async () => {
            // create new user & login
            await createUserAndLogin()
            const result = await supertest(app).get('/api/users/current').set('Authorization', 'invalid')

            expect(result.status).toBe(401)
            expect(result.body.errors).toBe('Unauthorized')
        });

        it('should response 401 if user not login', async () => {
            const result = await supertest(app).get('/api/users/current')

            expect(result.status).toBe(401)
            expect(result.body.errors).toBe('Unauthorized')
        });
        
    });
    
    describe('PATCH /api/users/current', () => {
        it('should be able to update user data', async () => {
            // create new user & login
            await createUserAndLogin()
            // get user token
            const user = await getUserToken()

            const result = await supertest(app).patch('/api/users/current')
                .set('Authorization', user.token)
                .send({
                    name: 'Bang Jack',
                    password: 'jack123'
                })

            expect(result.status).toBe(200)
            expect(result.body.data).toStrictEqual({
                username: newUser.username,
                name: 'Bang Jack'
            })
        });

        it('should response 401 if user is not login', async () => {
            const result = await supertest(app).patch('/api/users/current')
                .set('Authorization', 'not_login')
                .send({
                    name: 'Bang Jack',
                    password: 'jack123'
                })

            expect(result.status).toBe(401)
            expect(result.body.errors).toBeDefined()
        });
        
        it('should be able to update name only', async () => {
            // create new user & login
            await createUserAndLogin()
            // get user token
            const user = await getUserToken()

            const result = await supertest(app).patch('/api/users/current')
                .set('Authorization', user.token)
                .send({
                    name: 'Bang Jack',
                })

            expect(result.status).toBe(200)
            expect(result.body.data).toStrictEqual({
                username: newUser.username,
                name: 'Bang Jack'
            })
        });

        it('should be able to update password only', async () => {
            // create new user & login
            await createUserAndLogin()
            // get user token
            const user = await getUserToken()

            const result = await supertest(app).patch('/api/users/current')
                .set('Authorization', user.token)
                .send({
                    password: '123',
                })

            expect(result.status).toBe(200)
            expect(result.body.data).toStrictEqual({
                username: newUser.username,
                name: newUser.name
            })
        });

        it('should return status code 400 if request is invalid', async () => {
            // create new user & login
            await createUserAndLogin()
            // get user token
            const user = await getUserToken()

            const result = await supertest(app).patch('/api/users/current')
                .set('Authorization', user.token)
                .send({
                    name: 123
                })
            console.log(result.body)
            expect(result.status).toBe(400)
            expect(result.body.errors).toBeDefined()
        });

    });

    describe('DELETE /api/users/logout', () => {
        it('should be able to logout', async() => {
            // create new user & login
            await createUserAndLogin()
            // get user token
            let user = await getUserToken()
            const result = await supertest(app).delete('/api/users/logout').set('Authorization', user.token)
            
            expect(result.status).toBe(200)
            expect(result.body).toStrictEqual({ success: 'OK'})
            user = await getUserToken()
            expect(user.token).toBeNull()
        });

        it('should response 401 if user is not login OR not valid token', async() => {
            const result = await supertest(app).delete('/api/users/logout').set('Authorization', 'not_login_or_invalid')
            
            expect(result.status).toBe(401)
            expect(result.body.errors).toBeDefined()
        });
        
    });
    
    
    
});

