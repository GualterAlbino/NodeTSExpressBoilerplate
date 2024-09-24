import mongoose from 'mongoose'

export function stringToObjectIDMongo(pValor: string): mongoose.Types.ObjectId {
  try {
    const objectId = new mongoose.Types.ObjectId(pValor)
    return objectId
  } catch (error) {
    console.error(error)
    throw `O valor: ${pValor} não é um ObjectID válido!`
  }
}
