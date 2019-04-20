"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema_1 = require("./graphql/schema");
process.env.NODE_ENV = 'development';
const models_1 = require("./models");
const extract_jwt_middleware_1 = require("./middlewares/extract.jwt.middleware");
const DataLoaderFactory_1 = require("./graphql/dataLoaders/DataLoaderFactory");
const RequestedFields_1 = require("./graphql/ast/RequestedFields");
class App {
    constructor() {
        this.express = express();
        this.init();
    }
    init() {
        this.dataLoaderFactory = new DataLoaderFactory_1.DataLoaderFactory(models_1.default);
        this.requestedFields = new RequestedFields_1.RequestedFields();
        this.middleware();
    }
    middleware() {
        this.express.use('/graphql', 
        //@ts-ignore
        extract_jwt_middleware_1.extractJwtMiddleware(), 
        //@ts-ignore
        (req, res, next) => {
            req['context']['db'] = models_1.default;
            req['context']['dataloaders'] = this.dataLoaderFactory.getLoaders();
            req['context']['requestedFields'] = this.requestedFields;
            next();
        }, graphqlHTTP((req) => ({
            schema: schema_1.default,
            graphiql: process.env.NODE_ENV === 'development',
            context: req['context']
        })));
    }
}
exports.default = new App().express;
