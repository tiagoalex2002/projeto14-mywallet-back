import joi from "joi"

const loginSchema = joi.object({
    email: joi.string().required(),
    password: joi.number().required()
})

export default loginSchema;