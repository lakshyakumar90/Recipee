import supabase from '@/config/supabase';

export const debugRecipe = async (recipeId) => {
  console.log('=== Recipe Debug Tool ===');
  console.log('Recipe ID:', recipeId);
  
  try {
    // Check if recipe exists
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single();

    if (error) {
      console.error('❌ Recipe fetch error:', error);
      console.log('Error code:', error.code);
      console.log('Error message:', error.message);
      return { success: false, error };
    }

    if (!recipe) {
      console.error('❌ Recipe not found');
      return { success: false, error: 'Recipe not found' };
    }

    console.log('✅ Recipe found:', recipe.title);
    console.log('Recipe data:', recipe);

    // Check ingredients and instructions
    console.log('--- Checking JSON fields ---');
    
    try {
      const ingredients = typeof recipe.ingredients === 'string' 
        ? JSON.parse(recipe.ingredients) 
        : recipe.ingredients;
      console.log('✅ Ingredients parsed successfully:', ingredients);
    } catch (err) {
      console.error('❌ Ingredients parsing error:', err);
      console.log('Raw ingredients:', recipe.ingredients);
    }

    try {
      const instructions = typeof recipe.instructions === 'string' 
        ? JSON.parse(recipe.instructions) 
        : recipe.instructions;
      console.log('✅ Instructions parsed successfully:', instructions);
    } catch (err) {
      console.error('❌ Instructions parsing error:', err);
      console.log('Raw instructions:', recipe.instructions);
    }

    // Check image
    console.log('--- Checking image ---');
    if (recipe.image_path) {
      try {
        const { data: imageData } = await supabase
          .storage
          .from('recipe-images')
          .getPublicUrl(recipe.image_path);

        if (imageData) {
          console.log('✅ Image URL generated:', imageData.publicUrl);
        } else {
          console.log('⚠️ No image data returned');
        }
      } catch (err) {
        console.error('❌ Image URL error:', err);
      }
    } else {
      console.log('ℹ️ No image path set');
    }

    // Check ratings and reviews
    console.log('--- Checking ratings and reviews ---');
    try {
      const { data: ratings, error: ratingsError } = await supabase
        .from('ratings')
        .select('rating')
        .eq('recipe_id', recipeId);

      if (ratingsError) {
        console.error('❌ Ratings fetch error:', ratingsError);
      } else {
        console.log('✅ Ratings fetched:', ratings?.length || 0, 'ratings');
      }

      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('id')
        .eq('recipe_id', recipeId);

      if (reviewsError) {
        console.error('❌ Reviews fetch error:', reviewsError);
      } else {
        console.log('✅ Reviews fetched:', reviews?.length || 0, 'reviews');
      }
    } catch (err) {
      console.error('❌ Ratings/Reviews error:', err);
    }

    console.log('=== Debug Complete ===');
    return { success: true, recipe };

  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return { success: false, error: err.message };
  }
};

// Function to list all recipes for debugging
export const listAllRecipes = async () => {
  console.log('=== Listing All Recipes ===');
  
  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('id, title, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching recipes:', error);
      return;
    }

    console.log('Total recipes:', recipes?.length || 0);
    recipes?.forEach((recipe, index) => {
      console.log(`${index + 1}. ${recipe.title} (ID: ${recipe.id})`);
    });

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
};

// Add to window for easy access in browser console
if (typeof window !== 'undefined') {
  window.debugRecipe = debugRecipe;
  window.listAllRecipes = listAllRecipes;
}
