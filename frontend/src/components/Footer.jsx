import { Link } from 'react-router-dom';
import { ChefHat, Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <ChefHat className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">RecipeBook</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Discover, create, and share delicious recipes from around the world.
              Our platform makes it easy to find inspiration for your next meal.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/my-recipes" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  My Recipes
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Create Recipe
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} RecipeBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
