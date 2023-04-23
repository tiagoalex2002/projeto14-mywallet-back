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

//Operações
app.post("/nova-transacao/:tipo", async (req, res) => {
    const {valor, description}= req.body;
    const {tipo}= req.params;
    const { authorization } = req.header;
    const token = authorization?.replace('Bearer ', '');
    let date= dayjs()

    if (!token){
        return res.sendStatus(401)
    }

    const transactionSchema= joi.object({
        valor: joi.float().required(),
        description: joi.string().required()
    })

    const validation= transactionSchema.validate(req.body);
    if(validation.error){
        return res.sendStatus(422)
    }

    const session = await db.collection("sessions").findOne({ token });
    if (!session) return res.sendStatus(401);
  
      const user = await db.collection("users").findOne({ 
          _id: session.userId 
      })

    if(user){
        if(tipo == "entrada"){
            try{
                await db.collection("entrance").insertOne({valor: valor, description: description, date: date.format("DD/MM"), time: Date.now(), identificacao: 1})
                return res.sendStatus(200)
            }catch(err){
                console.log(err.message)
            }
        }
        else if(tipo == "saida"){
            try{
                await db.collection("exits").insertOne({valor: valor, description: description,  date: date.format("DD/MM"), time: Date.now(), identificacao: 0})
                return res.sendStatus(200)
            }catch(err){
                console.log(err.message)
            }
        }
    }
    else{
        alert("Usuário não cadastrado")
    }
})

//Listagem de Operações
app.get("/home", async (req,res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    let entrances=[]
    let exits=[]
    let operations =[]


    if (!token){
        return res.sendStatus(401)
    }

    const session = await db.collection("sessions").findOne({ token });
    if (!session) return res.sendStatus(401);
  
      const user = await db.collection("users").findOne({ 
          _id: session.userId 
      })

    if(user){
        try{
            const entries= await db.collection("entrance").find()
            const exes= await db.collection("exits").find()
            entrances.push(entries)
            exits.push(exes)
            operations.push(entries)
            operations.push(exes)
            for(let i=0; i<operations.length; i++){
                let maior=i;
                for(let j= i + 1; j<numeros.length;j++){
                  if(operations[j].time > operations[menor].time){
                    maior= j;
                  }
                }
                let aux= operations[i];
                operations[i]=operations[maior];
                operations[menor]=aux;
              }
            return res.send(operations,entrances,exits, user)
        }catch(err){
            console.log(err.message)
        }
    }
})




app.listen(5000, () => console.log("Servidor rodando"))