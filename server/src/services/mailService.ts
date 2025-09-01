// server/src/services/mailService.ts
import { MailtrapTransport } from 'mailtrap'
import nodemailer, { type SentMessageInfo } from 'nodemailer'
import pRetry from 'p-retry'

const transport = nodemailer.createTransport(
  MailtrapTransport({ token: process.env.MAILTRAP_TOKEN! })
)

export async function sendVerificationEmail(email: string, verificationToken: string) {
  const appUrl = process.env.APP_WEB_URL || 'http://localhost:5173'
  const verifyUrl = `${appUrl}/verify-email?token=${verificationToken}`

  const subject = 'Verify your email'

  const text = [
    'Welcome to Intelli-Factory!',
    '',
    'Please verify your email by opening this link:',
    verifyUrl,
    '',
    'If you did not create this account, you can ignore this message.',
  ].join('\n')

  const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verify your email</title>
    <!-- Preheader text (hidden in body, shown in inbox preview) -->
    <style>
      .preheader { display:none!important; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; mso-hide:all; }
      @media only screen and (max-width:600px) {
        .container { width:100%!important; }
      }
      a { color:#2563eb; }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#f6f7f9;">
    <div class="preheader">Welcome to Intelli-Factory — confirm your email to get started.</div>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="background:#f6f7f9; padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="max-width:600px; width:100%; background:#ffffff; border-radius:10px; overflow:hidden;">
            <tr>
              <td style="padding:24px; font-family:-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#111827; line-height:1.5;">
                <h2 style="margin:0 0 12px 0; font-size:20px; font-weight:700;">Verify your email</h2>
                <p style="margin:0 0 16px 0;">Welcome to <strong>Intelli-Factory</strong>! Click the button below to confirm your address.</p>

                <!-- Button -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
                  <tr>
                    <td align="center" bgcolor="#2563eb" style="border-radius:8px;">
                      <a href="${verifyUrl}"
                         style="display:inline-block; padding:12px 18px; font-weight:600; text-decoration:none; color:#ffffff; font-family:-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-size:14px;">
                        Verify Email
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:16px 0 0 0; font-size:14px; color:#4b5563;">
                  Or copy this link into your browser:<br>
                  <a href="${verifyUrl}" style="word-break:break-all;">${verifyUrl}</a>
                </p>

                <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;">
                <p style="margin:0; font-size:12px; color:#6b7280;">
                  If you didn’t request this, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px 24px; font-family:-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-size:12px; color:#6b7280; background:#f9fafb;">
                Intelli-Factory • <a href="${appUrl}" style="text-decoration:none; color:#2563eb;">
  ${appUrl.replace(/^https?:\/\//, '')}
</a>
              </td>
            </tr>
          </table>

          <!-- Small spacer -->
          <div style="height:24px; line-height:24px;">&nbsp;</div>
        </td>
      </tr>
    </table>
  </body>
</html>
`

  const info = await pRetry<SentMessageInfo>(
    () =>
      transport.sendMail({
        from: {
          address: process.env.FROM_ADDRESS || 'noreply@intelli-factory.xyz',
          name: process.env.FROM_NAME || 'Intelli-Factory',
        },
        to: [email],
        subject,
        text,
        html,
      }),
    { retries: 4, minTimeout: 800, factor: 2, randomize: true }
  )

  console.log('[mail] sent', { email, messageId: info.messageId })
  return info
}
