import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Minus, Upload, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import supabase from '@/config/supabase';
import { v4 as uuidv4 } from 'uuid';

const EditRecipe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [tags, setTags] = useState(['']);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImagePath, setCurrentImagePath] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/auth/login');
          return;
        }

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

        // Check if current user is the recipe creator
        const userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
        const userUuid = userMappings[user.uid];
        
        if (!userUuid || recipeData.user_id !== userUuid) {
          setError('You can only edit your own recipes.');
          return;
        }

        // Populate form with existing data
        setTitle(recipeData.title);
        setDescription(recipeData.description);
        setCookTime(recipeData.cook_time.toString());
        setServings(recipeData.servings.toString());
        setDifficulty(recipeData.difficulty);
        setIngredients(JSON.parse(recipeData.ingredients));
        setInstructions(JSON.parse(recipeData.instructions));
        setTags(recipeData.tags || ['']);
        setCurrentImagePath(recipeData.image_path);
        
// Set current image preview if exists
        if (recipeData.image_path) {
          try {
            const { data } = await supabase
              .storage
              .from('recipe-images')
              .getPublicUrl(recipeData.image_path);

            if (data) {
              setImagePreview(data.publicUrl);
            }
          } catch (err) {
            console.error('Error getting image URL:', err);
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
  }, [id, navigate]);

  // Handle ingredient changes
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  // Add new ingredient field
  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  // Remove ingredient field
  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  // Handle instruction changes
  const handleInstructionChange = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  // Add new instruction field
  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  // Remove instruction field
  const removeInstruction = (index) => {
    if (instructions.length > 1) {
      const newInstructions = [...instructions];
      newInstructions.splice(index, 1);
      setInstructions(newInstructions);
    }
  };

  // Handle tag changes
  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  // Add new tag field
  const addTag = () => {
    setTags([...tags, '']);
  };

  // Remove tag field
  const removeTag = (index) => {
    if (tags.length > 1) {
      const newTags = [...tags];
      newTags.splice(index, 1);
      setTags(newTags);
    }
  };

// Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate form
      if (!title.trim() || !description.trim()) {
        throw new Error('Title and description are required');
      }

      // Filter out empty ingredients, instructions, and tags
      const filteredIngredients = ingredients.filter(item => item.trim() !== '');
      const filteredInstructions = instructions.filter(item => item.trim() !== '');
      const filteredTags = tags.filter(item => item.trim() !== '');

      if (filteredIngredients.length === 0) {
        throw new Error('At least one ingredient is required');
      }

      if (filteredInstructions.length === 0) {
        throw new Error('At least one instruction is required');
      }

      // Get current user
      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be logged in to edit a recipe');
      }

      // Handle image upload if new image is selected
      let imagePath = currentImagePath; // Keep current image by default
      if (image) {
        // Delete old image if it exists
        if (currentImagePath) {
          try {
            await supabase
              .storage
              .from('recipe-images')
              .remove([currentImagePath]);
          } catch (err) {
            console.warn('Failed to delete old image:', err);
          }
        }

        // Upload new image
        const fileExt = image.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user.uid}/${fileName}`;

        const { error: uploadError } = await supabase
          .storage
          .from('recipe-images')
          .upload(filePath, image);

        if (uploadError) {
          throw new Error('Failed to upload image: ' + uploadError.message);
        }

        imagePath = filePath;
      }

      // Update recipe in Supabase
      const timestamp = new Date().toISOString();
      const recipeData = {
        title,
        description,
        cook_time: parseInt(cookTime) || 30,
        servings: parseInt(servings) || 4,
        difficulty: difficulty || 'Medium',
        ingredients: JSON.stringify(filteredIngredients),
        instructions: JSON.stringify(filteredInstructions),
        tags: filteredTags,
        image_path: imagePath,
        updated_at: timestamp,

      };

      const { error } = await supabase
        .from('recipes')
        .update(recipeData)
        .eq('id', id);

      if (error) {
        throw new Error('Failed to update recipe: ' + error.message);
      }

      // Navigate back to the recipe
      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error('Error updating recipe:', err);
      setError(err.message || 'Failed to update recipe');
      setIsSubmitting(false);
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Recipe</h1>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>

            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Recipe Title*
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. Creamy Garlic Pasta"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description*
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Describe your recipe in a few sentences"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="cookTime" className="block text-sm font-medium mb-1">
                  Cook Time (minutes)
                </label>
                <input
                  id="cookTime"
                  type="number"
                  min="1"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="e.g. 30"
                />
              </div>

              <div>
                <label htmlFor="servings" className="block text-sm font-medium mb-1">
                  Servings
                </label>
                <input
                  id="servings"
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="e.g. 4"
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recipe Image</h2>

            <div className="border-2 border-dashed border-muted rounded-md p-6 text-center">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Recipe preview"
                    className="max-h-64 mx-auto rounded-md"
                  />
                  <div className="flex gap-2 justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image').click()}
                    >
                      Change Image
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                        setCurrentImagePath(null);
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    Drag and drop an image, or click to browse
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image').click()}
                  >
                    Select Image
                  </Button>
                </div>
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Ingredients*</h2>

            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  className="flex-grow p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder={`Ingredient ${index + 1}`}
                  required={index === 0}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                  disabled={ingredients.length === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addIngredient}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Ingredient
            </Button>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Instructions*</h2>

            {instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-medium">
                  {index + 1}
                </div>
                <textarea
                  value={instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  rows={2}
                  className="flex-grow p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder={`Step ${index + 1}`}
                  required={index === 0}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeInstruction(index)}
                  disabled={instructions.length === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addInstruction}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Step
            </Button>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Tags</h2>

            {tags.map((tag, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  className="flex-grow p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder={`Tag ${index + 1} (e.g. Italian, Vegetarian)`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeTag(index)}
                  disabled={tags.length === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addTag}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Tag
            </Button>
          </div>

{/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/recipes/${id}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                'Update Recipe'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditRecipe;
