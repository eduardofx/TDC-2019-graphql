import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { GraphQLResolveInfo, formatError } from "graphql";
import { Transaction } from "sequelize";
import { compose } from "../../composable/composable.resolver";
import { authResolver } from "../../composable/auth.resolver";
import { verifyTokenResolver } from "../../composable/verify-token.resolver";
import { AuthUser } from "../../../interfaces/AuthUserInterface";
import {throwError} from '../../../utils/utils'
import { RequestedFields } from "../../ast/RequestedFields";
import { ResolverContext } from "../../../interfaces/ResolverContextInterface";

export const userResolvers = {
    User: {
        //@ts-ignore
        posts: async (user, {first = 10, offset = 0}, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            const attributes = requestedFields.getFields(info, {
                keep: ['id'],
                exclude: ['comments'],
                
            })
            return await db.Post
                .findAll({
                    where: {author: user.get('id')},
                    limit: first,
                    offset,
                    attributes
                })
        },
    },
    
    Query: {
        //@ts-ignore
        //compose(authResolver, verifyTokenResolver) 
        users:(async (parent, {first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            const attributes = context.requestedFields.getFields(info, {
                keep: ['id'],
                exclude: ['posts']
            })
            const user = await context.db.User.findAll({limit: first,offset, attributes})
            //console.log(user)
            if(!user) throw new Error ("Nenhum usuário cadastrado")

            return user
        }),
        //@ts-ignore
        //@ts-nocheck
        user: async (parent, {id}, context, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            const attributes = context.requestedFields.getFields(info, {
                keep: ['id'],
                exclude: ['posts'],   
            })
            try {
                return await context.db.User
                .findByPk(id, {
                    attributes
                })
            } catch (error) {
                return formatError(error)
            }   
        },
        //@ts-ignore
        currentUser: compose(authResolver, verifyTokenResolver) (async (parent, args, context , info: GraphQLResolveInfo) => {
            const attributes = context.requestedFields.getFields(info, {
                keep: ['id'],
                exclude: ['posts'],   
            })
            try {
                const id = context.authUser.id
                const user = await context.db.User.findByPk(id, {attributes})
                throwError(!user,`User with id ${id} not found!`)
                return user
            } catch (error) {
                return formatError(error)
            }
        })
    },
    Mutation: {
        //@ts-ignore
        createUser: async (parent, {input}, {db}: {db: DbConnection} , info: GraphQLResolveInfo) => {
            try {
                const response = await db.sequelize.transaction(async (t: Transaction) => {
                    const user = await db.User.create(input, {transaction: t})
                    return user;
                })
                return response
            } catch (error) {
                console.log(error)
                return formatError(error)
            }
        },
        //@ts-ignore
        updateUser: compose(authResolver, verifyTokenResolver) (async (parent, {input}, {db, authUser}: {db: DbConnection, authUser: AuthUser} , info: GraphQLResolveInfo) => {
            
            try {
                const id = authUser.id
                const response = await db.sequelize.transaction(async (t: Transaction)=> {
                    const user = await db.User.findByPk(id)
                    throwError(!user,`User with id ${id} not found!`)
                    await db.User.update(input, {where: {id}})
                    return await db.User.findByPk(id, {transaction: t }) 
                })
                return response
            } catch (error) {
                return formatError(error)
            }
        }),
        //@ts-ignore
        updateUserPassword:compose(authResolver, verifyTokenResolver) (async (parent, {input}, {db, authUser}: {db: DbConnection, authUser: AuthUser} , info: GraphQLResolveInfo) => {
            try {
                const id = authUser.id
                const response = await db.sequelize.transaction(async (t: Transaction)=> {
                    const user = await db.User.findByPk(id)
                    throwError(!user,`User with id ${id} not found!` )
                    return await db.User.update(input, {where: {id}, individualHooks: true, transaction: t})
                })
                 //retorna true / false
                return !!response
            } catch (error) {
                console.error(error)
                return formatError(error)
            }
            
        }),
        //@ts-ignore
        deleteUser:compose(authResolver, verifyTokenResolver)(async (parent,args, {db,authUser}: {db: DbConnection, authUser: AuthUser} , info: GraphQLResolveInfo) => {
            try {
                const id = authUser.id
                const response = await db.sequelize.transaction(async (t: Transaction)=> {
                    const user = await db.User.findByPk(id)
                    throwError(!user, `User with id ${id} not found!`)
                    return await db.User.destroy({where: {id}, transaction: t})
                     
                })
                // retorna true / false
                return !!response
            } catch (error) {
                console.error(error)
                return formatError(error)
            }
        }),
    }
}
