import {
    Customer,
    getCustomer,
    saveCustomer,
    updateCustomer,
} from "../database/customers";

export async function findOrCreateCustomer(
    phone: string
): Promise<Customer> {

    const existing = await getCustomer(phone);

    if (existing) {
        return existing;
    }

    const customer: Customer = {
        phone,
        first_visit: true,
        step: "welcome",
        installments_paid: 0,
        current_balance: 0,
    };

    const savedCustomer = await saveCustomer(customer);

    return savedCustomer!;
}

export async function markCustomerVisited(
    phone: string
) {

    await updateCustomer(phone, {
        first_visit: false,
    });

}

export async function saveLanguage(
    phone: string,
    language: "english" | "kannada"
) {

    await updateCustomer(phone, {
        language,
    });

}

export async function saveCustomerName(
    phone: string,
    name: string
) {

    await updateCustomer(phone, {
        name,
    });

}

export async function updateCustomerStep(
    phone: string,
    step: string
) {

    await updateCustomer(phone, {
        step,
    });

}