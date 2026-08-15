"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectLanguage = detectLanguage;
exports.setCustomerLanguage = setCustomerLanguage;
const customer_service_1 = require("./customer.service");
function detectLanguage(message) {
    const text = message.trim().toLowerCase();
    // English options
    if (text === "english" ||
        text === "eng" ||
        text === "e" ||
        text === "1") {
        return "english";
    }
    // Kannada options
    if (text === "kannada" ||
        text === "ಕನ್ನಡ" ||
        text === "kan" ||
        text === "k" ||
        text === "2") {
        return "kannada";
    }
    return null;
}
function setCustomerLanguage(phone, language) {
    (0, customer_service_1.saveLanguage)(phone, language);
}
//# sourceMappingURL=language.service.js.map