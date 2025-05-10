# Firebase Cloud Functions for RecipeBook

This directory contains Firebase Cloud Functions for the RecipeBook application.

## Contact Form Email Function

The `sendContactEmail` function handles sending emails when users submit the contact form. It sends an email to the site owner and a confirmation email to the user.

### Setup Instructions

1. Install the Firebase CLI if you haven't already:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Initialize Firebase in your project (if not already done):
   ```
   firebase init
   ```
   Select "Functions" when prompted for which features to set up.

4. Install dependencies:
   ```
   cd functions
   npm install
   ```

5. Set up environment variables for the email service:
   ```
   firebase functions:config:set email.user="your-email@gmail.com" email.password="your-app-password" email.recipient="your-recipient-email@example.com"
   ```

   Note: If using Gmail, you'll need to create an "App Password" in your Google Account settings rather than using your regular password.

6. Update the code in `index.js` to use these environment variables:
   ```javascript
   const EMAIL_USER = functions.config().email.user;
   const EMAIL_PASSWORD = functions.config().email.password;
   const RECIPIENT_EMAIL = functions.config().email.recipient;
   
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: EMAIL_USER,
       pass: EMAIL_PASSWORD,
     },
   });
   ```

7. Deploy the functions:
   ```
   firebase deploy --only functions
   ```

## Testing

You can test the function locally using the Firebase Emulator:

```
firebase emulators:start
```

## Troubleshooting

- If you're using Gmail and encounter authentication issues, make sure you're using an App Password and not your regular account password.
- Check the Firebase Functions logs for detailed error messages:
  ```
  firebase functions:log
  ```
- Make sure your email service provider allows sending emails from your application.
