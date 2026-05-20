import nodemailer from "nodemailer";
import { env } from "./env";

function createTransporter() {
  if (!env.EMAIL_HOST || !env.EMAIL_USER || !env.EMAIL_PASS) {
    console.warn("⚠ EMAIL_* env vars not configured — email sending disabled");
    return null;
  }

  return nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT || 587,
    secure: false,
    auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
    tls: { rejectUnauthorized: false },
  });
}

export const mailTransport = createTransporter();

export function buildContactHtml(name: string, email: string, message: string): string {
  return `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="540" cellpadding="0" cellspacing="0" style="background-color:#18181b;border:1px solid #27272a;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 0 32px;">
              <div style="width:40px;height:4px;background:linear-gradient(90deg,#7c3aed,#a78bfa);border-radius:2px;margin-bottom:24px;"></div>
              <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:#f4f4f5;letter-spacing:-0.3px;">
                ✦ Yeni İletişim Mesajı
              </h1>
              <p style="margin:0 0 24px 0;font-size:13px;color:#71717a;">Portfolyo sitenizden yeni bir mesaj alındı.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:16px;background-color:#27272a;border-radius:10px;margin-bottom:12px;">
                    <p style="margin:0 0 4px 0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#71717a;font-weight:600;">Gönderen</p>
                    <p style="margin:0;font-size:15px;color:#e4e4e7;font-weight:500;">${name}</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:16px;background-color:#27272a;border-radius:10px;margin-bottom:12px;">
                    <p style="margin:0 0 4px 0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#71717a;font-weight:600;">E-posta</p>
                    <a href="mailto:${email}" style="margin:0;font-size:15px;color:#a78bfa;text-decoration:none;font-weight:500;">${email}</a>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:16px;background-color:#27272a;border-radius:10px;">
                    <p style="margin:0 0 4px 0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#71717a;font-weight:600;">Mesaj</p>
                    <p style="margin:0;font-size:14px;color:#d4d4d8;line-height:1.6;white-space:pre-wrap;">${message}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 32px 32px;">
              <p style="margin:0;font-size:12px;color:#52525b;text-align:center;">
                Bu e-posta <span style="color:#7c3aed;font-weight:600;">furkan-celik</span> portfolyo iletişim formundan otomatik olarak gönderilmiştir.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
