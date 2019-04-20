"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataLoader = require("dataloader");
const UserLoader_1 = require("./UserLoader");
const PostLoader_1 = require("./PostLoader");
class DataLoaderFactory {
    constructor(db) {
        this.db = db;
    }
    getLoaders() {
        return {
            userLoader: new DataLoader((ids) => UserLoader_1.UserLoader.batchUsers(this.db.User, ids)),
            postLoader: new DataLoader((ids) => PostLoader_1.PostLoader.batchPosts(this.db.Post, ids)),
        };
    }
}
exports.DataLoaderFactory = DataLoaderFactory;
