import { jsPDF } from "jspdf";

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
};

const safeText = (value: any) => {
  return String(value ?? "");
};

const shortText = (
  text: string,
  maxLength: number
) => {
  if (!text) return "";

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - 3) + "...";
};

export const generateInvoicePdf =
  async ({
    order,
    user,
  }: {
    order: any;
    user: any;
  }): Promise<Buffer> => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth =
      doc.internal.pageSize.getWidth();

    const pageHeight =
      doc.internal.pageSize.getHeight();

    const margin = 40;

    const primary = "#0B1120";
    const secondary = "#111827";
    const muted = "#6B7280";
    const light = "#F8FAFC";
    const border = "#E5E7EB";
    const accent = "#0891B2";

    const orderId =
      safeText(order._id);

    const createdAt =
      order.createdAt
        ? new Date(
            order.createdAt
          ).toLocaleDateString("en-IN")
        : new Date().toLocaleDateString(
            "en-IN"
          );

    // ================= HEADER =================

    doc.setFillColor(primary);
    doc.rect(
      0,
      0,
      pageWidth,
      120,
      "F"
    );

    doc.setTextColor("#FFFFFF");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text(
      "TechStore",
      margin,
      48
    );

    doc.setFontSize(10);
    doc.setTextColor("#67E8F9");
    doc.text(
      "PREMIUM ELECTRONICS STORE",
      margin,
      72
    );

    doc.setFontSize(24);
    doc.setTextColor("#FFFFFF");
    doc.text(
      "INVOICE",
      pageWidth - margin,
      48,
      {
        align: "right",
      }
    );

    doc.setFontSize(10);
    doc.setFont(
      "helvetica",
      "normal"
    );
    doc.setTextColor("#CBD5E1");

    doc.text(
      `Invoice ID: ${orderId}`,
      pageWidth - margin,
      72,
      {
        align: "right",
      }
    );

    doc.text(
      `Date: ${createdAt}`,
      pageWidth - margin,
      90,
      {
        align: "right",
      }
    );

    // ================= CUSTOMER INFO =================

    let y = 155;

    doc.setTextColor(secondary);
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.setFontSize(14);
    doc.text(
      "Billed To",
      margin,
      y
    );

    doc.setFont(
      "helvetica",
      "normal"
    );
    doc.setFontSize(10);
    doc.setTextColor(muted);

    doc.text(
      safeText(user?.name),
      margin,
      y + 24
    );

    doc.text(
      safeText(user?.email),
      margin,
      y + 42
    );

    doc.setTextColor(secondary);
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.setFontSize(14);
    doc.text(
      "Delivery Address",
      330,
      y
    );

    doc.setFont(
      "helvetica",
      "normal"
    );
    doc.setFontSize(10);
    doc.setTextColor(muted);

    const addressLines =
      doc.splitTextToSize(
        `${safeText(
          order.shippingAddress
            ?.fullName
        )}\n${safeText(
          order.shippingAddress
            ?.address
        )}\n${safeText(
          order.shippingAddress
            ?.city
        )} - ${safeText(
          order.shippingAddress
            ?.pincode
        )}\nPhone: ${safeText(
          order.shippingAddress
            ?.phone
        )}`,
        220
      );

    doc.text(
      addressLines,
      330,
      y + 24
    );

    // ================= ORDER BOX =================

    y = 280;

    doc.setFillColor(light);
    doc.roundedRect(
      margin,
      y,
      pageWidth - margin * 2,
      70,
      12,
      12,
      "F"
    );

    doc.setTextColor(secondary);
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.setFontSize(10);

    doc.text(
      "Order ID",
      margin + 20,
      y + 22
    );

    doc.text(
      "Payment",
      margin + 220,
      y + 22
    );

    doc.text(
      "Status",
      margin + 360,
      y + 22
    );

    doc.setFont(
      "helvetica",
      "normal"
    );
    doc.setTextColor(muted);

    doc.text(
      shortText(`#${orderId}`, 24),
      margin + 20,
      y + 45
    );

    doc.text(
      safeText(
        order.paymentMethod ||
          "Stripe"
      ),
      margin + 220,
      y + 45
    );

    doc.text(
      safeText(
        order.paymentStatus ||
          "Paid"
      ),
      margin + 360,
      y + 45
    );

    // ================= ITEMS TABLE =================

    y = 395;

    doc.setTextColor(secondary);
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.setFontSize(16);
    doc.text(
      "Purchased Items",
      margin,
      y - 24
    );

    doc.setFillColor(primary);
    doc.roundedRect(
      margin,
      y,
      pageWidth - margin * 2,
      36,
      10,
      10,
      "F"
    );

    doc.setTextColor("#FFFFFF");
    doc.setFontSize(10);
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "Product",
      margin + 18,
      y + 23
    );

    doc.text(
      "Price",
      315,
      y + 23
    );

    doc.text(
      "Qty",
      405,
      y + 23
    );

    doc.text(
      "Total",
      pageWidth - margin - 20,
      y + 23,
      {
        align: "right",
      }
    );

    y += 58;

    const items =
      order.orderItems || [];

    items.forEach(
      (item: any, index: number) => {
        if (y > pageHeight - 140) {
          doc.addPage();

          y = 70;
        }

        if (index % 2 === 0) {
          doc.setFillColor("#F9FAFB");
          doc.roundedRect(
            margin,
            y - 16,
            pageWidth - margin * 2,
            44,
            8,
            8,
            "F"
          );
        }

        const itemTotal =
          Number(item.price || 0) *
          Number(item.quantity || 0);

        doc.setTextColor(secondary);
        doc.setFont(
          "helvetica",
          "bold"
        );
        doc.setFontSize(10);

        const productLines =
          doc.splitTextToSize(
            safeText(item.title),
            220
          );

        doc.text(
          productLines.slice(0, 2),
          margin + 18,
          y
        );

        doc.setFont(
          "helvetica",
          "normal"
        );
        doc.setTextColor(muted);

        doc.text(
          formatPrice(item.price),
          315,
          y
        );

        doc.text(
          safeText(item.quantity),
          410,
          y
        );

        doc.setFont(
          "helvetica",
          "bold"
        );
        doc.setTextColor(secondary);

        doc.text(
          formatPrice(itemTotal),
          pageWidth - margin - 20,
          y,
          {
            align: "right",
          }
        );

        y += 52;
      }
    );

    // ================= TOTAL =================

    y += 10;

    doc.setDrawColor(border);
    doc.line(
      margin,
      y,
      pageWidth - margin,
      y
    );

    y += 28;

    doc.setFont(
      "helvetica",
      "normal"
    );
    doc.setFontSize(11);
    doc.setTextColor(muted);

    doc.text(
      "Subtotal",
      pageWidth - 230,
      y
    );

    doc.text(
      formatPrice(order.totalPrice),
      pageWidth - margin,
      y,
      {
        align: "right",
      }
    );

    y += 24;

    doc.text(
      "Delivery",
      pageWidth - 230,
      y
    );

    doc.text(
      "Free",
      pageWidth - margin,
      y,
      {
        align: "right",
      }
    );

    y += 34;

    doc.setFillColor(primary);
    doc.roundedRect(
      pageWidth - 260,
      y - 18,
      220,
      52,
      12,
      12,
      "F"
    );

    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.setFontSize(13);
    doc.setTextColor("#FFFFFF");

    doc.text(
      "Grand Total",
      pageWidth - 240,
      y + 4
    );

    doc.text(
      formatPrice(order.totalPrice),
      pageWidth - 60,
      y + 4,
      {
        align: "right",
      }
    );

    // ================= FOOTER =================

    doc.setFont(
      "helvetica",
      "normal"
    );
    doc.setFontSize(9);
    doc.setTextColor(muted);

    doc.text(
      "Thank you for shopping with TechStore. This invoice is system generated.",
      pageWidth / 2,
      pageHeight - 45,
      {
        align: "center",
      }
    );

    const arrayBuffer =
      doc.output("arraybuffer");

    return Buffer.from(
      arrayBuffer
    );
  };