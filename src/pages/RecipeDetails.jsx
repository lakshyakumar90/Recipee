import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, ChefHat, ArrowLeft, Bookmark, BookmarkCheck, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import supabase from '@/config/supabase';
import { formatDate } from '@/lib/utils';
import Reviews from '@/components/Reviews';

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        console.log('Fetching recipe with ID:', id);

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

        let imageUrl = null;
        if (recipeData.image_path) {
          try {
            const { data } = await supabase
              .storage
              .from('recipe-images')
              .getPublicUrl(recipeData.image_path);

            if (data) {
              imageUrl = data.publicUrl;
              console.log('Recipe image URL:', imageUrl);
            }
          } catch (err) {
            console.error('Error getting image URL:', err);
          }
        }

        console.log('Image path:', recipeData.image_path);
        console.log('Generated image URL:', imageUrl);

        // Helper function to safely parse JSON
        const safeJsonParse = (jsonString, fallback = []) => {
          if (!jsonString) return fallback;
          try {
            // If it's already an array, return it
            if (Array.isArray(jsonString)) return jsonString;
            // If it's a string that looks like JSON, parse it
            if (typeof jsonString === 'string') {
              return JSON.parse(jsonString);
            }
            return fallback;
          } catch (err) {
            console.error('Error parsing JSON:', err);
            return fallback;
          }
        };

        let ingredients = safeJsonParse(recipeData.ingredients, []);
        let instructions = safeJsonParse(recipeData.instructions, []);

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
        };

        setRecipe(recipeObj);

        try {
          await fetchRatingsAndReviews();
        } catch (err) {
          console.error('Error fetching ratings/reviews:', err);
        }

        if (currentUser) {
          try {
            const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
            setIsSaved(savedRecipes.includes(id));
          } catch (err) {
            console.error('Error parsing saved recipes from localStorage:', err);
            setIsSaved(false);
          }
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
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('ratings')
        .select('rating')
        .eq('recipe_id', id);

      if (ratingsError) throw ratingsError;

      if (ratingsData && ratingsData.length > 0) {
        const totalRating = ratingsData.reduce((sum, r) => sum + r.rating, 0);
        setAverageRating(totalRating / ratingsData.length);
      }

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

  const handleRatingUpdate = () => {
    fetchRatingsAndReviews();
  };

  const handleSaveRecipe = () => {
    if (!currentUser) {
      navigate('/auth/login');
      return;
    }

    let savedRecipes = [];
    try {
      savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    } catch (err) {
      console.error('Error parsing saved recipes from localStorage:', err);
      savedRecipes = [];
    }

    if (isSaved) {
      const updatedSavedRecipes = savedRecipes.filter(recipeId => recipeId !== id);
      localStorage.setItem('savedRecipes', JSON.stringify(updatedSavedRecipes));
    } else {
      savedRecipes.push(id);
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    }

    setIsSaved(!isSaved);
  };

  const handleDeleteRecipe = async () => {
    if (!currentUser || !recipe) {
      return;
    }

    let userMappings = {};
    try {
      userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
    } catch (err) {
      console.error('Error parsing userMappings from localStorage:', err);
      userMappings = {};
    }
    const userUuid = userMappings[currentUser.uid];

    if (!userUuid || recipe.userId !== userUuid) {
      alert('You can only delete your own recipes.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('recipes')
          .delete()
          .eq('id', id);

        if (error) {
          throw new Error('Failed to delete recipe: ' + error.message);
        }

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
            try {
              const userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
              const userUuid = userMappings[currentUser.uid];
              return userUuid && recipe.userId === userUuid;
            } catch (err) {
              console.error('Error parsing userMappings from localStorage:', err);
              return false;
            }
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            <ol className="space-y-4">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 mb-6">
            {recipe.tags.map((tag, index) => (
              <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
        {recipe.createdAt && (
          <p className="text-sm text-muted-foreground mt-2">
            Created on {formatDate(recipe.createdAt)}
          </p>
        )}

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          <Reviews 
            recipeId={id} 
            currentUser={currentUser}
            averageRating={averageRating}
            totalReviews={totalReviews}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default RecipeDetails;
