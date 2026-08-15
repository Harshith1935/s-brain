export interface ReceiptData {
    customerName: string;
    phone: string;
    amountPaid: number;
    totalAmount: number;
    balanceAmount: number;
    receiptNumber: string;
    date: string;
}
export declare const generateReceipt: (data: ReceiptData) => Promise<string>;
//# sourceMappingURL=receipt.d.ts.map