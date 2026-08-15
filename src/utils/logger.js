"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    info: (message) => {
        console.log(`🟢 ${message}`);
    },
    error: (message) => {
        console.error(`🔴 ${message}`);
    },
    warning: (message) => {
        console.warn(`🟡 ${message}`);
    },
};
//# sourceMappingURL=logger.js.map