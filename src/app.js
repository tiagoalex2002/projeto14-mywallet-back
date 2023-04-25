import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"
import dayjs from "dayjs"
import joi from "joi"
import bcrypt from "bcrypt"
import { v4 as uuid } from 'uuid';
import { register, login } from "../controllers/userController.js"
import { addOperations , getOperations} from "../controllers/transactionController.js"


//API's structure configurations
const app= express()
app.use(cors())
app.use(express.json())
dotenv.config()

//Mongo Database configurantions and setup
const mongoclient= new MongoClient(process.env.DATABASE_URL)
try{
    await mongoclient.connect()
    console.log("MongoDb conectado")
} catch (err){
    console.log(err.message)
}

export const db= mongoclient.db()


//Cadastro
app.post("/cadastro", register)

//Login
app.post("/", login)

//Operações
app.post("/nova-transacao/:tipo", addOperations )

//Listagem de Operações
app.get("/home", getOperations)




app.listen(5000, () => console.log("Servidor rodando"))