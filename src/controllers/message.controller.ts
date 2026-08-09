import { Request, Response } from "express";
import {
    findOrCreateCustomer,
    markCustomerVisited,
} from "../services/customer.service";

import { welcomeMessage } from "../templates/welcome";

export async function receiveMessage(
    req: Request,
    res: Response
) {

    console.log("━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📩 Incoming WhatsApp Message");
    console.log("━━━━━━━━━━━━━━━━━━━━━━");

    const phone = "6366961899";

    const customer = findOrCreateCustomer(phone);


    if (customer.firstVisit) {

        console.log("🆕 First Time Customer");

        markCustomerVisited(phone);

        return res.status(200).send(welcomeMessage);
    }

    console.log("👋 Returning Customer");

    return res.status(200).json({
        reply: "Welcome Back"
    });

}