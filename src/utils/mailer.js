import { createTransport } from "nodemailer";
import { config } from "dotenv";
config();
const vars = process.env;

export const transporter = createTransport({
  port: vars.SMTP_PORT,
  host: vars.SMTP_HOST,
  auth: {
    user: vars.SMTP_USER,
    pass: vars.SMTP_PASS,
  },
  secure: true,
});
