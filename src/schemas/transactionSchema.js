import joi from "joi"

const transactionSchema = joi.object({
    valor: joi.number().required(),
    description: joi.string().required()
})

export default transactionSchema;