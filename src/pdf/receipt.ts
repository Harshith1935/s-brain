import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { supabase } from "../config/supabase";

export interface ReceiptData {
  customerName: string;
  phone: string;
  amountPaid: number;
  totalAmount: number;
  balanceAmount: number;
  receiptNumber: string;
  date: string;

  paymentMonth: string;
  installmentNumber: string;
  paymentMethod: string;
  schemeEndDate: string;
  totalSchemeAmount: number;
  transactionId: string;
}

export const generateReceipt = (
  data: ReceiptData
): Promise<string> => {
  return new Promise((resolve, reject) => {

  console.log("RECEIPT DATA");
  console.log(data);

  if (!fs.existsSync("receipts")) {
      fs.mkdirSync("receipts");
    }

    console.log("===== RECEIPT DATA =====");
    console.log(data);
    console.log("========================");

    const filePath = path.join(
      "receipts",
      `${data.receiptNumber}.pdf`
    );

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // =========================
    // LOGO
    // =========================

    const logoPath = path.join(
      process.cwd(),
      "src/assets/logo.png"
    );

    console.log("Logo exists:", fs.existsSync(logoPath));
    console.log("Logo path:", logoPath);

    if (fs.existsSync(logoPath)) {
      doc.image(
        logoPath,
        245,
        15,
        {
          width: 80,
        }
      );

      doc.y = 105;
    }

    // =========================
    // HEADER
    // =========================

    doc
      .fontSize(10)
      .fillColor("black")
      .text(
        "GSTIN: 29AJXPG4939N2Z3",
        {
          align: "center",
        }
      );

    doc.text(
      "Phone: 6366961899",
      {
        align: "center",
      }
    );

    doc.text(
      "Email: seragusilksarees@gmail.com",
      {
        align: "center",
      }
    );

    doc.moveDown();

    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke("#7A3E65");

    doc.moveDown();

    // =========================
    // TITLE
    // =========================

    doc
  .fontSize(20)
  .fillColor("#7A3E65")
  .text("PAYMENT RECEIPT", {
    align: "center",
  });

doc
  .fontSize(10)
  .fillColor("gray")
  .text("SERAGU SAVINGS SCHEME", {
    align: "center",
  });

    doc.moveDown(1.5);

    doc.fillColor("black");

    // =========================
    // RECEIPT DETAILS
    // =========================

    doc
      .fontSize(12)
      .text(
        `Receipt No : ${data.receiptNumber}`
      );

    const formattedDate = new Date(data.date)
  .toLocaleDateString("en-GB");

doc.text(
  `Date : ${formattedDate}`
);

    doc.moveDown();

    // =========================
    // CUSTOMER DETAILS
    // =========================

    doc
      .fontSize(15)
      .fillColor("#7A3E65")
      .text("Customer Details");

    doc.moveDown(0.5);

    doc
      .fontSize(12)
      .fillColor("black")
      .text(
        `Customer Name : ${data.customerName}`
      );

    doc.text(
      `Phone Number : ${data.phone}`
    );

    doc.moveDown();

    // =========================
// PAYMENT DETAILS
// =========================

doc
  .fontSize(15)
  .fillColor("#7A3E65")
  .text("Payment Details");

doc.moveDown();

const startX = 80;
const amountX = 380;

const tableY = doc.y;

// Header
doc
  .rect(60, tableY, 480, 28)
  .fillAndStroke("#7A3E65", "#7A3E65");

doc
  .fillColor("white")
  .fontSize(12)
  .text("Description", startX, tableY + 8);

doc.text(
  "Details",
  amountX,
  tableY + 8
);

doc.fillColor("black");

// Row Positions
const row1 = tableY + 40;
const row2 = row1 + 28;
const row3 = row2 + 28;
const row4 = row3 + 28;
const row5 = row4 + 28;
const row6 = row5 + 28;
const row7 = row6 + 28;
const row8 = row7 + 28;

// Amount Paid
doc.text(
  "Amount Paid",
  startX,
  row1
);

doc.text(
  `Rs. ${Number(data.amountPaid).toLocaleString("en-IN")}`,
  amountX,
  row1,
  {
    width: 140,
    align: "left"
  }
);

// Payment Month
doc.text(
  "Payment Month",
  startX,
  row2
);

doc.text(
  data.paymentMonth,
  amountX,
  row2
);

// Installment
doc.text(
  "Current Installment",
  startX,
  row3
);

doc.text(
  data.installmentNumber,
  amountX,
  row3
);

// Payment Method
doc.text(
  "Payment Method",
  startX,
  row4
);

doc.text(
  data.paymentMethod,
  amountX,
  row4
);

doc.text(
  "Transaction Reference",
  startX,
  row5
);

doc.text(
  data.transactionId,
  amountX,
  row5
);

// Total Scheme Amount
doc.text(
  "Total Scheme Amount",
  startX,
  row6
);

doc.text(
  `Rs. ${Number(
    data.totalSchemeAmount
  ).toLocaleString("en-IN")}`,
  amountX,
  row6,
  {
    width: 140,
    align: "left"
  }
);

// Balance Amount
doc.text(
  "Balance Amount",
  startX,
  row7
);

doc.text(
  `Rs. ${Number(data.balanceAmount).toLocaleString("en-IN")}`,
  amountX,
  row7,
  {
    width: 140,
    align: "left"
  }
);

// Scheme Maturity Date
doc.text(
  "Scheme Maturity Date",
  startX,
  row8
);

doc.text(
  data.schemeEndDate,
  amountX,
  row8
);

// Border
doc.rect(
  60,
  tableY + 28,
  480,
  245
).stroke("#D8D8D8");

doc.y = row8 + 35;
    // =========================
    // FOOTER
    // =========================

    doc.moveDown(1);

doc
  .fontSize(12)
  .text(
    "Thank you for saving with Seragu.",
    {
      align: "center"
    }
  );

doc.moveDown(1);

doc
  .fontSize(13)
  .fillColor("#7A3E65")
  .text(
    "SERAGU - The Woven Poetry",
    {
      align: "center"
    }
  );

doc
  .fillColor("black")
  .fontSize(11)
  .text(
    "Phone : 6366961899",
    {
      align: "center"
    }
  );

    doc.text(
      "GSTIN : 29AJXPG4939N2Z3",
      {
        align: "center",
      }
    );

    doc.end();

    stream.on(
      "finish",
      async () => {
        try {

          const fileBuffer =
            fs.readFileSync(
              filePath
            );

          const { error } =
            await supabase.storage
              .from("receipts")
              .upload(
                `${data.receiptNumber}.pdf`,
                fileBuffer,
                {
                  contentType:
                    "application/pdf",
                  upsert: true,
                }
              );

          if (error) {
            return reject(error);
          }

          const {
            data: publicUrlData,
          } = supabase.storage
            .from("receipts")
            .getPublicUrl(
              `${data.receiptNumber}.pdf`
            );

          resolve(
            publicUrlData.publicUrl
          );

        } catch (err) {
          reject(err);
        }
      }
    );

    stream.on(
      "error",
      reject
    );
  });
};