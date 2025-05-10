import { useRouteError, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Oops!</h1>
        <p className="text-xl mb-6">Something went wrong</p>
        
        <div className="bg-muted p-4 rounded-md mb-6 text-left">
          <p className="text-sm font-mono">
            {error?.statusText || error?.message || 'An unexpected error occurred'}
          </p>
        </div>
        
        <Link to="/">
          <Button className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
