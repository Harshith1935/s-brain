import { Request, Response } from "express";

import {
    findOrCreateCustomer
} from "../services/customer.service";

import {
    processMessage
} from "../services/conversation.service";

export async function receiveMessage(
    req: Request,
    res: Response
) {

    const phone = "6366961899";

    const message = req.body.message;

    const customer = await findOrCreateCustomer(
        phone
    );

    const reply = await processMessage(
        customer,
        message
    );

    return res.status(200).json({
        reply
    });

}