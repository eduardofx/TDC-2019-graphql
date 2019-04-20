import * as Sequelize from 'sequelize'
import { ModelsInterface } from '../interfaces/ModelsInterface';

export interface PostAttributes {
    id?: number
    title?: string
    content?: string
    photo?: string
    author?: number;
    createdAt?: string;
    updatedAt?: string
}

export interface PostInstance extends Sequelize.Instance<PostAttributes>, PostAttributes {

}

export interface PostModel extends  Sequelize.Model<PostInstance, PostAttributes> {
    prototype?;
    associate?(models: ModelsInterface): void
}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes):PostModel => {
    const Post: PostModel = sequelize.define<PostInstance,PostAttributes>('Post', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },{
        tableName: 'posts'
    })

    Post.associate = (models: ModelsInterface):void => {
        Post.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: 'author',
                name: 'author'
            }
        })
    }
    
    
    return Post
}