const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure nodemailer with your email service credentials
// Get configuration values from Firebase config
const EMAIL_USER = functions.config().email?.user;
const EMAIL_PASSWORD = functions.config().email?.password;
const RECIPIENT_EMAIL = functions.config().email?.recipient;

// Check if email configuration is set
if (!EMAIL_USER || !EMAIL_PASSWORD || !RECIPIENT_EMAIL) {
  console.error('Email configuration is missing. Please set email.user, email.password, and email.recipient in Firebase config.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail', // or another email service
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

exports.sendContactEmail = functions.https.onCall(async (data, context) => {
  try {
    // Basic validation
    if (!data.name || !data.email || !data.subject || !data.message) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields'
      );
    }

    // Email content
    const mailOptions = {
      from: `RecipeBook Contact <${EMAIL_USER}>`,
      to: RECIPIENT_EMAIL,
      subject: `RecipeBook Contact: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Optional: Send confirmation email to the user
    const confirmationMailOptions = {
      from: `RecipeBook <${EMAIL_USER}>`,
      to: data.email,
      subject: 'We received your message',
      html: `
        <h2>Thank you for contacting RecipeBook!</h2>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Here's a copy of your message:</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(confirmationMailOptions);

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError(
      'internal',
      'There was an error sending your message'
    );
  }
});
