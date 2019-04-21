"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
const query_1 = require("./query");
const mutation_1 = require("./mutation");
const user_schema_1 = require("./resources/user/user.schema");
const post_schema_1 = require("./resources/post/post.schema");
const coment_schema_1 = require("./resources/comment/coment.schema");
const lodash_1 = require("lodash");
const coment_resolvers_1 = require("./resources/comment/coment.resolvers");
const post_resolvers_1 = require("./resources/post/post.resolvers");
const user_resolvers_1 = require("./resources/user/user.resolvers");
const token_schema_1 = require("./resources/token/token.schema");
const token_resolvers_1 = require("./resources/token/token.resolvers");
const resolvers = lodash_1.merge(coment_resolvers_1.commentResolvers, post_resolvers_1.postResolvers, user_resolvers_1.userResolvers, token_resolvers_1.tokenResolvers);
const SchemaDefinition = `
    type Schema {
        query: Query
        mutation: Mutation
    }
`;
exports.default = graphql_tools_1.makeExecutableSchema({
    typeDefs: [
        SchemaDefinition,
        query_1.Query,
        mutation_1.Mutation,
        user_schema_1.userTypes,
        post_schema_1.postTypes,
        coment_schema_1.commentTypes,
        token_schema_1.tokenTypes
    ],
    resolvers
});
