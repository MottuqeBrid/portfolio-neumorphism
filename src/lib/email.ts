import { BrevoClient } from "@getbrevo/brevo";

export const sendEmail = async (
  from = "info@brid.bd",
  to: string,
  body: string,
  subject = "Email from M-Note",
  name = "MBSS",
) => {
  const apiKey = process.env.BREVO_API_KEY as string;
  const brevo = new BrevoClient({ apiKey: apiKey });
  const result = await brevo.transactionalEmails.sendTransacEmail({
    subject: subject,
    htmlContent: body,
    sender: { name: name, email: from },
    to: [{ email: to }],
  });
  return result;
};
