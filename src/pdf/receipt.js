"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReceipt = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateReceipt = (data) => {
    return new Promise((resolve, reject) => {
        const filePath = path_1.default.join("receipts", `${data.receiptNumber}.pdf`);
        const doc = new pdfkit_1.default({
            margin: 50,
            size: "A4",
        });
        const stream = fs_1.default.createWriteStream(filePath);
        doc.pipe(stream);
        doc.fontSize(22).text("SERAGU", {
            align: "center",
        });
        doc.moveDown();
        doc.fontSize(12).text("GSTIN: 29AJXPG4939N2Z3");
        doc.text("Phone: 6366961899");
        doc.text("Email: seragusilksarees@gmail.com");
        doc.moveDown();
        doc.text(`Receipt No: ${data.receiptNumber}`);
        doc.text(`Customer: ${data.customerName}`);
        doc.text(`Phone: ${data.phone}`);
        doc.text(`Amount Paid: ₹${data.amountPaid}`);
        doc.text(`Balance Amount: ₹${data.balanceAmount}`);
        doc.text(`Date: ${data.date}`);
        doc.moveDown();
        doc.text("Thank you for choosing Seragu ❤️");
        doc.end();
        stream.on("finish", () => {
            resolve(filePath);
        });
        stream.on("error", reject);
    });
};
exports.generateReceipt = generateReceipt;
//# sourceMappingURL=receipt.js.map