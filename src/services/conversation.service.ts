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

    // Scheme Selection
if (customer.step === "select_scheme") {

    const amount = parseInt(text);

    if (isNaN(amount)) {

        return `
Please enter a valid amount.

Examples:
1000
1500
2000
2500
3000
4000
`;
    }

    await updateCustomer(customer.phone, {
        pending_scheme_amount: amount,
        step: "confirm_scheme"
    });

    const maturityAmount = amount * 12;

    return `
🌸 Savings Plan Confirmation

Selected Plan:
₹${amount} / month

Duration:
12 Months

You Pay:
11 Installments

Seragu Gift:
₹${amount}

Maturity Value:
₹${maturityAmount}

Reply YES to confirm.
`;
}

   // Scheme Confirmation
if (customer.step === "confirm_scheme") {

    const msg = text.toLowerCase();

    if (
        msg === "yes" ||
        msg === "y"
    ) {

        const amount =
            customer.pending_scheme_amount || 0;

        await updateCustomer(customer.phone, {
            scheme_amount: amount,
            scheme_active: true,
            installments_paid: 0,
            current_balance: 0,
            pending_scheme_amount: 0,
            step: "menu"
        });

        return `
✅ Savings Scheme Activated

Monthly Amount:
₹${amount}

Duration:
12 Months

You Pay:
11 Installments

Seragu Gift:
₹${amount}

Thank you for joining Seragu 🌸
`;
    }

    await updateCustomer(customer.phone, {
        pending_scheme_amount: 0,
        step: "menu"
    });

    return `
Scheme creation cancelled.

🏠 Returning to Main Menu.
`;
}

// Pay Installment
if (customer.step === "pay_installment") {

    console.log("PAY BLOCK HIT 🔥");

    const msg = text.toLowerCase();

    if (msg === "yes" || msg === "y") {

        const installments =
            (customer.installments_paid || 0) + 1;

        const balance =
            (customer.current_balance || 0)
            + (customer.scheme_amount || 0);

        await updateCustomer(customer.phone, {
            installments_paid: installments,
            current_balance: balance,
            step: "menu"
        });

        return `
✅ Payment Successful

Amount:
₹${customer.scheme_amount}

Installments Paid:
${installments}/11

Current Balance:
₹${balance}

🏠 Returning to Main Menu
`;
    }

    await updateCustomer(customer.phone, {
        step: "menu"
    });

    return `
❌ Payment Cancelled

🏠 Returning to Main Menu
`;
}

    // Main Menu
    if (customer.step === "menu") {

        console.log("➡️ MENU BLOCK");

        const msg = text.toLowerCase();

    if (
        msg == "1" ||
        msg.includes("join") ||
        msg.includes("scheme") ||
        msg.includes("savings")
) {
    
    if (customer.scheme_active) {

    return `
✅ You already have an active savings scheme.

📖 View Passbook

💳 Pay Installment
`;
}
    await updateCustomer(customer.phone, {
        step: "select_scheme"
    });

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
    msg === "2" ||
    msg.includes("pay") ||
    msg.includes("installment")
) {

    if (!customer.scheme_active) {

        return `
❌ No Active Scheme

Please join a savings scheme first.
`;
    }

    await updateCustomer(customer.phone, {
        step: "pay_installment"
    });

    return `
💳 Installment Payment

Monthly Amount:
₹${customer.scheme_amount}

Reply YES to simulate payment.

Reply NO to cancel.
`;
}

        if (
    msg === "3" ||
    msg.includes("passbook")
) {

    if (!customer.scheme_active) {

        return `
📖 My Passbook

No active savings scheme found.

Please join a savings scheme first. 🌸
`;
    }

    return `
📖 My Passbook

👤 Customer:
${customer.name}

💰 Monthly Plan:
₹${customer.scheme_amount ?? 0}

📦 Installments Paid:
${customer.installments_paid ?? 0} / 11

💵 Current Balance:
₹${customer.current_balance ?? 0}

⌛ Pending:
₹${customer.pending_scheme_amount ?? 0}

✅ Status:
Active
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