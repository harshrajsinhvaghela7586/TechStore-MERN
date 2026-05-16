import nodemailer from "nodemailer";

export const sendEmail = async ({
  to,
  subject,
  html,
  attachments = [],
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: Buffer;
    contentType?: string;
  }[];
}) => {
  const transporter =
    nodemailer.createTransport({
      service: "gmail",

      auth: {
        user:
          process.env.EMAIL_USER,

        pass:
          process.env.EMAIL_PASS,
      },
    });

  await transporter.sendMail({
    from: `"TechStore" <${process.env.EMAIL_USER}>`,

    to,

    subject,

    html,

    attachments,
  });
};