"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomer = getCustomer;
exports.saveCustomer = saveCustomer;
exports.updateCustomer = updateCustomer;
const supabase_1 = require("../config/supabase");
async function getCustomer(phone) {
    const { data, error } = await supabase_1.supabase
        .from("customers")
        .select("*")
        .eq("phone", phone)
        .single();
    if (error) {
        return null;
    }
    return data;
}
async function saveCustomer(customer) {
    const { data, error } = await supabase_1.supabase
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
async function updateCustomer(phone, updates) {
    const { error } = await supabase_1.supabase
        .from("customers")
        .update(updates)
        .eq("phone", phone);
    if (error) {
        console.error(error);
    }
}
//# sourceMappingURL=customers.js.map