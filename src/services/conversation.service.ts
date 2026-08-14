import { Customer, updateCustomer } from "../database/customers";
import { detectLanguage } from "./language.service";
import { supabase } from "../config/supabase";

export async function processMessage(
    customer: Customer,
    message: string
): Promise<string> {

    const isKannada =
        customer.language === "kannada";

    console.log("LANGUAGE =", customer.language);
    console.log("ISKANNADA =", isKannada);

    console.log("STEP =", customer.step);
    console.log("FIRST VISIT =", customer.first_visit);

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

        return language === "kannada"
            ? `
🌸 ಮತ್ತೆ ಸ್ವಾಗತ, ${customer.name}!

ನಾವು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?

🏠 ಮುಖ್ಯ ಮೆನು

1️⃣ ಉಳಿತಾಯ ಯೋಜನೆ ಸೇರಿ

2️⃣ ಕಂತು ಪಾವತಿ

3️⃣ ನನ್ನ ಪಾಸ್‌ಬುಕ್

4️⃣ ವ್ಯವಹಾರ ಇತಿಹಾಸ

5️⃣ ಸಂಪರ್ಕಿಸಿ
`
            : `
🌸 Welcome back, ${customer.name}!

How can we help you today?

🏠 Main Menu

1️⃣ Join Savings Scheme

2️⃣ Pay Installment

3️⃣ My Passbook

4️⃣ Transaction History

5️⃣ Contact Us
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

       return isKannada
? `
🌸 ಉಳಿತಾಯ ಯೋಜನೆ ದೃಢೀಕರಣ

ಆಯ್ಕೆ ಮಾಡಿದ ಯೋಜನೆ
₹${amount} / ತಿಂಗಳು

ಅವಧಿ
12 ತಿಂಗಳು

ನೀವು ಪಾವತಿಸುವುದು
11 ಕಂತುಗಳು

ಸೆರಗು ಉಡುಗೊರೆ
₹${amount}

ಒಟ್ಟು ಮೌಲ್ಯ
₹${maturityAmount}

ದೃಢೀಕರಿಸಲು YES ಎಂದು ಉತ್ತರಿಸಿ.
`
: `
🌸 Savings Plan Confirmation

Selected Plan
₹${amount} / month

Duration
12 Months

You Pay
11 Installments

Seragu Gift
₹${amount}

Maturity Value
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

           return isKannada
? `
✅ ಉಳಿತಾಯ ಯೋಜನೆ ಸಕ್ರಿಯಗೊಂಡಿದೆ

ಮಾಸಿಕ ಮೊತ್ತ
₹${amount}

ಅವಧಿ
12 ತಿಂಗಳು

ನೀವು ಪಾವತಿಸುವುದು
11 ಕಂತುಗಳು

ಸೆರಗು ಉಡುಗೊರೆ
₹${amount}

ಸೆರಗಿಗೆ ಸ್ವಾಗತ 🌸
`
: `
✅ Savings Scheme Activated

Monthly Amount
₹${amount}

Duration
12 Months

You Pay
11 Installments

Seragu Gift
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

            if (installments > 11) {

                return `
🎉 Savings Scheme Completed

You have already completed all 11 installments.

Thank you for choosing Seragu 🌸
`;
            }

            await updateCustomer(customer.phone, {
                installments_paid: installments,
                current_balance: balance,
                scheme_active: installments < 11,
                step: "menu"
            });

            await supabase
                .from("transactions")
                .insert([
                    {
                        phone: customer.phone,
                        amount: customer.scheme_amount,
                        transaction_type: "INSTALLMENT_PAYMENT"
                    }
                ]);

            if (installments === 11) {

                return `
🎉 SAVINGS SCHEME COMPLETED

━━━━━━━━━━━━━━

👤 Customer : ${customer.name}

💰 Monthly Plan : ₹${customer.scheme_amount}

📦 Installments Paid : 11/11

💵 Final Balance : ₹${balance}

🎁 Seragu Benefit Unlocked

━━━━━━━━━━━━━━

📍 Please visit our store
to redeem your benefit.

📞 63669 61899
📞 98457 03260

🌸 Thank you for saving with Seragu.

The Woven Poetry 🪷
`;
            }

return isKannada
? `
✅ ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ

ಮೊತ್ತ
₹${customer.scheme_amount}

ಪಾವತಿಸಿದ ಕಂತುಗಳು
${installments}/11

ಪ್ರಸ್ತುತ ಶೇಷ
₹${balance}
`
: `
✅ Payment Successful

Amount:
₹${customer.scheme_amount}

Installments Paid:
${installments}/11

Current Balance:
₹${balance}
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

                return isKannada
                    ? `
✅ ನೀವು ಈಗಾಗಲೇ ಸಕ್ರಿಯ ಉಳಿತಾಯ ಯೋಜನೆಯನ್ನು ಹೊಂದಿದ್ದೀರಿ.

📖 ಪಾಸ್‌ಬುಕ್ ನೋಡಿ

💳 ಕಂತು ಪಾವತಿಸಿ
`
                    : `
✅ You already have an active savings scheme.

📖 View Passbook

💳 Pay Installment
`;
            }
            await updateCustomer(customer.phone, {
    step: "select_scheme"
});

