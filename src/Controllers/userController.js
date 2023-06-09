import dayjs from "dayjs"
import joi from "joi"
import bcrypt from "bcrypt"
import { v4 as uuid } from 'uuid';
import { db } from "../app.js";
import signupSchema from "../schemas/signupSchema.js";
import loginSchema from "../schemas/loginSchema.js";

export async function register(req, res) {
    const { name, email, password } = req.body


    const cryptpassword = bcrypt.hashSync(password, 10)

    try {
        let cadastro = await db.collection("users").findOne({ name: name })
        if (cadastro) {
            return res.status(409).send("Usuário já cadastrado")
        }
    } catch (err) {
        console.log(err.message)
    }

    try {
        await db.collection("users").insertOne({ name: name, email: email, password: cryptpassword })
        return res.sendStatus(201)
    } catch (err) {
        console.log(err.message)
    }
}

export async function login(req, res) {
    const { email, password } = req.body;
    const token = uuid();

    try {
        let user = await db.collection("users").findOne({ email: email })
        if (!user) {
            return res.sendStatus(404)
        }
        else if (bcrypt.compareSync(password, user.password)) {
            await db.collection("sessions").insertOne({ userId: user.password, token })
            console.log(token)
            console.log(user)
            return res.status(200).send(token)
        }
        else {
            return res.sendStatus(401)
        }
    } catch (err) {
        console.log(err.message)
    }
}

export async function logout(req, res) {
    const token = res.locals.token;
    try {
        let cad = await db.collection('sessions').findOne({ token: token })
        await db.collection("sessions").deleteOne({ token: token })
        return res.sendStatus(200)
    } catch (err) {
        console.log(err.message)
    }
}