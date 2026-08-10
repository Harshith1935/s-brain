import dotenv from "dotenv";

dotenv.config();

export const config = {
  appName: process.env.APP_NAME || "S-BRAIN",
  port: Number(process.env.PORT) || 5000,

  whatsapp: {
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "",
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
  },
};