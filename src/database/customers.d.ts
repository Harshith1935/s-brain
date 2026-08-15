export interface Customer {
    id?: string;
    phone: string;
    first_visit: boolean;
    language?: string;
    name?: string;
    step?: string;
    scheme_amount?: number;
    pending_scheme_amount?: number;
    scheme_active?: boolean;
    installments_paid?: number;
    current_balance?: number;
    next_due_date?: string;
}
export declare function getCustomer(phone: string): Promise<Customer | null>;
export declare function saveCustomer(customer: Customer): Promise<Customer | null>;
export declare function updateCustomer(phone: string, updates: Partial<Customer>): Promise<void>;
//# sourceMappingURL=customers.d.ts.map