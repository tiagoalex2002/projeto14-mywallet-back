import { getOperations } from "../Controllers/transactionController.js"
import { addOperation } from "../Controllers/transactionController.js"
import { Router } from "express"
import validateSchema from "../Middleware/validateSchema.js"
import transactionSchema from "../schemas/transactionSchema.js"
import { authValidation } from "../Middleware/authentication.js"

const transactionsRouter = Router()

//Operações
transactionsRouter.post("/nova-transacao/:tipo", authValidation, validateSchema(transactionSchema), addOperation)

//Listagem de Operações
transactionsRouter.get("/home", authValidation, getOperations)

export default transactionsRouter;