export async function authValidation(req, res, next) {
    const { authorization } = req.header;
    const token = authorization?.replace('Bearer ', '');
    res.locals.token;

    if (!token) {
        return res.sendStatus(401)
    }

    try {
        const session = await db.collection("sessions").findOne({ token });
        if (!session) return res.sendStatus(401);
        res.locals.session;
        next();
    } catch (err) {
        console.log(err.message)
    }
}