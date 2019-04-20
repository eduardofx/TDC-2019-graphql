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
const models_1 = require("../models");
exports.extractJwtMiddleware = () => {
    //@ts-ignore
    return (req, res, next) => {
        let authorization = req.get('authorization');
        let token = authorization ? authorization.split(' ')[1] : undefined;
        req['context'] = {};
        req['context']['authorization'] = authorization;
        if (!token) {
            return next();
        }
        jwt.verify(token, process.env.JWT_SECRET || 'iron_man', (err, decoded) => __awaiter(this, void 0, void 0, function* () {
            console.log(decoded);
            if (err) {
                return next();
            }
            console.log("extract");
            const user = yield models_1.default.User.findByPk(decoded.sub, {
                attributes: ['id', 'email']
            });
            //const user = db.User.findById(decoded.sub, {
            // attributes: ['id','email']
            //})
            console.log(user);
            if (user) {
                console.log("entrou aqui");
                req['context']['authUser'] = {
                    id: user.get('id'),
                    email: user.get('email')
                };
            }
            return next();
        }));
    };
};
