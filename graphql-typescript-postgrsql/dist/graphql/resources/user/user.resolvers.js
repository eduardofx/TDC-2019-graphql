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
const graphql_1 = require("graphql");
const composable_resolver_1 = require("../../composable/composable.resolver");
const auth_resolver_1 = require("../../composable/auth.resolver");
const verify_token_resolver_1 = require("../../composable/verify-token.resolver");
const utils_1 = require("../../../utils/utils");
exports.userResolvers = {
    User: {
        //@ts-ignore
        posts: (user, { first = 10, offset = 0 }, { db, requestedFields }, info) => __awaiter(this, void 0, void 0, function* () {
            const attributes = requestedFields.getFields(info, {
                keep: ['id'],
                exclude: ['comments'],
            });
            return yield db.Post
                .findAll({
                where: { author: user.get('id') },
                limit: first,
                offset,
                attributes
            });
        }),
    },
    Query: {
        //@ts-ignore
        //compose(authResolver, verifyTokenResolver) 
        users: ((parent, { first = 10, offset = 0 }, context, info) => __awaiter(this, void 0, void 0, function* () {
            const attributes = context.requestedFields.getFields(info, {
                keep: ['id'],
                exclude: ['posts']
            });
            const user = yield context.db.User.findAll({ limit: first, offset, attributes });
            //console.log(user)
            if (!user)
                throw new Error("Nenhum usuário cadastrado");
            return user;
        })),
        //@ts-ignore
        //@ts-nocheck
        user: (parent, { id }, context, info) => __awaiter(this, void 0, void 0, function* () {
            id = parseInt(id);
            const attributes = context.requestedFields.getFields(info, {
                keep: ['id'],
                exclude: ['posts'],
            });
            try {
                return yield context.db.User
                    .findByPk(id, {
                    attributes
                });
            }
            catch (error) {
                return graphql_1.formatError(error);
            }
        }),
        //@ts-ignore
        currentUser: composable_resolver_1.compose(auth_resolver_1.authResolver, verify_token_resolver_1.verifyTokenResolver)((parent, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            const attributes = context.requestedFields.getFields(info, {
                keep: ['id'],
                exclude: ['posts'],
            });
            try {
                const id = context.authUser.id;
                const user = yield context.db.User.findByPk(id, { attributes });
                utils_1.throwError(!user, `User with id ${id} not found!`);
                return user;
            }
            catch (error) {
                return graphql_1.formatError(error);
            }
        }))
    },
    Mutation: {
        //@ts-ignore
        createUser: (parent, { input }, { db }, info) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield db.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield db.User.create(input, { transaction: t });
                    return user;
                }));
                return response;
            }
            catch (error) {
                console.log(error);
                return graphql_1.formatError(error);
            }
        }),
        //@ts-ignore
        updateUser: composable_resolver_1.compose(auth_resolver_1.authResolver, verify_token_resolver_1.verifyTokenResolver)((parent, { input }, { db, authUser }, info) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = authUser.id;
                const response = yield db.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield db.User.findByPk(id);
                    utils_1.throwError(!user, `User with id ${id} not found!`);
                    yield db.User.update(input, { where: { id } });
                    return yield db.User.findByPk(id, { transaction: t });
                }));
                return response;
            }
            catch (error) {
                return graphql_1.formatError(error);
            }
        })),
        //@ts-ignore
        updateUserPassword: composable_resolver_1.compose(auth_resolver_1.authResolver, verify_token_resolver_1.verifyTokenResolver)((parent, { input }, { db, authUser }, info) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = authUser.id;
                const response = yield db.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield db.User.findByPk(id);
                    utils_1.throwError(!user, `User with id ${id} not found!`);
                    return yield db.User.update(input, { where: { id }, individualHooks: true, transaction: t });
                }));
                //retorna true / false
                return !!response;
            }
            catch (error) {
                console.error(error);
                return graphql_1.formatError(error);
            }
        })),
        //@ts-ignore
        deleteUser: composable_resolver_1.compose(auth_resolver_1.authResolver, verify_token_resolver_1.verifyTokenResolver)((parent, args, { db, authUser }, info) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = authUser.id;
                const response = yield db.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield db.User.findByPk(id);
                    utils_1.throwError(!user, `User with id ${id} not found!`);
                    return yield db.User.destroy({ where: { id }, transaction: t });
                }));
                // retorna true / false
                return !!response;
            }
            catch (error) {
                console.error(error);
                return graphql_1.formatError(error);
            }
        })),
    }
};
