import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RecipeDetails from './pages/RecipeDetails';
import CreateRecipe from './pages/CreateRecipe';
import EditRecipe from './pages/EditRecipe';
import MyRecipes from './pages/MyRecipes';

// Auth Guards
import { AuthGuard, GuestGuard } from './guards';

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
        element: <RecipeDetails />,
      },
      {
        path: 'create',
        element: (
          <AuthGuard>
            <CreateRecipe />
          </AuthGuard>
        ),
      },
      {
        path: 'edit/:id',
        element: (
          <AuthGuard>
            <EditRecipe />
          </AuthGuard>
        ),
      },
      {
        path: 'my-recipes',
        element: (
          <AuthGuard>
            <MyRecipes />
          </AuthGuard>
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
            <Login />
          </GuestGuard>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestGuard>
            <Register />
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
