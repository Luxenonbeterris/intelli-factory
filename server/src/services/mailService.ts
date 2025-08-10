// server/src/services/mailService.ts
import { MailtrapTransport } from 'mailtrap'
import nodemailer from 'nodemailer'

const mailtrapToken = process.env.MAILTRAP_TOKEN
if (!mailtrapToken) {
  throw new Error('MAILTRAP_TOKEN is not set in environment variables')
}

const transport = nodemailer.createTransport(MailtrapTransport({ token: mailtrapToken }))

// Письмо ведёт на фронт: {APP_WEB_URL}/verify-email?token=...
export async function sendVerificationEmail(email: string, verificationToken: string) {
  const appUrl = process.env.APP_WEB_URL || 'http://localhost:5173' // фронтовый dev-порт
  const verifyUrl = `${appUrl}/verify-email?token=${verificationToken}`

  await transport.sendMail({
    from: {
      address: process.env.FROM_ADDRESS || 'noreply@intelli-factory.xyz',
      name: process.env.FROM_NAME || 'Intelli-Factory',
    },
    to: [email],
    subject: 'Email Verification',
    text: `Open the verification link: ${verifyUrl}`,
    html: `
  <div style="font-family: sans-serif; font-size: 16px; color: #333;">
    <p>Click the button below to verify your email:</p>
    <p>
      <a href="${verifyUrl}"
         style="
           display: inline-block;
           padding: 10px 20px;
           background-color: #2563eb;
           color: #fff;
           text-decoration: none;
           border-radius: 6px;
           font-weight: bold;
         ">
         Verify Email
      </a>
    </p>
    <p style="font-size: 14px; color: #666;">
      Or copy this link into your browser:<br/>
      <a href="${verifyUrl}" style="color: #2563eb;">${verifyUrl}</a>
    </p>
  </div>
`,
  })
}
