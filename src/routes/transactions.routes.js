import { getOperations } from "./Controllers/transactionControllers.js"
import { addOperation } from "./Controllers/transactionControllers.js"
import { Router } from "express"

const transactionsRouter = Router()

//Operações
transactionsRouter.post("/nova-transacao/:tipo", addOperation)

//Listagem de Operações
transactionsRouter.get("/home", getOperations)

export default transactionsRouter;