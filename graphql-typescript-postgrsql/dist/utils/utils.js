"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = (condition, message) => {
    if (condition) {
        throw new Error(message);
    }
};
