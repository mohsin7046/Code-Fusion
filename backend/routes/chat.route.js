import { Router } from "express";
import nodemailer from 'nodemailer'

const route = Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });
  
  route.post('/send-email', async (req, res) => {
    const { to, link } = req.body;
  
    if (!to || !link) {
      return res.status(400).json({ error: 'Email and link are required' });
    }
  
    try {
      await transporter.sendMail({
        from: process.env.USER,
        to,
        subject: 'Meeting Invitation',
        text: `You have been invited to a meeting. Join using this link: ${link}`,
      });
  
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  export default route;