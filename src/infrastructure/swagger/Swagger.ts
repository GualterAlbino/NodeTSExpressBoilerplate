import express from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OnTask API',
      version: '1.0.0',
      description: 'Documentação da API'
    },
    servers: [
      {
        url: 'http://localhost:3000' // URL do servidor
      }
    ]
  },
  apis: ['./src/infrastructure/express/routes/*.ts'] // Caminho para os arquivos de rotas
}

const swaggerSpec = swaggerJsdoc(options)

export default function setupSwagger(app: express.Application): void {
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

//Exemplo
/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
