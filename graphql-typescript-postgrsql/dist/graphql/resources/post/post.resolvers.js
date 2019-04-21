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
const composable_resolver_1 = require("../../composable/composable.resolver");
const utils_1 = require("../../../utils/utils");
const auth_resolver_1 = require("../../composable/auth.resolver");
exports.postResolvers = {
    Post: {
        //@ts-ignore
        author: (post, args, { db, dataloaders: { userLoader } }, info) => __awaiter(this, void 0, void 0, function* () {
            /*return await db.User
                .findById(post.get('author'))*/
            return userLoader
                .load(post.get('author'));
        }),
        //@ts-ignore
        comments: (post, { first = 10, offset = 0 }, context, info) => __awaiter(this, void 0, void 0, function* () {
            const attributes = context.requestedFields.getFields(info);
            return yield context.db.Comment
                .findAll({
                where: { post: post.get('id') },
                limit: first,
                offset,
                attributes
            });
        }),
    },
    Query: {
        //@ts-ignore
        posts: (parent, { first = 10, offset = 0 }, { db, requestedFields }, info) => __awaiter(this, void 0, void 0, function* () {
            const attributes = requestedFields.getFields(info, {
                keep: ['id'],
                exclude: ['comments']
            });
            return yield db.Post
                .findAll({
                limit: first,
                offset,
                attributes
            });
        }),
        //@ts-ignore
        post: (parent, { id }, { db, requestedFields }, info) => __awaiter(this, void 0, void 0, function* () {
            id = parseInt(id);
            const attributes = requestedFields.getFields(info, {
                keep: ['id'],
                exclude: ['comments']
            });
            const post = yield db.Post
                .findByPk(id, {
                attributes
            });
            utils_1.throwError(!post, `Post with id ${id} not found!`);
            return post;
        }),
    },
    Mutation: {
        //@ts-ignore
        createPost: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, { input }, { db, authUser }, info) => __awaiter(this, void 0, void 0, function* () {
            input.author = authUser.id;
            return db.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                return yield db.Post.create(input, { transaction: t });
            }));
        })),
        //@ts-ignore
        updatePost: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, { id, input }, { db, authUser, requestedFields }, info) => __awaiter(this, void 0, void 0, function* () {
            const attributes = requestedFields.getFields(info, {
                keep: ['id'],
                exclude: ['comments']
            });
            id = parseInt(id);
            const response = yield db.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const post = yield db.Post.findByPk(id);
                utils_1.throwError(!post, `Post with id ${id} not found!`);
                utils_1.throwError(post.get('author') != authUser.id, `Unauthorized! You can only edit posts by yourself`);
                input.author = authUser.id;
                yield db.Post.update(input, { where: { id } });
                return yield db.Post.findByPk(id, { transaction: t, attributes });
            }));
            return response;
        })),
        //@ts-ignore
        deletePost: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, { id }, { db, authUser }, info) => __awaiter(this, void 0, void 0, function* () {
            id = parseInt(id);
            return db.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const post = yield db.Post.findByPk(id);
                utils_1.throwError(!post, `Post with id ${id} not found!`);
                utils_1.throwError(post.get('author') != authUser.id, `Unauthorized! You can only delete posts by yourself`);
                const postDeleted = yield db.Post.destroy({ where: { id }, transaction: t });
                return !!postDeleted;
            }));
        })),
    }
};
