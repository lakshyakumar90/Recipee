import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, ChefHat, ArrowLeft, Bookmark, BookmarkCheck, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import supabase from '@/config/supabase';
import { formatDate } from '@/lib/utils';
import RecipeScaling from '@/components/RecipeScaling';
import Reviews from '@/components/Reviews';
import Collections from '@/components/Collections';
import Nutrition from '@/components/Nutrition';
import { debugRecipe } from '@/utils/recipeDebug';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [scaledServings, setScaledServings] = useState(null);
  const [scaledIngredients, setScaledIngredients] = useState([]);

  useEffect(() => {
    // Get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        console.log('Fetching recipe with ID:', id);

        // Run debug tool in development
        if (process.env.NODE_ENV === 'development') {
          await debugRecipe(id);
        }

        // Fetch recipe from Supabase
        const { data: recipeData, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', id)
          .single();

        console.log('Recipe fetch result:', { data: recipeData, error });

        if (error) {
          console.error('Supabase error:', error);
          if (error.code === 'PGRST116') {
            setError('Recipe not found');
          } else {
            setError(`Database error: ${error.message}`);
          }
          return;
        }

        if (!recipeData) {
          setError('Recipe not found');
          return;
        }

        // Fetch image URL from Supabase storage
        let imageUrl = null;
        if (recipeData.image_path) {
          try {
            const { data } = await supabase
              .storage
              .from('recipe-images')  // Corrected bucket name
              .getPublicUrl(recipeData.image_path);

            if (data) {
              imageUrl = data.publicUrl;
              console.log('Recipe image URL:', imageUrl); // Debug log
            }
          } catch (err) {
            console.error('Error getting image URL:', err);
          }
        }

        console.log('Image path:', recipeData.image_path);
        console.log('Generated image URL:', imageUrl);

        // Parse ingredients and instructions safely
        let ingredients = [];
        let instructions = [];

        try {
          ingredients = typeof recipeData.ingredients === 'string'
            ? JSON.parse(recipeData.ingredients)
            : recipeData.ingredients || [];
        } catch (err) {
          console.error('Error parsing ingredients:', err);
          ingredients = [];
        }

        try {
          instructions = typeof recipeData.instructions === 'string'
            ? JSON.parse(recipeData.instructions)
            : recipeData.instructions || [];
        } catch (err) {
          console.error('Error parsing instructions:', err);
          instructions = [];
        }

        const recipeObj = {
          id: recipeData.id,
          title: recipeData.title || 'Untitled Recipe',
          description: recipeData.description || 'No description available',
          cookTime: (recipeData.cook_time || 30).toString(),
          servings: (recipeData.servings || 4).toString(),
          difficulty: recipeData.difficulty || 'Medium',
          ingredients: ingredients,
          instructions: instructions,
          tags: recipeData.tags || [],
          userId: recipeData.user_id,
          createdAt: recipeData.created_at,
          imageUrl: imageUrl || 'https://via.placeholder.com/800x400?text=No+Image',
          nutrition: {
            calories: recipeData.nutrition_calories || 0,
            protein: recipeData.nutrition_protein || 0,
            carbs: recipeData.nutrition_carbs || 0,
            fat: recipeData.nutrition_fat || 0,
            fiber: recipeData.nutrition_fiber || 0,
            sugar: recipeData.nutrition_sugar || 0,
            sodium: recipeData.nutrition_sodium || 0
          }
        };

        setRecipe(recipeObj);
        setScaledServings(parseInt(recipeData.servings) || 4);
        setScaledIngredients(ingredients);

        // Fetch ratings and reviews (don't let this fail the whole recipe load)
        try {
          await fetchRatingsAndReviews();
        } catch (err) {
          console.error('Error fetching ratings/reviews:', err);
          // Continue loading the recipe even if ratings fail
        }

        // Check if recipe is saved by current user
        if (currentUser) {
          const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
          setIsSaved(savedRecipes.includes(id));
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id, currentUser]);

  const fetchRatingsAndReviews = async () => {
    try {
      // Fetch average rating
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('ratings')
        .select('rating')
        .eq('recipe_id', id);

      if (ratingsError) throw ratingsError;

      if (ratingsData && ratingsData.length > 0) {
        const totalRating = ratingsData.reduce((sum, r) => sum + r.rating, 0);
        setAverageRating(totalRating / ratingsData.length);
      }

      // Fetch review count
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('id')
        .eq('recipe_id', id);

      if (reviewsError) throw reviewsError;
      setTotalReviews(reviewsData?.length || 0);
    } catch (error) {
      console.error('Error fetching ratings and reviews:', error);
    }
  };

  const handleScaledIngredientsChange = (newIngredients, newServings) => {
    setScaledIngredients(newIngredients);
    setScaledServings(newServings);
  };

  const handleRatingUpdate = () => {
    fetchRatingsAndReviews();
  };

  const handleSaveRecipe = () => {
    if (!currentUser) {
      navigate('/auth/login');
      return;
    }

    // Toggle saved state
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');

    if (isSaved) {
      // Remove from saved recipes
      const updatedSavedRecipes = savedRecipes.filter(recipeId => recipeId !== id);
      localStorage.setItem('savedRecipes', JSON.stringify(updatedSavedRecipes));
    } else {
      // Add to saved recipes
      savedRecipes.push(id);
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    }

    setIsSaved(!isSaved);
  };

  const handleDeleteRecipe = async () => {
    if (!currentUser || !recipe) {
      return;
    }

    // Check if current user is the recipe creator using UUID mapping
    const userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
    const userUuid = userMappings[currentUser.uid];

    if (!userUuid || recipe.userId !== userUuid) {
      alert('You can only delete your own recipes.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      try {
        // Delete recipe from Supabase
        const { error } = await supabase
          .from('recipes')
          .delete()
          .eq('id', id);

        if (error) {
          throw new Error('Failed to delete recipe: ' + error.message);
        }

        // Delete image from Supabase storage if it exists
        if (recipe.imageUrl && recipe.imageUrl.includes('recipe-images')) {
          const imagePath = recipe.imageUrl.split('/').pop();
          await supabase
            .storage
            .from('recipe-images')
            .remove([imagePath]);
        }

        navigate('/');
      } catch (err) {
        console.error('Error deleting recipe:', err);
        alert('Failed to delete recipe. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">{error}</h2>
        <p className="text-muted-foreground mb-6">
          {error.includes('not found')
            ? 'This recipe may have been deleted or the link is incorrect.'
            : 'There was a problem loading this recipe. Please try again.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-muted rounded-lg text-left max-w-md mx-auto">
            <p className="text-sm font-medium mb-2">Debug Info:</p>
            <p className="text-xs text-muted-foreground">Recipe ID: {id}</p>
            <p className="text-xs text-muted-foreground">Error: {error}</p>
          </div>
        )}
      </div>
    );
  }

  // Safety check - ensure recipe is loaded before rendering
  if (!recipe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Recipe not loaded</h2>
        <p className="text-muted-foreground mb-6">
          The recipe data is not available. Please try refreshing the page.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back button and actions */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveRecipe}
            className="flex items-center gap-2"
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                Save
              </>
            )}
          </Button>

          {currentUser && recipe && (() => {
            const userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
            const userUuid = userMappings[currentUser.uid];
            return userUuid && recipe.userId === userUuid;
          })() && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/edit/${id}`)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteRecipe}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Recipe header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full aspect-3/1 rounded-xl overflow-hidden mb-6">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{recipe.title}</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-5 w-5 mr-2" />
            <span>{recipe.cookTime || '30 mins'}</span>
          </div>

          <div className="flex items-center text-muted-foreground">
            <Users className="h-5 w-5 mr-2" />
            <span>{recipe.servings || '4'} servings</span>
          </div>

          <div className="flex items-center text-muted-foreground">
            <ChefHat className="h-5 w-5 mr-2" />
            <span>{recipe.difficulty || 'Medium'}</span>
          </div>
        </div>

        <p className="text-muted-foreground mb-8">{recipe.description}</p>

        {/* Recipe Scaling */}
        <div className="mb-8">
          <RecipeScaling
            originalServings={parseInt(recipe.servings)}
            ingredients={recipe.ingredients}
            onScaledIngredientsChange={handleScaledIngredientsChange}
          />
        </div>

        {/* Recipe content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Instructions */}
          <div className="md:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions && recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-medium">
                    {index + 1}
                  </div>
                  <p>{instruction}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Nutrition Information */}
        <div className="mb-8">
          <Nutrition
            nutrition={recipe.nutrition}
            servings={scaledServings}
            originalServings={parseInt(recipe.servings)}
          />
        </div>

        {/* Reviews and Ratings */}
        <div className="mb-8">
          <Reviews
            recipeId={id}
            averageRating={averageRating}
            totalReviews={totalReviews}
            onRatingUpdate={handleRatingUpdate}
          />
        </div>

        {/* Collections */}
        <div className="mb-8">
          <Collections recipeId={id} />
        </div>

        {/* Recipe metadata */}
        <div className="mt-12 pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            {recipe.createdAt && (
              <p>Created on {formatDate(recipe.createdAt)}</p>
            )}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {recipe.tags.map((tag, index) => (
                  <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RecipeDetails;







