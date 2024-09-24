import mongoose, { SchemaDefinition } from 'mongoose'

export default abstract class SchemaModel {
  private descricaoCollection: string = ''
  private schemaDefinition: SchemaDefinition

  constructor(pDescricaoCollection: string, pSchema: SchemaDefinition) {
    this.schemaDefinition = pSchema
    this.descricaoCollection = pDescricaoCollection
  }

  public async instancia(): Promise<mongoose.Model<any>> {
    // Criação do esquema
    const schema = new mongoose.Schema(this.schemaDefinition)

    const nomeColecao = SchemaModel.montarNomeCollection(
      this.descricaoCollection
    )

    let schemaMongo: mongoose.Model<any>

    // Registra o modelo se ainda não estiver registrado
    if (!mongoose.models[nomeColecao]) {
      schemaMongo = mongoose.model(nomeColecao, schema, nomeColecao)
    } else {
      schemaMongo = mongoose.models[nomeColecao]
    }

    return schemaMongo
  }

  static async getNameCollections(pNomeColecao: string) {
    // Retorna o modelo registrado para o nome da coleção, se existir
    return (await mongoose.connection.listCollections()).filter(
      (c) => c.name === pNomeColecao
    )
  }

  static getModelNames() {
    // Retorna os nomes dos modelos registrados
    return mongoose.modelNames()
  }

  static montarNomeCollection(pDescricaoCollection: string): string {
    return `${pDescricaoCollection.toUpperCase()}`
  }
}
