import { RequestHandler, Request, Response, NextFunction} from 'express'
import * as jwt from 'jsonwebtoken'
import db from '../models'
export const extractJwtMiddleware = (): RequestHandler => {
    //@ts-ignore
    return (req: Request , res: Response, next: NextFunction): void => {
        let authorization: string = req.get('authorization');
        let token: string = authorization ? authorization.split(' ')[1] : undefined
        req['context'] = {}
        req['context']['authorization'] = authorization

        if(!token){return next()}

        jwt.verify(token, process.env.JWT_SECRET || 'iron_man', async (err, decoded: any) => {
            console.log(decoded)
            if(err) {
                return next()
            }
            console.log("extract")
            const user = await db.User.findByPk(decoded.sub, {
                attributes: ['id','email']
            })
            //const user = db.User.findById(decoded.sub, {
               // attributes: ['id','email']
            //})
            console.log(user)
            if (user) {
                console.log("entrou aqui")
                req['context']['authUser'] = {
                    id: user.get('id'),
                    email: user.get('email')
                }
            }
            return next();
        })
    }
}