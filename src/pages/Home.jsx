import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, ChefHat, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import supabase from '@/config/supabase';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Fetch recipes from Supabase
        const { data: recipesData, error } = await supabase
          .from('recipes')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) {
          throw error;
        }

        const recipesList = [];

        for (const recipe of recipesData) {
          // Fetch image URL from Supabase storage for each recipe
          let imageUrl = null;
          if (recipe.image_path) {
            try {
              const { data } = await supabase
                .storage
                .from('recipe-images')  // Corrected bucket name
                .getPublicUrl(recipe.image_path);

              if (data) {
                imageUrl = data.publicUrl;
              }
            } catch (err) {
              console.error('Error getting image URL:', err);
            }
          }

          recipesList.push({
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            cookTime: recipe.cook_time,
            servings: recipe.servings,
            difficulty: recipe.difficulty,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            tags: recipe.tags,
            userId: recipe.user_id,
            createdAt: recipe.created_at,
            imageUrl: imageUrl || 'https://via.placeholder.com/300x200?text=No+Image',
          });
        }

        setRecipes(recipesList);
        setFilteredRecipes(recipesList);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Filter recipes based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.tags && recipe.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
      setFilteredRecipes(filtered);
    }
  }, [searchQuery, recipes]);

  // Animation variants for staggered list
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 md:p-12"
        >
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Discover & Share Amazing Recipes
            </h1>
            <p className="text-muted-foreground mb-6">
              Find inspiration for your next meal, save your favorites, and share your culinary creations with the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/create">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Recipe
                </Button>
              </Link>
              <Link to="/my-recipes">
                <Button variant="outline" className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4" />
                  My Recipes
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Search Section */}
      <section className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Search recipes by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </section>

      {/* Recipes Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Recipes</h2>

        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No recipes found. Try a different search term or create a new recipe!</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRecipes.map((recipe) => (
              <motion.div key={recipe.id} variants={item}>
                <Link to={`/recipes/${recipe.id}`} className="block group">
                  <div className="bg-card border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{recipe.cookTime || '30 mins'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Home;


