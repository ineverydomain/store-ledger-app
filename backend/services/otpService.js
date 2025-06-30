const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Email configuration
const emailTransporter = nodemailer.createTransporter({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Twilio configuration
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendEmailOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Store Ledger - Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Store Ledger Verification</h2>
        <p>Your verification code is:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #1f2937; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  };

  await emailTransporter.sendMail(mailOptions);
};

const sendSMSOTP = async (phone, otp) => {
  await twilioClient.messages.create({
    body: `Your Store Ledger verification code is: ${otp}. This code expires in 10 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });
};

const sendOTP = async (identifier, otp, verificationType) => {
  try {
    if (verificationType === 'email') {
      await sendEmailOTP(identifier, otp);
    } else if (verificationType === 'phone') {
      await sendSMSOTP(identifier, otp);
    }
    console.log(`OTP sent to ${identifier}: ${otp}`);
  } catch (error) {
    console.error('Error sending OTP:', error);
    // In development, log the OTP to console
    if (process.env.NODE_ENV === 'development') {
      console.log(`Development OTP for ${identifier}: ${otp}`);
    }
    throw error;
  }
};

module.exports = { sendOTP };