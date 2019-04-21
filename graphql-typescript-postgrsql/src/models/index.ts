import * as fs from 'fs'
import * as path from 'path'
import * as Sequelize from 'sequelize'
import { DbConnection } from '../interfaces/DbConnectionInterface';

const basename: string = path.basename(module.filename)
const env: string = process.env.NODE_ENV || 'development';
let config = require(path.resolve(`${__dirname}./../config/config.json`))[env]
let db = null
let sequelize: Sequelize.Sequelize;
if(!db) {
    db = {};
    const operatorsAliases = {
        $in: Sequelize.Op.in
    }
    config = Object.assign({operatorsAliases},config)

    if (config.use_env_variable) {
        sequelize = new Sequelize(process.env[config.use_env_variable], config);
      } else {
        sequelize = new Sequelize(
            config.database,
            config.username,
            config.password,
            config
        )
      }
    fs.readdirSync(__dirname)
        .filter(file => {
            return (
            file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
            );
        })
        .forEach(file => {
            const model = sequelize['import'](path.join(__dirname, file));
            db[model['name']] = model;
        });

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });
    db['sequelize'] = sequelize
}


export default <DbConnection> db

