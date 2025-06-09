import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  X,
  Clock,
  Users,
  ChefHat,
  BookmarkPlus,
  BookmarkCheck,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import supabase from '@/config/supabase';
import { auth } from '@/config/firebase';

const CollectionRecipeManager = ({ collection, onUpdate }) => {
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [collectionRecipes, setCollectionRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddRecipes, setShowAddRecipes] = useState(false);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (collection) {
      fetchCollectionRecipes();
      fetchAvailableRecipes();
    }
  }, [collection]);

  const fetchCollectionRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('collection_recipes')
        .select(`
          recipe_id,
          recipes (
            id,
            title,
            description,
            cook_time,
            servings,
            difficulty,
            tags,
            image_path,
            created_at,
            user_id
          )
        `)
        .eq('collection_id', collection.id);

      if (error) throw error;

      const recipes = data?.map(item => ({
        ...item.recipes,
        imageUrl: item.recipes.image_path
          ? `https://nvjzrkjuwsuwmfklpjhf.supabase.co/storage/v1/object/public/recipe-images/${item.recipes.image_path}`
          : 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image'
      })) || [];

      setCollectionRecipes(recipes);
    } catch (error) {
      console.error('Error fetching collection recipes:', error);
    }
  };

  const fetchAvailableRecipes = async () => {
    if (!currentUser) return;

    try {
      // Get user UUID
      const userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
      const userUuid = userMappings[currentUser.uid];

      if (!userUuid) return;

      // Fetch all recipes (user's own + public recipes)
      const { data: allRecipes, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get recipes already in this collection
      const { data: existingRecipes } = await supabase
        .from('collection_recipes')
        .select('recipe_id')
        .eq('collection_id', collection.id);

      const existingRecipeIds = new Set(existingRecipes?.map(r => r.recipe_id) || []);

      // Filter out recipes already in collection
      const available = allRecipes
        ?.filter(recipe => !existingRecipeIds.has(recipe.id))
        .map(recipe => ({
          ...recipe,
          imageUrl: recipe.image_path
            ? `https://nvjzrkjuwsuwmfklpjhf.supabase.co/storage/v1/object/public/recipe-images/${recipe.image_path}`
            : 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image'
        })) || [];

      setAvailableRecipes(available);
    } catch (error) {
      console.error('Error fetching available recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipeToCollection = async (recipeId) => {
    try {
      const { error } = await supabase
        .from('collection_recipes')
        .insert({
          collection_id: collection.id,
          recipe_id: recipeId
        });

      if (error) throw error;

      // Refresh both lists
      await fetchCollectionRecipes();
      await fetchAvailableRecipes();

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adding recipe to collection:', error);
    }
  };

  const handleRemoveRecipeFromCollection = async (recipeId) => {
    try {
      const { error } = await supabase
        .from('collection_recipes')
        .delete()
        .eq('collection_id', collection.id)
        .eq('recipe_id', recipeId);

      if (error) throw error;

      // Refresh both lists
      await fetchCollectionRecipes();
      await fetchAvailableRecipes();

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error removing recipe from collection:', error);
    }
  };

  const filteredAvailableRecipes = availableRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (recipe.tags && recipe.tags.some(tag =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{collection.name}</h2>
          {collection.description && (
            <p className="text-muted-foreground mt-1">{collection.description}</p>
          )}
        </div>
        <Button
          onClick={() => setShowAddRecipes(!showAddRecipes)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Recipes
        </Button>
      </div>

      {/* Add Recipes Panel */}
      <AnimatePresence>
        {showAddRecipes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-6 bg-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Recipes to Collection</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddRecipes(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Available Recipes */}
            {filteredAvailableRecipes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recipes available to add.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredAvailableRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="border rounded-lg p-4 bg-background hover:bg-muted/50 transition-colors"
                  >
                    <div className="aspect-video overflow-hidden rounded-lg mb-3">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-medium mb-2 line-clamp-2">{recipe.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {recipe.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{recipe.cook_time}m</span>
                        <Users className="h-3 w-3" />
                        <span>{recipe.servings}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddRecipeToCollection(recipe.id)}
                        className="flex items-center gap-1"
                      >
                        <BookmarkPlus className="h-3 w-3" />
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collection Recipes */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Recipes in this collection ({collectionRecipes.length})
        </h3>

        {collectionRecipes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookmarkPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">This collection is empty.</p>
            <Button
              variant="outline"
              onClick={() => setShowAddRecipes(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Your First Recipe
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectionRecipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow relative group"
              >
                {/* Remove button */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveRecipeFromCollection(recipe.id);
                  }}
                  className="absolute top-2 right-2 z-10 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <Link to={`/recipes/${recipe.id}`} className="block">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2 line-clamp-2">{recipe.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {recipe.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {recipe.cook_time} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {recipe.servings}
                      </span>
                      <span className="flex items-center gap-1">
                        <ChefHat className="h-4 w-4" />
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionRecipeManager;
