"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveMessage = receiveMessage;
const customer_service_1 = require("../services/customer.service");
const conversation_service_1 = require("../services/conversation.service");
async function receiveMessage(req, res) {
    const phone = "6366961899";
    const message = req.body.message;
    const customer = await (0, customer_service_1.findOrCreateCustomer)(phone);
    console.log("CUSTOMER STEP =", customer.step);
    console.log("FIRST VISIT =", customer.first_visit);
    console.log("MESSAGE =", message);
    const reply = await (0, conversation_service_1.processMessage)(customer, message);
    return res.status(200).json({
        reply
    });
}
//# sourceMappingURL=message.controller.js.map