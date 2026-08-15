"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateCustomer = findOrCreateCustomer;
exports.markCustomerVisited = markCustomerVisited;
exports.saveLanguage = saveLanguage;
exports.saveCustomerName = saveCustomerName;
exports.updateCustomerStep = updateCustomerStep;
const customers_1 = require("../database/customers");
async function findOrCreateCustomer(phone) {
    const existing = await (0, customers_1.getCustomer)(phone);
    if (existing) {
        return existing;
    }
    const customer = {
        phone,
        first_visit: true,
        step: "welcome",
        installments_paid: 0,
        current_balance: 0,
    };
    const savedCustomer = await (0, customers_1.saveCustomer)(customer);
    return savedCustomer;
}
async function markCustomerVisited(phone) {
    await (0, customers_1.updateCustomer)(phone, {
        first_visit: false,
    });
}
async function saveLanguage(phone, language) {
    await (0, customers_1.updateCustomer)(phone, {
        language,
    });
}
async function saveCustomerName(phone, name) {
    await (0, customers_1.updateCustomer)(phone, {
        name,
    });
}
async function updateCustomerStep(phone, step) {
    await (0, customers_1.updateCustomer)(phone, {
        step,
    });
}
//# sourceMappingURL=customer.service.js.map