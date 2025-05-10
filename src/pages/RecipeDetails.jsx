import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, ChefHat, ArrowLeft, Bookmark, BookmarkCheck, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import supabase from '@/config/supabase';
import { formatDate } from '@/lib/utils';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
        // Fetch recipe from Supabase
        const { data: recipeData, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
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

        setRecipe({
          id: recipeData.id,
          title: recipeData.title,
          description: recipeData.description,
          cookTime: recipeData.cook_time.toString(),
          servings: recipeData.servings.toString(),
          difficulty: recipeData.difficulty,
          ingredients: JSON.parse(recipeData.ingredients),
          instructions: JSON.parse(recipeData.instructions),
          tags: recipeData.tags,
          userId: recipeData.user_id,
          createdAt: recipeData.created_at,
          imageUrl: imageUrl || 'https://via.placeholder.com/800x400?text=No+Image',
        });

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
    if (!currentUser || (recipe && recipe.userId !== currentUser.uid)) {
      return; // Only allow deletion by the recipe creator
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
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
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

          {currentUser && recipe && recipe.userId === currentUser.uid && (
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

        {/* Recipe content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary mt-2"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="md:col-span-2">
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







