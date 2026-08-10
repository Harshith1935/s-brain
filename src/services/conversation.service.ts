import { Customer, updateCustomer } from "../database/customers";
import { detectLanguage } from "./language.service";

export async function processMessage(
    customer: Customer,
    message: string
): Promise<string> {

    console.log("STEP =", customer.step);
    console.log("FIRST VISIT =", customer.first_visit);

    const text = message.trim();

    // First Visit
    if (customer.first_visit) {

        console.log("➡️ FIRST VISIT BLOCK");

        await updateCustomer(customer.phone, {
            first_visit: false,
            step: "name"
        });

        return `
Welcome to the Seragu family. 🌸

May we know your name?
`;
    }

    // Name Collection
    if (customer.step === "name") {

        console.log("➡️ NAME BLOCK");

        await updateCustomer(customer.phone, {
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

    // Language Selection
    if (customer.step === "language") {

        console.log("➡️ LANGUAGE BLOCK");

        const language = detectLanguage(text);

        if (!language) {

            return `
Please select your language.

🇬🇧 English
🇮🇳 ಕನ್ನಡ
`;
        }

        await updateCustomer(customer.phone, {
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

📞 Contact Us
`;
    }

    // Main Menu
    if (customer.step === "menu") {

        console.log("➡️ MENU BLOCK");

        const msg = text.toLowerCase();

        if (
            msg.includes("join") ||
            msg.includes("savings")
        ) {

            return `
🪷 Join Savings Scheme

Choose your monthly savings plan.

₹1000
₹1500
₹2000
₹2500
₹3000
₹4000

Custom Amount
`;
        }

        if (
            msg.includes("pay") ||
            msg.includes("installment")
        ) {

            return `
💳 Pay Installment

Please select your payment method.

💳 Card

📱 UPI

⚠️ Once paid, the amount cannot be refunded.
`;
        }

        if (
            msg.includes("passbook")
        ) {

            return `
📖 My Passbook

Savings details will appear here.

Installments Paid:
0 / 11

Current Balance:
₹0
`;
        }

        if (
            msg.includes("contact")
        ) {

            return `
📍 Seragu Silk Sarees

🏬 Seragu – The Woven Poetry

📍 Cross,
Hesaraghatta Road,
Maheshwari Nagar,
T. Dasarahalli,
Bengaluru – 560057

📞 +91 63669 61899
📞 +91 98457 03260

🕘 9:00 AM – 6:00 PM

📍 View on Google Maps

GSTIN:
29AJXPG4939N2Z3
`;
        }

        return `
🌸 Welcome back, ${customer.name}!

How can we help you today?

🏠 Main Menu

🪷 Join Savings Scheme

💳 Pay Installment

📖 My Passbook

📞 Contact Us
`;
    }

    return `
🌸 ನಮಸ್ಕಾರ | Welcome

Seragu... The Woven Poetry
ಸೆರಗು... ಒಂದು ನೇಯ್ದ ಕವನ

Please select your language.

🇬🇧 English
🇮🇳 ಕನ್ನಡ
`;
}