import { GraphQLResolveInfo, formatError } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { Transaction } from "sequelize";
import {authResolvers} from '../../composable/auth.resolver'
import { AuthUser } from "../../../interfaces/AuthUserInterface";
import {throwError} from '../../../utils/utils'
import { compose } from "../../composable/composable.resolver";
import { DataLoaders } from "../../../interfaces/DataLoadersInterface";
export const commentResolvers = {

    Comment: {
        //@ts-ignore
        user: async (comment, args, {db, dataloaders: {userLoader}}:{db: DbConnection, dataloaders: DataLoaders}, info:  GraphQLResolveInfo) => {
            return userLoader
                .load(comment.get('user'))
        },
        //@ts-ignore
        post: async (comment, args, {db, dataloaders: {postLoader}}:{db: DbConnection, dataloaders: DataLoaders}, info:  GraphQLResolveInfo) => {
            
            return postLoader
                .load(comment.get('post'))
        },
    },
    Query: {
        //@ts-ignore
        commentByPost: async (comment, {postId, first= 10, offset=0}, context, info: GraphQLResolveInfo) => {
            const attributes = context.requestedFields.getFields(info)
            try {
                postId = parseInt(postId)
                const response = await context.db.Comment.findAll({
                    where: {post: postId},
                    limit: first,
                    offset,
                    attributes
                })
                return response;
            } catch (error) {
                return formatError(error)
            }
        }
    }, 
    Mutation: {
        //@ts-ignore
        createComment:compose(... authResolvers)(async (parent, {input}, {db, authUser}: {db: DbConnection, authUser: AuthUser} , info: GraphQLResolveInfo) => {
            input.user = authUser.id
            return db.sequelize.transaction(async (t: Transaction) => {
                return await db.Comment.create(input, {transaction: t})
            })
        }),
        //@ts-ignore
        updateComment: compose(... authResolvers)(async (parent, {id, input}, {db, authUser}: {db: DbConnection, authUser: AuthUser} , info: GraphQLResolveInfo) => {
     
                id = parseInt(id)
                const response = await db.sequelize.transaction(async (t: Transaction)=> {
                    const comment = await db.Comment.findByPk(id)
                    throwError(!comment, `Comment with id ${id} not found!`)
                    throwError(comment.get('user') != authUser.id, `Unauthorized! You can only edit comments by yourself`)
                    // retorna o usuário atualizado
                    input.user = authUser.id
                    await db.Comment.update(input, {where: {id}, transaction: t})
                    return await db.Comment.findByPk(id, {transaction: t})
                    
                })
                return response
        }),
        //@ts-ignore
        deleteComment: compose(... authResolvers)(async (parent, {id}, {db,authUser}: {db: DbConnection, authUser: AuthUser} , info: GraphQLResolveInfo) => {
           
                id = parseInt(id)
                const response = await db.sequelize.transaction(async (t: Transaction)=> {
                    const comment = await db.Comment.findByPk(id)
                    throwError(!comment, `Comment with id ${id} not found!`)
                    throwError(comment.get('user') != authUser.id, `Unauthorized! You can only delete comments by yourself`)
                    return await db.Comment.destroy({where: {id}, transaction: t})
                })
                // retorna true / false
                return !!response
        }),
    }
}