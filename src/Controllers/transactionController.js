import dayjs from "dayjs"
import { db } from "../app.js";

export async function addOperation(req, res) {
    const { valor, description } = req.body;
    const { tipo } = req.params;
    let date = dayjs()

    res.locals.session= session;
    const user = await db.collection("users").findOne({
        password: session.userId
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
        password: session.userId
    })

    if (user) {
        try {
            let entries = await db.collection("entrance").find().toArray()
            const exes = await db.collection("exits").find().toArray()
            entrances.push(entries)
            exits.push(exes)
            operations.push(entries)
            operations.push(exes)
            for (let i = 0; i < operations.length; i++) {
                let maior = i;
                for (let j = i + 1; j < operations.length; j++) {
                    if (operations[j].time > operations[menor].time) {
                        maior = j;
                    }
                }
                let aux = operations[i];
                operations[i] = operations[maior];
                operations[maior] = aux;
            }
            return res.send(operations, entrances, exits, user)
        } catch (err) {
            console.log(err.message)
        }
    }
}