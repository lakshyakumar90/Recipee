# RecipeBook

A web application for discovering, creating, and sharing recipes.

## Features

- User authentication with Firebase
- Create and share recipes
- Save favorite recipes
- Search for recipes
- Responsive design with TailwindCSS and shadcn/ui
- Animations with Framer Motion
- Legal pages (Privacy Policy, Terms of Service, Cookie Policy)
- Contact form with email functionality

## Technology Stack

- **Frontend**: React, TailwindCSS, shadcn/ui, Framer Motion
- **Authentication**: Firebase Authentication
- **Database & Storage**: Supabase
- **Backend Functions**: Firebase Cloud Functions

## Pages Structure

### Main Pages
- `/` - Home page with recipe listings
- `/recipes/:id` - Recipe details page
- `/create` - Create new recipe page
- `/my-recipes` - User's recipes page
- `/auth/login` - Login page
- `/auth/register` - Registration page

### Legal and Contact Pages
- `/privacy-policy` - Privacy Policy page
- `/terms-of-service` - Terms of Service page
- `/cookie-policy` - Cookie Policy page
- `/contact` - Contact Us page

## Contact Form Email Functionality

The Contact Us page includes a form that sends emails to the site owner when submitted. This functionality is implemented using Firebase Cloud Functions.

### Setting Up the Contact Form Email Function

1. Navigate to the `functions` directory
2. Follow the instructions in the `functions/README.md` file to set up the Firebase Cloud Functions
3. Make sure to set the environment variables for the email service as described in the README

## Development

To run the application locally:

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. To test the contact form email functionality, you'll need to set up and run the Firebase emulators:
   ```
   cd functions
   npm install
   firebase emulators:start
   ```

## Deployment

To deploy the application:

1. Deploy the frontend:
   ```
   cd frontend
   npm run build
   ```

2. Deploy the Firebase functions:
   ```
   cd functions
   firebase deploy --only functions
   ```