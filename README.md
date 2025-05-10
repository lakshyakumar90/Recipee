# RecipeBook

A modern web application for discovering, creating, and sharing delicious recipes.

## Features

- **User Authentication**: Secure login and registration with Firebase Authentication
- **Recipe Management**: Create, view, edit, and delete your own recipes
- **Recipe Sharing**: Share your culinary creations with the community
- **Favorites**: Save recipes you love for quick access
- **Search Functionality**: Find recipes by name, description, or tags
- **Responsive Design**: Beautiful UI with TailwindCSS and shadcn/ui components
- **Smooth Animations**: Enhanced user experience with Framer Motion
- **Legal Pages**: Comprehensive Privacy Policy, Terms of Service, and Cookie Policy

## Technology Stack

- **Frontend Framework**: React 19 with Vite
- **Styling**: TailwindCSS 4 with shadcn/ui components
- **Animations**: Framer Motion
- **Authentication**: Firebase Authentication
- **Database & Storage**: Supabase
- **State Management**: React's built-in hooks
- **Routing**: React Router v6
- **Form Handling**: Custom form implementation

## Pages Structure

### Main Pages
- `/` - Home page with featured recipes and search functionality
- `/recipes/:id` - Detailed view of a specific recipe
- `/create` - Form to create new recipes (authenticated users only)
- `/my-recipes` - Dashboard for managing your recipes (authenticated users only)
- `/auth/login` - User login page
- `/auth/register` - New user registration page

### Legal and Contact Pages
- `/privacy-policy` - Privacy Policy page
- `/terms-of-service` - Terms of Service page
- `/cookie-policy` - Cookie Policy page

## Environment Setup

This project requires the following environment variables:

### Firebase Configuration
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Supabase Configuration
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_SERVICE_KEY=your_supabase_service_key
```

## Development

To run the application locally:

1. Clone the repository:
   ```
   git clone https://github.com/lakshyakumar90/Recipee.git
   cd Recipee
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the required environment variables

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To build the application for production:

```
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to your hosting provider of choice.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.