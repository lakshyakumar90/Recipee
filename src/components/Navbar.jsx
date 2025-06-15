import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ChefHat, LogOut, User, Plus, BookOpen, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">RecipeBook</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            {user && (
              <>
                <Link to="/my-recipes" className="text-foreground hover:text-primary transition-colors">
                  My Recipes
                </Link>
                <Link to="/create">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Recipe
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  {user.displayName || user.email}
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-card border-t"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <Link to="/" className="block py-2 text-foreground hover:text-primary" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            {user ? (
              <>
                <Link to="/my-recipes" className="block py-2 text-foreground hover:text-primary" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    My Recipes
                  </div>
                </Link>
                <Link to="/create" className="block py-2 text-foreground hover:text-primary" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Recipe
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left py-2 text-foreground hover:text-primary"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="block py-2 text-foreground hover:text-primary" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Login
                  </div>
                </Link>
                <Link to="/auth/register" className="block py-2 text-foreground hover:text-primary" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Register
                  </div>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
