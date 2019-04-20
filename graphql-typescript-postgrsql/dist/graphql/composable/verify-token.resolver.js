"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
exports.verifyTokenResolver = (resolver) => {
    //@ts-ignore
    return (parent, args, context, info) => {
        const token = context.authorization ? context.authorization.split(' ')[1] : undefined;
        //@ts-ignore
        return jwt.verify(token, process.env.JWT_SECRET || 'iron_man', (err, decoded) => {
            if (!err) {
                return resolver(parent, args, context, info);
            }
            throw new Error(`${err.name}: ${err.message}`);
        });
    };
};
