import {db} from "../app.js"

export async function authValidation(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send("O erro é na autenticação com o token")
    }

    try {
        const session = await db.collection("sessions").findOne({ token });
        if (!session) return res.status(401).send("O erro é aqui");
        res.locals.session= session;
        next();
    } catch (err) {
        console.log(err.message)
    }
}