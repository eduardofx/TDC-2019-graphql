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
const auth_resolver_1 = require("../../composable/auth.resolver");
const utils_1 = require("../../../utils/utils");
const composable_resolver_1 = require("../../composable/composable.resolver");
exports.commentResolvers = {
    Comment: {
        //@ts-ignore
        user: (comment, args, { db, dataloaders: { userLoader } }, info) => __awaiter(this, void 0, void 0, function* () {
            return userLoader
                .load(comment.get('user'));
        }),
        //@ts-ignore
        post: (comment, args, { db, dataloaders: { postLoader } }, info) => __awaiter(this, void 0, void 0, function* () {
            return postLoader
                .load(comment.get('post'));
        }),
    },
    Query: {
        //@ts-ignore
        commentByPost: (comment, { postId, first = 10, offset = 0 }, context, info) => __awaiter(this, void 0, void 0, function* () {
            const attributes = context.requestedFields.getFields(info);
            try {
                postId = parseInt(postId);
                const response = yield context.db.Comment.findAll({
                    where: { post: postId },
                    limit: first,
                    offset,
                    attributes
                });
                return response;
            }
            catch (error) {
                return graphql_1.formatError(error);
            }
        })
    },
    Mutation: {
        //@ts-ignore
        createComment: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, { input }, { db, authUser }, info) => __awaiter(this, void 0, void 0, function* () {
            input.user = authUser.id;
            return db.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                return yield db.Comment.create(input, { transaction: t });
            }));
        })),
        //@ts-ignore
        updateComment: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, { id, input }, { db, authUser }, info) => __awaiter(this, void 0, void 0, function* () {
            id = parseInt(id);
            const response = yield db.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const comment = yield db.Comment.findByPk(id);
                utils_1.throwError(!comment, `Comment with id ${id} not found!`);
                utils_1.throwError(comment.get('user') != authUser.id, `Unauthorized! You can only edit comments by yourself`);
                // retorna o usuário atualizado
                input.user = authUser.id;
                yield db.Comment.update(input, { where: { id }, transaction: t });
                return yield db.Comment.findByPk(id, { transaction: t });
            }));
            return response;
        })),
        //@ts-ignore
        deleteComment: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, { id }, { db, authUser }, info) => __awaiter(this, void 0, void 0, function* () {
            id = parseInt(id);
            const response = yield db.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const comment = yield db.Comment.findByPk(id);
                utils_1.throwError(!comment, `Comment with id ${id} not found!`);
                utils_1.throwError(comment.get('user') != authUser.id, `Unauthorized! You can only delete comments by yourself`);
                return yield db.Comment.destroy({ where: { id }, transaction: t });
            }));
            // retorna true / false
            return !!response;
        })),
    }
};
