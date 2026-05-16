const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
};

export const buildOrderEmailHtml = ({
  userName,
  orderId,
  orderItems,
  totalPrice,
  shippingAddress,
}: {
  userName: string;
  orderId: string;
  orderItems: any[];
  totalPrice: number;
  shippingAddress: any;
}) => {
  const itemsHtml = orderItems
    .map((item) => {
      const itemTotal =
        Number(item.price || 0) *
        Number(item.quantity || 0);

      return `
        <tr>
          <td style="padding:14px;border-bottom:1px solid #e5e7eb;">
            <div style="font-weight:700;color:#111827;font-size:14px;">
              ${item.title}
            </div>
            <div style="color:#6b7280;font-size:12px;margin-top:4px;">
              Qty: ${item.quantity}
            </div>
          </td>

          <td style="padding:14px;border-bottom:1px solid #e5e7eb;text-align:right;color:#111827;font-weight:700;">
            ${formatPrice(itemTotal)}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:30px 0;">
        <tr>
          <td align="center">
            <table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:22px;overflow:hidden;border:1px solid #e5e7eb;">
              
              <tr>
                <td style="background:#0B1120;padding:34px 38px;">
                  <div style="color:#ffffff;font-size:30px;font-weight:900;letter-spacing:-1px;">
                    TechStore
                  </div>

                  <div style="color:#67e8f9;font-size:12px;font-weight:700;margin-top:8px;letter-spacing:1px;">
                    ORDER CONFIRMED
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:38px;">
                  <h1 style="margin:0;color:#111827;font-size:28px;line-height:36px;">
                    Thanks for your order, ${userName}
                  </h1>

                  <p style="margin:16px 0 0;color:#4b5563;font-size:15px;line-height:24px;">
                    Your payment was successful and your order has been placed. We have attached your invoice PDF with this email.
                  </p>

                  <div style="margin-top:26px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:18px;padding:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <div style="color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;">
                            Order ID
                          </div>
                          <div style="color:#111827;font-size:14px;font-weight:800;margin-top:6px;">
                            #${orderId}
                          </div>
                        </td>

                        <td align="right">
                          <div style="color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;">
                            Payment
                          </div>
                          <div style="color:#16a34a;font-size:14px;font-weight:800;margin-top:6px;">
                            Paid
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <h2 style="margin:34px 0 14px;color:#111827;font-size:20px;">
                    Order Summary
                  </h2>

                  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
                    ${itemsHtml}

                    <tr>
                      <td style="padding:18px;background:#0B1120;color:#ffffff;font-weight:900;font-size:16px;">
                        Grand Total
                      </td>

                      <td style="padding:18px;background:#0B1120;color:#ffffff;font-weight:900;font-size:16px;text-align:right;">
                        ${formatPrice(totalPrice)}
                      </td>
                    </tr>
                  </table>

                  <h2 style="margin:34px 0 14px;color:#111827;font-size:20px;">
                    Delivery Address
                  </h2>

                  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:16px;padding:18px;color:#374151;font-size:14px;line-height:24px;">
                    <strong>${shippingAddress?.fullName || ""}</strong><br/>
                    ${shippingAddress?.address || ""}<br/>
                    ${shippingAddress?.city || ""} - ${shippingAddress?.pincode || ""}<br/>
                    Phone: ${shippingAddress?.phone || ""}
                  </div>

                  <p style="margin:34px 0 0;color:#6b7280;font-size:13px;line-height:22px;">
                    You can view your order details anytime from the My Orders section in your TechStore account.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:22px 38px;background:#f9fafb;color:#6b7280;font-size:12px;text-align:center;border-top:1px solid #e5e7eb;">
                  This is an automated email from TechStore. Please do not reply to this message.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
};