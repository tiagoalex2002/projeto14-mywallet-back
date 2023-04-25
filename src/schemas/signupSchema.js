import joi from "joi"

const signupSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.number().min(3).required()
})

export default signupSchema;