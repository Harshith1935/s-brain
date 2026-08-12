import { supabase } from "../config/supabase";

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

export async function getCustomer(
    phone: string
): Promise<Customer | null> {

    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("phone", phone)
        .single();

    if (error) {
        return null;
    }

    return data;
}

export async function saveCustomer(
    customer: Customer
): Promise<Customer | null> {

    const { data, error } = await supabase
        .from("customers")
        .insert([customer])
        .select()
        .single();

    if (error) {
        console.error(error);
        return null;
    }

    return data;
}

export async function updateCustomer(
    phone: string,
    updates: Partial<Customer>
): Promise<void> {

    const { error } = await supabase
        .from("customers")
        .update(updates)
        .eq("phone", phone);

    if (error) {
        console.error(error);
    }
}