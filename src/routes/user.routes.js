import { register, login } from "./Controllers/userControllers.js"
import { Router } from "express"
import validateSchema from "../Middleware/validateSchema.js"
import loginSchema from "../schemas/loginSchema.js"
import signupSchema from "../schemas/signupSchema.js"
const userRouter = Router()

//Cadastro
userRouter.post("/cadastro", validateSchema(signupSchema), register)

//Login
userRouter.post("/", validateSchema(loginSchema), login)

export default userRouter;