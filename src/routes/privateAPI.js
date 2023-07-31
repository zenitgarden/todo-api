import express from "express"
import UserController from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import categoryController from "../controllers/categoryController.js";
import todoController from "../controllers/todoController.js";

const privateRouter = express.Router();

privateRouter.use(authMiddleware)

// User Endpoint
privateRouter.get('/api/users/current', UserController.getUser)
privateRouter.patch('/api/users/current', UserController.update)
privateRouter.delete('/api/users/logout', UserController.logout)

// Category Endpoint
privateRouter.post('/api/categories', categoryController.create)
privateRouter.put('/api/categories/:categoryId', categoryController.update)
privateRouter.get('/api/categories/:categoryId', categoryController.getCategory)
privateRouter.get('/api/categories', categoryController.list)
privateRouter.delete('/api/categories/:categoryId', categoryController.remove)

// Todo Endpoint
privateRouter.post('/api/todos', todoController.create)
privateRouter.put('/api/todos/:todoId', todoController.update)
privateRouter.get('/api/todos/:todoId', todoController.getTodo)
privateRouter.get('/api/todos', todoController.list)
privateRouter.delete('/api/todos/:todoId', todoController.remove)



export {
    privateRouter
}
