import { ComposableResolver } from "./composable.resolver";
import { ResolverContext } from "../../interfaces/ResolverContextInterface";
import { GraphQLFieldResolver } from "graphql";
import * as jwt from 'jsonwebtoken'
export const verifyTokenResolver: ComposableResolver<any, ResolverContext> =
    (resolver: GraphQLFieldResolver<any, ResolverContext>): GraphQLFieldResolver<any, ResolverContext> => {
        //@ts-ignore
        return (parent, args, context: ResolverContext, info) => {
            const token: string = context.authorization ? context.authorization.split(' ')[1] : undefined
            //@ts-ignore
            return jwt.verify(token, process.env.JWT_SECRET || 'iron_man', (err, decoded:any) => {
                if(!err) {
                    return resolver(parent, args, context, info)
                }
                throw new Error(`${err.name}: ${err.message}`)
            })
        }
    }
    