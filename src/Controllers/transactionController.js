import dayjs from "dayjs"
import joi from "joi"
import bcrypt from "bcrypt"
import { v4 as uuid } from 'uuid';
import transactionSchema from "../schemas/transactionSchema.js";
import { db } from "../app.js";

export async function addOperation(req, res) {
    const { valor, description } = req.body;
    const { tipo } = req.params;
    let date = dayjs()

    const session = res.locals.session
    const user = await db.collection("users").findOne({
        _id: session.userId
    })

    if (user) {
        if (tipo == "entrada") {
            try {
                await db.collection("entrance").insertOne({ valor: valor, description: description, date: date.format("DD/MM"), time: Date.now(), identificacao: 1 })
                return res.sendStatus(200)
            } catch (err) {
                console.log(err.message)
            }
        }
        else if (tipo == "saida") {
            try {
                await db.collection("exits").insertOne({ valor: valor, description: description, date: date.format("DD/MM"), time: Date.now(), identificacao: 0 })
                return res.sendStatus(200)
            } catch (err) {
                console.log(err.message)
            }
        }
    }
    else {
        alert("Usuário não cadastrado")
    }
}

export async function getOperations(req, res) {

    let entrances = []
    let exits = []
    let operations = []

    const session = res.locals.session
    const user = await db.collection("users").findOne({
        _id: session.userId
    })

    if (user) {
        try {
            const entries = await db.collection("entrance").find()
            const exes = await db.collection("exits").find()
            entrances.push(entries)
            exits.push(exes)
            operations.push(entries)
            operations.push(exes)
            for (let i = 0; i < operations.length; i++) {
                let maior = i;
                for (let j = i + 1; j < numeros.length; j++) {
                    if (operations[j].time > operations[menor].time) {
                        maior = j;
                    }
                }
                let aux = operations[i];
                operations[i] = operations[maior];
                operations[menor] = aux;
            }
            return res.send(operations, entrances, exits, user)
        } catch (err) {
            console.log(err.message)
        }
    }
}