export interface Customer {
    phone: string;
    firstVisit: boolean;
    language?: "english" | "kannada";
    name?: string;
    step?: "name" | "language" | "menu";
}

const customers = new Map<string, Customer>();

export function getCustomer(phone: string): Customer | undefined {
    return customers.get(phone);
}

export function saveCustomer(customer: Customer): void {
    customers.set(customer.phone, customer);
}

export function updateCustomer(
    phone: string,
    data: Partial<Customer>
): void {

    const customer = customers.get(phone);

    if (!customer) return;

    customers.set(phone, {
        ...customer,
        ...data,
    });

}