import express from "express"
import UserController from "../controllers/userController.js";

const publicRouter = express.Router();

publicRouter.post('/api/users', UserController.register)
publicRouter.post('/api/users/login', UserController.login)

export {
    publicRouter
}

