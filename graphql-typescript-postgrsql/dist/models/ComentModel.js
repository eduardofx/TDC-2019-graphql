"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (sequelize, DataTypes) => {
    const Comentario = sequelize.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        tableName: 'comments'
    });
    Comentario.associate = (models) => {
        Comentario.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: 'user',
                name: 'user'
            }
        });
        Comentario.belongsTo(models.Post, {
            foreignKey: {
                allowNull: false,
                field: 'post',
                name: 'post'
            }
        });
    };
    return Comentario;
};