return isKannada
? `
🪷 ಉಳಿತಾಯ ಯೋಜನೆಗೆ ಸೇರಿ

ನಿಮ್ಮ ಮಾಸಿಕ ಉಳಿತಾಯ ಯೋಜನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.

₹1000
₹1500
₹2000
₹2500
₹3000
₹4000
`
: `
🪷 Join Savings Scheme

Choose your monthly savings plan.

₹1000
₹1500
₹2000
₹2500
₹3000
₹4000
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

                return isKannada
? `
💳 ಕಂತು ಪಾವತಿ

ಮಾಸಿಕ ಮೊತ್ತ
₹${customer.scheme_amount}

YES ಎಂದು ಉತ್ತರಿಸಿ.
`
: `
💳 Installment Payment

Monthly Amount:
₹${customer.scheme_amount}

Reply YES to simulate payment.
`;
            }

            if (
                msg === "3" ||
                msg.includes("passbook")
            ) {

                if (!customer.scheme_active) {

                    return isKannada
                        ? `
📖 ಸೆರಗು ಪಾಸ್‌ಬುಕ್

❌ ಯಾವುದೇ ಸಕ್ರಿಯ ಉಳಿತಾಯ ಯೋಜನೆ ಇಲ್ಲ.

ದಯವಿಟ್ಟು ಮೊದಲು ಯೋಜನೆಗೆ ಸೇರಿ.
`
                        : `
📖 SERAGU PASSBOOK

❌ No Active Savings Scheme

Please join a savings scheme first.
`;
                }

                const remaining =
                    (11 - (customer.installments_paid ?? 0))
                    * (customer.scheme_amount ?? 0);

                return isKannada
                    ? `
📖 ಸೆರಗು ಪಾಸ್‌ಬುಕ್

👤 ಗ್ರಾಹಕರ ಹೆಸರು
${customer.name}

💰 ಮಾಸಿಕ ಯೋಜನೆ
₹${customer.scheme_amount ?? 0}

📦 ಪಾವತಿಸಿದ ಕಂತುಗಳು
${customer.installments_paid ?? 0}/11

💵 ಪ್ರಸ್ತುತ ಶೇಷ
₹${customer.current_balance ?? 0}

⏳ ಉಳಿದಿರುವ ಮೊತ್ತ
₹${remaining}

✅ ಯೋಜನೆಯ ಸ್ಥಿತಿ
ಸಕ್ರಿಯ 🟢

🌸 ಸೆರಗು ಉಳಿತಾಯ ಯೋಜನೆ
`
                    : `
📖 SERAGU PASSBOOK

👤 Customer Name
${customer.name}

💰 Monthly Plan
₹${customer.scheme_amount ?? 0}

