import { register, login } from "./Controllers/userControllers.js"
import { Router } from "express"

const userRouter = Router()

//Cadastro
userRouter.post("/cadastro", register)

//Login
userRouter.post("/", login)

export default userRouter;