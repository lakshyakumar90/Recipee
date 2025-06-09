import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Plus, BookmarkCheck, ChefHat, Search, Edit, Trash2, MoreVertical, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import supabase from '@/config/supabase';
import { v4 as uuidv4 } from 'uuid';
import DietaryBadge from '@/components/DietaryBadge';

const MyRecipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Get or create UUID mapping for this user
        let userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
        let userUuid = userMappings[user.uid];

        // If no mapping exists, create one
        if (!userUuid) {
          userUuid = uuidv4();
          userMappings[user.uid] = userUuid;
          localStorage.setItem('userMappings', JSON.stringify(userMappings));

          // Since this is a new mapping, the user won't have any recipes yet
          setLoading(false);
          return;
        }

        // Fetch user's created recipes from Supabase using the UUID
        const { data: userRecipes, error: userRecipesError } = await supabase
          .from('recipes')
          .select('*')
          .eq('user_id', userUuid)  // Use the UUID instead of Firebase UID
          .order('created_at', { ascending: false });

        if (userRecipesError) {
          throw userRecipesError;
        }

        const recipesList = [];

        for (const recipe of userRecipes) {
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
                console.log('Recipe image URL:', imageUrl); // Debug log
              }
            } catch (err) {
              console.error('Error getting image URL:', err);
            }
          }

          // Parse JSON strings if needed
          let ingredients = recipe.ingredients;
          let instructions = recipe.instructions;

          // Check if ingredients and instructions are strings that need parsing
          if (typeof ingredients === 'string') {
            try {
              ingredients = JSON.parse(ingredients);
            } catch (e) {
              console.error('Error parsing ingredients:', e);
            }
          }

          if (typeof instructions === 'string') {
            try {
              instructions = JSON.parse(instructions);
            } catch (e) {
              console.error('Error parsing instructions:', e);
            }
          }

          recipesList.push({
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            cookTime: recipe.cook_time,
            servings: recipe.servings,
            difficulty: recipe.difficulty,
            ingredients: ingredients,
            instructions: instructions,
            tags: recipe.tags,
            userId: recipe.user_id,
            createdAt: recipe.created_at,
            imageUrl: imageUrl || 'https://via.placeholder.com/300x200?text=No+Image',
            imagePath: recipe.image_path,
          });
        }

        setRecipes(recipesList);

        // Fetch saved recipes from localStorage
        let savedRecipeIds = [];
        try {
          savedRecipeIds = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
        } catch (err) {
          console.error('Error parsing saved recipes from localStorage:', err);
          savedRecipeIds = [];
        }

        if (savedRecipeIds.length > 0) {
          // Fetch details for each saved recipe from Supabase
          const savedRecipesList = [];

          for (const recipeId of savedRecipeIds) {
            try {
              const { data: recipe, error } = await supabase
                .from('recipes')
                .select('*')
                .eq('id', recipeId)
                .single();

              if (error) {
                console.error(`Error fetching saved recipe ${recipeId}:`, error);
                continue;
              }

              // Fetch image URL from Supabase storage
              let imageUrl = null;
              if (recipe.image_path) {
                const { data } = await supabase
                  .storage
                  .from('recipe-images')
                  .getPublicUrl(recipe.image_path);

                if (data) {
                  imageUrl = data.publicUrl;
                }
              }

              savedRecipesList.push({
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
            } catch (err) {
              console.error(`Error processing saved recipe ${recipeId}:`, err);
            }
          }

          setSavedRecipes(savedRecipesList);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Filter recipes based on search query and active tab
  useEffect(() => {
    const currentList = activeTab === 'my' ? recipes : savedRecipes;

    if (searchQuery.trim() === '') {
      setFilteredRecipes(currentList);
    } else {
      const filtered = currentList.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.tags && recipe.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
      setFilteredRecipes(filtered);
    }
  }, [searchQuery, activeTab, recipes, savedRecipes]);

  // Handle recipe deletion
  const handleDeleteRecipe = async (recipeId, imagePath) => {
    if (!window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete recipe from Supabase
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      // Delete image from storage if it exists
      if (imagePath) {
        await supabase
          .storage
          .from('recipe-images')
          .remove([imagePath]);
      }

      // Update local state
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      setShowDropdown(null);
    } catch (err) {
      console.error('Error deleting recipe:', err);
      alert('Failed to delete recipe. Please try again.');
    }
  };

  // Handle edit recipe
  const handleEditRecipe = (recipeId) => {
    navigate(`/edit/${recipeId}`);
    setShowDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">My Recipes</h1>
        <Link to="/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Recipe
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'my'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => {
            setActiveTab('my');
            setSearchQuery('');
          }}
        >
          <div className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            My Recipes
          </div>
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'saved'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => {
            setActiveTab('saved');
            setSearchQuery('');
          }}
        >
          <div className="flex items-center gap-2">
            <BookmarkCheck className="h-4 w-4" />
            Saved Recipes
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <div className="mb-4">
            {activeTab === 'my' ? (
              <ChefHat className="h-12 w-12 mx-auto text-muted-foreground" />
            ) : (
              <BookmarkCheck className="h-12 w-12 mx-auto text-muted-foreground" />
            )}
          </div>
          <h3 className="text-lg font-medium mb-2">
            {activeTab === 'my'
              ? "You haven't created any recipes yet"
              : "You haven't saved any recipes yet"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {activeTab === 'my'
              ? "Start sharing your culinary creations with the world"
              : "Save recipes you love to find them easily later"}
          </p>
          {activeTab === 'my' ? (
            <Link to="/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Recipe
              </Button>
            </Link>
          ) : (
            <Link to="/">
              <Button className="flex items-center gap-2">
                Discover Recipes
              </Button>
            </Link>
          )}
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
              <div className="bg-card border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md relative">
                {/* Edit/Delete Menu for My Recipes */}
                {activeTab === 'my' && (
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowDropdown(showDropdown === recipe.id ? null : recipe.id);
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>

                    {showDropdown === recipe.id && (
                      <div className="absolute right-0 top-full mt-1 bg-background border rounded-lg shadow-lg py-1 min-w-[120px]">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditRecipe(recipe.id);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteRecipe(recipe.id, recipe.imagePath);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted text-destructive flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <Link to={`/recipes/${recipe.id}`} className="block group">
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
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyRecipes;