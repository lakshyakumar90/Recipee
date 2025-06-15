import { Link } from 'react-router-dom';
import { ChefHat, Github, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-8">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <ChefHat className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">RecipeBook</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4 w-2/3">
              Discover, create, and share delicious recipes from around the world.
              Our platform makes it easy to find inspiration for your next meal.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/lakshyakumar90/" target='_blank' className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/kumar-lakshya" target='_blank' className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4">
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
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} RecipeBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
