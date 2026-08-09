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
 * WhatsApp Verification
 */
router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

/**
 * WhatsApp Messages
 */
router.post("/webhook", receiveMessage);

export default router;