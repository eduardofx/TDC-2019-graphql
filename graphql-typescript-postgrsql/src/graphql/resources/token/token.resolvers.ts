import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import * as jwt from 'jsonwebtoken'
import { GraphQLError, formatError } from "graphql";
export const tokenResolvers = {
    Mutation: {
        //@ts-ignore
        createToken: async (parent, {email, password}, {db}: {db:DbConnection}) => {
           
                const user = await db.User.findOne({
                    where: {email},
                    attributes: ['id', 'password']
                })
                let errorMessage: string = 'Unauthorized, wrong email or password!'
        
                if(!user || !user.isPassword(user.get('password'), password)){
                    console.log(errorMessage)
                    throw new Error(errorMessage)
                } 
                const payload = {sub: user.get('id')}
                return {
                    token: jwt.sign(payload, process.env.JWT_SECRET || 'iron_man')
                }              
        }
    }

}