import { Router } from "express";
import { receiveMessage } from "../controllers/message.controller";

const router = Router();

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

}, receiveMessage);

export default router;