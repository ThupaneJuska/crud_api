// controllers/emailController.js
const nodemailer = require('nodemailer');

const sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use 'smtp.mailtrap.io', 'hotmail', etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent', info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Email failed to send', error });
  }
};

module.exports = { sendEmail };