📦 Installments Paid
${customer.installments_paid ?? 0}/11

💵 Current Balance
₹${customer.current_balance ?? 0}

⏳ Remaining Amount
₹${remaining}

✅ Scheme Status
ACTIVE 🟢

🌸 Seragu Savings Scheme
The Woven Poetry
`;
            } 

            if (
                msg === "4" ||
                msg.includes("history")
            ) {

                const { data } = await supabase
                    .from("transactions")
                    .select("*")
                    .eq("phone", customer.phone)
                    .order("created_at", { ascending: false });

                if (!data || data.length === 0) {
                   return isKannada
? `
📜 ಸೆರಗು ವ್ಯವಹಾರ ಇತಿಹಾಸ

ಯಾವುದೇ ವ್ಯವಹಾರಗಳು ಕಂಡುಬಂದಿಲ್ಲ.
`
: `
📜 Transaction History

No transactions found.
`;
                }

                let history = isKannada
? `
📜 ಸೆರಗು ವ್ಯವಹಾರ ಇತಿಹಾಸ

📦 ಪಾವತಿಸಿದ ಕಂತುಗಳು
${customer.installments_paid ?? 0}/11

━━━━━━━━━━━━━━
`
: `
📜 SERAGU TRANSACTION HISTORY

📦 Total Installments Paid
${customer.installments_paid ?? 0}/11

━━━━━━━━━━━━━━
`;

validTransactions.forEach((tx, index) => {

    history += isKannada
    ? `
💳 ಕಂತು #${index + 1}

₹${tx.amount}

📅 ${new Date(
            tx.created_at
        ).toLocaleDateString("en-GB")}

━━━━━━━━━━━━━━
`
    : `
💳 Installment #${index + 1}

₹${tx.amount}

📅 ${new Date(
            tx.created_at
        ).toLocaleDateString("en-GB")}

━━━━━━━━━━━━━━
`;
});

history += isKannada
? `
💰 ಪ್ರಸ್ತುತ ಶೇಷ
₹${customer.current_balance ?? 0}

⏳ ಉಳಿದಿರುವ ಕಂತುಗಳು
${11 - (customer.installments_paid ?? 0)}

🌸 ಸೆರಗು ಆಯ್ಕೆ ಮಾಡಿದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು
`
: `
💰 Current Balance
₹${customer.current_balance ?? 0}

⏳ Remaining Installments
${11 - (customer.installments_paid ?? 0)}

🌸 Thank you for choosing Seragu
`;

return history;
            }

            if (
                msg === "5" ||
                msg.includes("contact")
            ) {

                return `
📍 SERAGU SILK SAREES
🌸 The Woven Poetry

🏬 Store Address

Cross,
Hesaraghatta Road,
Maheshwari Nagar,
T. Dasarahalli,
Bengaluru - 560057

📞 Call Us

+91 63669 61899
+91 98457 03260

🕘 Store Hours

9:00 AM - 6:00 PM

📍 Google Maps
https://maps.app.goo.gl/vRw3hjE7hbzheYZv8

💌 Thank you for choosing Seragu
`;
            }

            return isKannada
                ? `
🌸 ಮತ್ತೆ ಸ್ವಾಗತ, ${customer.name}!

ನಾವು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?

🏠 ಮುಖ್ಯ ಮೆನು

1️⃣ ಉಳಿತಾಯ ಯೋಜನೆ ಸೇರಿ

2️⃣ ಕಂತು ಪಾವತಿ

3️⃣ ನನ್ನ ಪಾಸ್‌ಬುಕ್

4️⃣ ವ್ಯವಹಾರ ಇತಿಹಾಸ

5️⃣ ಸಂಪರ್ಕಿಸಿ
`
                : `
🌸 Welcome back, ${customer.name}!

How can we help you today?

🏠 Main Menu

1️⃣ Join Savings Scheme

2️⃣ Pay Installment

3️⃣ My Passbook

4️⃣ Transaction History

5️⃣ Contact Us
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