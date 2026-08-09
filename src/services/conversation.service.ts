import { Customer, updateCustomer } from "../database/customers";
import { detectLanguage } from "./language.service";

export function processMessage(
    customer: Customer,
    message: string
) {

    const text = message.trim();

    // First time customer
    if (customer.firstVisit) {

        updateCustomer(customer.phone, {
            firstVisit: false,
            step: "name"
        });

        return `
Welcome to the Seragu family. 🌸

May we know your name?
`;
    }

    // Save customer name
    if (customer.step === "name") {

        updateCustomer(customer.phone, {
            name: text,
            step: "language"
        });

        return `
Thank you, ${text}. 💛

Please select your language.

🇬🇧 English
🇮🇳 ಕನ್ನಡ
`;
    }

    // Language selection
    if (customer.step === "language") {

        const language = detectLanguage(text);

        if (!language) {

            return `
Please select your language.

🇬🇧 English
🇮🇳 ಕನ್ನಡ
`;
        }

        updateCustomer(customer.phone, {
            language,
            step: "menu"
        });

        return `
🌸 Welcome back, ${customer.name}!

How can we help you today?

🏠 Main Menu

🪷 Join Savings Scheme

💳 Pay Installment

📖 My Passbook

🛍 Browse Sarees

📞 Contact Us
`;
    }

    // Returning customer
    if (customer.step === "menu") {

        return `
🌸 Welcome back, ${customer.name}!

How can we help you today?

🏠 Main Menu

🪷 Join Savings Scheme

💳 Pay Installment

📖 My Passbook

🛍 Browse Sarees

📞 Contact Us
`;
    }

    return `
🌸 ನಮಸ್ಕಾರ | Welcome

Seragu... The Woven Poetry
ಸೆರಗು... ಒಂದು ನೇಯ್ದ ಕವನ

Please select your language.
ದಯವಿಟ್ಟು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.

🇬🇧 English
🇮🇳 ಕನ್ನಡ
`;
}