import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config()

const mailRouter = express.Router();

mailRouter.post('/send-email', async (req: Request, res: Response) => {
  try {
    const { to, subject, text } = req.body;

    // Use environment variables for email server details
    const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

export default mailRouter;
