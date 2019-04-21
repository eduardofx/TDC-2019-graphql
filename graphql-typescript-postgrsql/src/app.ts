import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'
import schema from './graphql/schema'
process.env.NODE_ENV = 'development'
import db from './models'
import { extractJwtMiddleware } from './middlewares/extract.jwt.middleware';
import { DataLoaderFactory } from './graphql/dataLoaders/DataLoaderFactory';
import { RequestedFields } from './graphql/ast/RequestedFields';

class App {
    public express: express.Application
    private dataLoaderFactory: DataLoaderFactory
    private requestedFields: RequestedFields
    constructor() {
        this.express = express()
        this.init() 
    }          
    private init():void {
        this.dataLoaderFactory = new DataLoaderFactory(db);
        this.requestedFields = new RequestedFields() 
        this.middleware() 
    } 
    private middleware():void{
        this.express.use('/graphql',
            //@ts-ignore
            extractJwtMiddleware(),
            //@ts-ignore
            (req, res, next) => {
                req['context']['db'] = db;
                req['context']['dataloaders'] = this.dataLoaderFactory.getLoaders() 
                req['context']['requestedFields'] = this.requestedFields
                next();
            },
            graphqlHTTP((req) =>({
                schema,
                graphiql: process.env.NODE_ENV === 'development',
                context: req['context']
            })))
    }

   
}
export default new App().express 