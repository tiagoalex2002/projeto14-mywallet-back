import joi from "joi"

const transactionSchema = joi.object({
    valor: joi.float().required(),
    description: joi.string().required()
})

export default transactionSchema;