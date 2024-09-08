//Mongo
import MongoConfig from './mongo/MongoConfig'
new MongoConfig()

//Express
import ExpressConfig from './express/ExpressConfig'
const app = new ExpressConfig().app

//Swagger
import setupSwagger from './swagger/Swagger'
setupSwagger(app)
