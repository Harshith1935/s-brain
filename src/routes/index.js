"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controller_1 = require("../controllers/message.controller");
const router = (0, express_1.Router)();
/**
 * Health Check
 */
router.get("/", (_, res) => {
    res.json({
        success: true,
        message: "🧠 S-BRAIN API Ready",
    });
});
/**
 * TEST ROUTE
 */
router.post("/webhook", (req, res, next) => {
    console.log("🔥🔥🔥 WEBHOOK HIT 🔥🔥🔥");
    console.log("BODY =", req.body);
    next();
}, message_controller_1.receiveMessage);
exports.default = router;
//# sourceMappingURL=index.js.map