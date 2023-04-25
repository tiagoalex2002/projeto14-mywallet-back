import { register, login, logout } from "../Controllers/userController.js"
import { Router } from "express"
import validateSchema from "../Middleware/validateSchema.js"
import loginSchema from "../schemas/loginSchema.js"
import signupSchema from "../schemas/signupSchema.js"
import { authValidation } from "../Middleware/authentication.js"
const userRouter = Router()

//Cadastro
userRouter.post("/cadastro", validateSchema(signupSchema), register)

//Login
userRouter.post("/", validateSchema(loginSchema), login)

//Logout
userRouter.delete("/", authValidation, logout)

export default userRouter;