import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { 
    email,
    recipients = [],
    emailSubjectPrefix = '[UKAP]',
    formName = 'Contact Form',
    subjectField,
    attachments = [],
    ...formFields
  } = req.body;

  // Validate email (always required)
  if (!email) {
    return res.status(400).json({ 
      message: 'Email is required',
      errors: { email: 'Email is required' }
    });
  }

  // Build recipient list
  let toAddresses = [];
  
  if (recipients && recipients.length > 0) {
    toAddresses = recipients.filter(r => r && typeof r === 'string');
  }
  
  const defaultEmail = process.env.CONTACT_EMAIL;
  if (defaultEmail && !toAddresses.includes(defaultEmail)) {
    toAddresses.push(defaultEmail);
  }
  
  if (toAddresses.length === 0) {
    toAddresses = ['ditmir@ukapfoundation.org'];
  }

  // Microsoft 365 SMTP settings
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      ciphers: 'SSLv3',
    },
  });

  // Build subject line
  let emailSubject = `${emailSubjectPrefix} New submission from ${formName}`;
  if (subjectField && formFields[subjectField]) {
    emailSubject = `${emailSubjectPrefix} ${formFields[subjectField]}`;
  }

  // Build dynamic fields HTML (excluding internal fields)
  const excludeFields = ['recipients', 'emailSubjectPrefix', 'formName', 'subjectField', 'attachments'];
  const fieldsHtml = Object.entries(formFields)
    .filter(([key]) => !excludeFields.includes(key))
    .map(([key, value]) => {
      const displayName = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/_/g, ' ');
      
      const displayValue = Array.isArray(value) ? value.join(', ') : value;
      
      return `
        <tr>
          <td style="padding: 10px 0; color: #999; vertical-align: top; width: 140px; border-bottom: 1px solid rgba(255,255,255,0.05);">
            ${displayName}:
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
            ${displayValue || '<span style="color: #666;">Not provided</span>'}
          </td>
        </tr>
      `;
    })
    .join('');

  // Process attachments for nodemailer
  const emailAttachments = attachments.map(file => {
    // file.data is a base64 data URL like "data:application/pdf;base64,..."
    const matches = file.data.match(/^data:(.+);base64,(.+)$/);
    if (matches) {
      return {
        filename: file.name,
        content: matches[2],
        encoding: 'base64',
        contentType: matches[1],
      };
    }
    return null;
  }).filter(Boolean);

  // Attachments info for email body
  const attachmentsHtml = emailAttachments.length > 0 ? `
    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
      <p style="margin: 0 0 12px; color: #999; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
        📎 Attachments (${emailAttachments.length})
      </p>
      <ul style="margin: 0; padding: 0; list-style: none;">
        ${emailAttachments.map(a => `
          <li style="padding: 8px 12px; background: rgba(255,255,255,0.05); border-radius: 6px; margin-bottom: 6px; font-size: 14px;">
            📄 ${a.filename}
          </li>
        `).join('')}
      </ul>
    </div>
  ` : '';

  try {
    await transporter.sendMail({
      from: `"${formName}" <${process.env.SMTP_USER}>`,
      to: toAddresses.join(', '),
      replyTo: email,
      subject: emailSubject,
      attachments: emailAttachments,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: #0a0a0f;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7c59f 100%); padding: 24px 32px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #0a0a0f; font-size: 20px; font-weight: 600;">
                New Form Submission
              </h1>
              <p style="margin: 6px 0 0; color: rgba(0,0,0,0.7); font-size: 14px;">
                ${formName}
              </p>
            </div>
            
            <!-- Content -->
            <div style="background: #1a1a1f; padding: 32px; color: #fafafa;">
              <!-- Email (Primary) -->
              <div style="background: rgba(255, 107, 53, 0.1); border: 1px solid rgba(255, 107, 53, 0.3); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0 0 4px; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                  From
                </p>
                <a href="mailto:${email}" style="color: #ff6b35; font-size: 18px; text-decoration: none; font-weight: 500;">
                  ${email}
                </a>
              </div>
              
              <!-- Dynamic Fields -->
              <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                ${fieldsHtml}
              </table>
              
              <!-- Attachments -->
              ${attachmentsHtml}
            </div>
            
            <!-- Footer -->
            <div style="background: #141418; padding: 20px 32px; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 13px;">
                Reply directly to this email to respond to the sender
              </p>
              ${toAddresses.length > 1 ? `
                <p style="margin: 10px 0 0; color: #444; font-size: 12px;">
                  Sent to ${toAddresses.length} recipients
                </p>
              ` : ''}
            </div>
          </div>
        </body>
        </html>
      `,
    });

    res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit form' });
  }
}
