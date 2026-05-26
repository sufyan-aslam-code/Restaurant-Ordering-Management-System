import SibApiV3Sdk from "sib-api-v3-sdk";

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey =
  defaultClient.authentications["api-key"];

apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance =
  new SibApiV3Sdk.TransactionalEmailsApi();

export const sendMail = async ({
  to,
  subject,
  html,
}) => {
  try {
    const sendSmtpEmail =
      new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    sendSmtpEmail.sender = {
      name: "FoodFusion",
      email: process.env.SMTP_FROM,
    };

    sendSmtpEmail.to = [{ email: to }];

    const result =
      await apiInstance.sendTransacEmail(
        sendSmtpEmail
      );

    console.log(
      "✅ Email sent successfully:",
      result
    );

    return result;
  } catch (error) {
    console.error(
      "❌ Email sending failed:",
      error
    );

    throw error;
  }
};