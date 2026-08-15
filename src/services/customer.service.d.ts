import { Customer } from "../database/customers";
export declare function findOrCreateCustomer(phone: string): Promise<Customer>;
export declare function markCustomerVisited(phone: string): Promise<void>;
export declare function saveLanguage(phone: string, language: "english" | "kannada"): Promise<void>;
export declare function saveCustomerName(phone: string, name: string): Promise<void>;
export declare function updateCustomerStep(phone: string, step: string): Promise<void>;
//# sourceMappingURL=customer.service.d.ts.map