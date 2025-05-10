import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different error codes
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password.');
          break;
        default:
          setError('Failed to login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <ChefHat className="h-12 w-12 mx-auto text-primary mb-2" />
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Sign in to your account to continue
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Link to="#" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="••••••••"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </span>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link to="/auth/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </motion.div>
  );
};

export default Login;
