import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment file from project root
const __dirname = dirname(fileURLToPath(import.meta.url));
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env.development';
dotenv.config({ path: resolve(__dirname, '..', envFile) });

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json());

// Microsoft 365 SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,        // ditmir@ukapfoundation.org
    pass: process.env.SMTP_PASS,        // Your password or app password
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, phone, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"UKAP Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'ditmir@ukapfoundation.org',
      replyTo: email,
      subject: `New Contact: ${firstName} ${lastName}`,
      headers: {
        'Reply-To': email,
      },
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p><em>Reply directly to this email to respond to ${firstName} ${lastName}</em></p>
      `,
    });

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

