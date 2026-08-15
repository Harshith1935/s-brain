"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    appName: process.env.APP_NAME || "S-BRAIN",
    port: Number(process.env.PORT) || 5000,
    whatsapp: {
        verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "",
        accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
    },
};
//# sourceMappingURL=app.js.map