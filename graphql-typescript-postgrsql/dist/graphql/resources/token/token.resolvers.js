"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
exports.tokenResolvers = {
    Mutation: {
        //@ts-ignore
        createToken: (parent, { email, password }, { db }) => __awaiter(this, void 0, void 0, function* () {
            const user = yield db.User.findOne({
                where: { email },
                attributes: ['id', 'password']
            });
            let errorMessage = 'Unauthorized, wrong email or password!';
            if (!user || !user.isPassword(user.get('password'), password)) {
                console.log(errorMessage);
                throw new Error(errorMessage);
            }
            const payload = { sub: user.get('id') };
            return {
                token: jwt.sign(payload, process.env.JWT_SECRET || 'iron_man')
            };
        })
    }
};
