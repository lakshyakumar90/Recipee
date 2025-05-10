import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layouts
import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';

// Auth Guards
import { AuthGuard, GuestGuard } from './guards';

// Lazy loaded pages for better performance
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const RecipeDetails = lazy(() => import('./pages/RecipeDetails'));
const CreateRecipe = lazy(() => import('./pages/CreateRecipe'));
const MyRecipes = lazy(() => import('./pages/MyRecipes'));

// Legal and Contact pages
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));

// Loading component for lazy-loaded routes
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'recipes/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <RecipeDetails />
          </Suspense>
        ),
      },
      {
        path: 'create',
        element: (
          <AuthGuard>
            <Suspense fallback={<LoadingFallback />}>
              <CreateRecipe />
            </Suspense>
          </AuthGuard>
        ),
      },
      {
        path: 'my-recipes',
        element: (
          <AuthGuard>
            <Suspense fallback={<LoadingFallback />}>
              <MyRecipes />
            </Suspense>
          </AuthGuard>
        ),
      },
      {
        path: 'privacy-policy',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivacyPolicy />
          </Suspense>
        ),
      },
      {
        path: 'terms-of-service',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <TermsOfService />
          </Suspense>
        ),
      },
      {
        path: 'cookie-policy',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CookiePolicy />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: 'login',
        element: (
          <GuestGuard>
            <Suspense fallback={<LoadingFallback />}>
              <Login />
            </Suspense>
          </GuestGuard>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestGuard>
            <Suspense fallback={<LoadingFallback />}>
              <Register />
            </Suspense>
          </GuestGuard>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
