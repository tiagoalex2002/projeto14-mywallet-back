import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"
import userRouter from "./routes/user.routes.js"
import transactionsRouter from "./routes/transactions.routes.js"

//API's structure configurations
const app = express()
app.use(cors())
app.use(express.json())
dotenv.config()
app.use(userRouter)
app.use(transactionsRouter)

//Mongo Database configurantions and setup
const mongoclient = new MongoClient(process.env.DATABASE_URL)
try {
    await mongoclient.connect()
    console.log("MongoDB conectado")
} catch (err) {
    console.log(err.messages)
}

export const db = mongoclient.db()

app.listen(process.env.PORT, () => console.log("Servidor rodando no port" + process.env.PORT))