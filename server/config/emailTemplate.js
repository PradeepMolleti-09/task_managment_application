export const Email_Verify_template = (otp) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
</head>

<body style="background-color:#ffffff; font-family:Inter, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="700" style="background:#f9f9fb; border-radius:8px; padding:40px;">
          
          <tr>
            <td align="center">
              <h1 style="color:#1e40ff;">Verify Your Email Address</h1>
            </td>
          </tr>

          <tr>
            <td style="color:#4a4f5f; font-size:16px; line-height:1.6;">
              <p>Thank you for creating an account.</p>
              <p>Please use the following One-Time Password (OTP) to verify your email address:</p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px 0;">
              <div style="
                font-size:32px;
                letter-spacing:8px;
                font-weight:600;
                color:#1e40ff;
              ">
                ${otp}
              </div>
            </td>
          </tr>

          <tr>
            <td style="color:#4a4f5f; font-size:14px;">
              <p>This OTP is valid for <strong>10 minutes</strong>.</p>
              <p>If you did not create this account, you can safely ignore this email.</p>
            </td>
          </tr>

          <tr>
            <td align="center" style="font-size:12px; color:#777; padding-top:30px;">
              © 2025 Auth System. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;


export const Password_Rest_template = (otp) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Password Reset</title>
</head>

<body style="background-color:#ffffff; font-family:Inter, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="700" style="background:#f9f9fb; border-radius:8px; padding:40px;">

          <tr>
            <td align="center">
              <h1 style="color:#1e40ff;">Password Reset Request</h1>
            </td>
          </tr>

          <tr>
            <td style="color:#4a4f5f; font-size:16px; line-height:1.6;">
              <p>We received a request to reset your account password.</p>
              <p>Please use the OTP below to proceed:</p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px 0;">
              <div style="
                font-size:32px;
                letter-spacing:8px;
                font-weight:600;
                color:#ef4444;
              ">
                ${otp}
              </div>
            </td>
          </tr>

          <tr>
            <td style="color:#4a4f5f; font-size:14px;">
              <p>This OTP is valid for <strong>10 minutes</strong>.</p>
              <p>If you did not request a password reset, please ignore this email.</p>
            </td>
          </tr>

          <tr>
            <td align="center" style="font-size:12px; color:#777; padding-top:30px;">
              © 2025 Auth System. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;


export const Brute_Froce_Template = () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Security Alert</title>
</head>

<body style="background-color:#ffffff; font-family:Inter, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="700" style="background:#fff5f5; border-radius:8px; padding:40px;">

          <tr>
            <td align="center">
              <h1 style="color:#dc2626;">⚠️ Security Alert</h1>
            </td>
          </tr>

          <tr>
            <td style="color:#4a4f5f; font-size:16px; line-height:1.6;">
              <p>We detected <strong>multiple failed login attempts</strong> on your account.</p>
              <p>To protect your account, it has been temporarily locked.</p>
            </td>
          </tr>

          <tr>
            <td style="background:#fee2e2; padding:15px; border-left:4px solid #dc2626;">
              <p><strong>Account Status:</strong> Locked</p>
              <p><strong>Lock Duration:</strong> 15 minutes</p>
              <p><strong>Reason:</strong> Brute-force attack protection</p>
            </td>
          </tr>

          <tr>
            <td style="color:#4a4f5f; font-size:14px; padding-top:15px;">
              <p>If this was not you, we strongly recommend resetting your password after the lock period.</p>
            </td>
          </tr>

          <tr>
            <td align="center" style="font-size:12px; color:#777; padding-top:30px;">
              This is an automated security alert. Please do not reply.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

