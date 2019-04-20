"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
exports.default = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'users',
        hooks: {
            //@ts-ignore
            beforeCreate: (user, options) => {
                const salt = bcryptjs_1.genSaltSync();
                user.password = bcryptjs_1.hashSync(user.password, salt);
            },
            //@ts-ignore
            beforeUpdate: (user, options) => {
                console.log("entrou aqui");
                if (user.changed('password')) {
                    console.log("vou criptografar o password");
                    const salt = bcryptjs_1.genSaltSync();
                    user.password = bcryptjs_1.hashSync(user.password, salt);
                }
            },
        },
    });
    //@ts-ignore
    User.associate = (models) => {
    };
    User.prototype.isPassword = (encodedPassword, password) => {
        return bcryptjs_1.compareSync(password, encodedPassword);
    };
    return User;
};
