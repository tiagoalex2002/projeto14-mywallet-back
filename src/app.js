import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"
import dayjs from "dayjs"
import joi from "joi"
import bcrypt from "bcrypt"
import { v4 as uuid } from 'uuid';


//API's structure configurations
const app= express()
app.use(cors())
app.use(express.json())
dotenv.config()

//Mongo Database configurantions and setup
let db
const mongoclient= new MongoClient(process.env.DATABASE_URL)
mongoclient.connect().then(()=> db=mongoclient.db())
mongoclient.connect().catch((er)=>console.log(er.message))


//Cadastro
app.post("/cadastro", async (req,res) => {
    const {name,email,password}= req.body
    
    signupSchema=joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.number().min(3).required()
    })

    const validation= signupSchema.validate(req.body);
    if(validation.error){
        return res.status(422).send("Algum campo está inválido, por favor, insira novamente")
    }

    const cryptpassword= bcrypt.hashSync(password,10)

    try{
        let cadastro= await db.collection("users").findOne({name: name})
        if(cadastro){
            return res.status(409).send("Usuário já cadastrado")
        }
    }catch(err){
        console.log(err.message)
    }

    try{
        await db.collection("users").insertOne({name: name, email: email, password: cryptpassword})
        return res.sendStatus(201)
    }catch(err){
        console.log(err.message)
    }
})

//Login
app.post("/", async (req,res) => {
    const {email, password} = req.body;
    const loginSchema= joi.object({
        email: joi.string().required(),
        password: joi.number().required()
    })

    const validation= loginSchema.validate(req.body);
    if(validation.error){
        return res.sendStatus(422)
    }
    
    try{
        let user= await db.collection("users").findOne({email:email})
        if (!user){
            return res.sendStatus(404)
        }
        else if(bcrypt.compareSync(password, user.password)){
            const token = uuid();
            await db.collection("sessions").insertOne({userId: user._id,token})
            return res.status(200).send(token)
        }
        else{
            return res.sendStatus(401)
        }
    }catch(err){
        console.log(err.message)
    }
})




app.listen(5000, () => console.log("Servidor rodando"))