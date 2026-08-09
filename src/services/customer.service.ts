import {
    Customer,
    getCustomer,
    saveCustomer,
    updateCustomer,
} from "../database/customers";

export function findOrCreateCustomer(phone: string): Customer {

    const existing = getCustomer(phone);

    if (existing) {
        return existing;
    }

    const customer: Customer = {
        phone,
        firstVisit: true,
    };

    saveCustomer(customer);

    return customer;
}

export function markCustomerVisited(phone: string) {
    updateCustomer(phone, {
        firstVisit: false,
    });
}

export function saveLanguage(
    phone: string,
    language: "english" | "kannada"
) {
    updateCustomer(phone, {
        language,
    });
}