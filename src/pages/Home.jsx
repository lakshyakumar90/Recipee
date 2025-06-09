import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ChefHat, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import supabase from '@/config/supabase';
import SearchFilters from '@/components/SearchFilters';
import DietaryBadge from '@/components/DietaryBadge';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

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

  // Filter and sort recipes based on search query, filters, and sorting
  useEffect(() => {
    let filtered = [...recipes];

    // Apply search query filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(recipe => {
        const query = searchQuery.toLowerCase();

        // Search in title and description
        if (recipe.title.toLowerCase().includes(query) ||
            recipe.description.toLowerCase().includes(query)) {
          return true;
        }

        // Search in tags
        if (recipe.tags && recipe.tags.some(tag =>
          tag.toLowerCase().includes(query)
        )) {
          return true;
        }

        // Search in ingredients (with safe JSON parsing)
        if (recipe.ingredients) {
          try {
            let ingredients = recipe.ingredients;
            if (typeof ingredients === 'string') {
              ingredients = JSON.parse(ingredients);
            }
            if (Array.isArray(ingredients) && ingredients.some(ingredient =>
              ingredient.toLowerCase().includes(query)
            )) {
              return true;
            }
          } catch (err) {
            // If JSON parsing fails, try searching the raw string
            if (typeof recipe.ingredients === 'string' &&
                recipe.ingredients.toLowerCase().includes(query)) {
              return true;
            }
          }
        }

        return false;
      });
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(recipe => recipe.difficulty === filters.difficulty);
    }

    // Apply cook time filters
    if (filters.maxCookTime) {
      filtered = filtered.filter(recipe => {
        const cookTime = parseInt(recipe.cookTime) || 30;
        return cookTime <= filters.maxCookTime;
      });
    }

    if (filters.minCookTime) {
      filtered = filtered.filter(recipe => {
        const cookTime = parseInt(recipe.cookTime) || 30;
        return cookTime >= filters.minCookTime;
      });
    }

    // Apply servings filters
    if (filters.minServings) {
      filtered = filtered.filter(recipe => {
        const servings = parseInt(recipe.servings) || 4;
        return servings >= filters.minServings;
      });
    }

    if (filters.maxServings) {
      filtered = filtered.filter(recipe => {
        const servings = parseInt(recipe.servings) || 4;
        return servings <= filters.maxServings;
      });
    }

    // Apply cuisine filter
    if (filters.cuisine) {
      filtered = filtered.filter(recipe =>
        recipe.tags && recipe.tags.some(tag =>
          tag.toLowerCase().includes(filters.cuisine.toLowerCase())
        )
      );
    }

    // Apply dietary filter
    if (filters.dietary) {
      filtered = filtered.filter(recipe =>
        recipe.tags && recipe.tags.some(tag =>
          tag.toLowerCase().includes(filters.dietary.toLowerCase())
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'cook_time':
          aValue = parseInt(a.cookTime) || 30;
          bValue = parseInt(b.cookTime) || 30;
          break;
        case 'created_at':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    setFilteredRecipes(filtered);
  }, [searchQuery, filters, recipes, sortBy, sortOrder]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = ({ sortBy: newSortBy, sortOrder: newSortOrder }) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

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
        <SearchFilters
          onSearch={handleSearch}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
          initialFilters={filters}
        />
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
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors flex-1">
                          {recipe.title}
                        </h3>
                        <DietaryBadge tags={recipe.tags} size="xs" />
                      </div>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {recipe.cookTime || '30'} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {recipe.servings || '4'}
                          </span>
                        </div>
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">
                          {recipe.difficulty || 'Medium'}
                        </span>
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


