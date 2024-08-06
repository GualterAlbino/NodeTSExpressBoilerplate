//Express
import ExpressConfig from "./express/ExpressConfig";

//Mongo
import MongoConfig from "./mongo/MongoConfig";

const app = new ExpressConfig().app;
new MongoConfig(app);
