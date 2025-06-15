import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Minus, Upload, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import supabase from '@/config/supabase';
import { v4 as uuidv4 } from 'uuid';

const CreateRecipe = () => {
  const navigate = useNavigate();
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
        throw new Error('You must be logged in to create a recipe');
      }

      // Upload image to Supabase storage if provided
      let imagePath = null;
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user.uid}/${fileName}`;

        const { error: uploadError } = await supabase
          .storage
          .from('recipe-images')  // Corrected bucket name
          .upload(filePath, image);

        if (uploadError) {
          throw new Error('Failed to upload image: ' + uploadError.message);
        }

        imagePath = filePath;
      }

      // Generate a random UUID for this user
      const userUuid = uuidv4();
      // Store mapping in localStorage for future reference
      const userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
      if (!userMappings[user.uid]) {
        userMappings[user.uid] = userUuid;
        localStorage.setItem('userMappings', JSON.stringify(userMappings));
      }

      // Create recipe in Supabase
      const timestamp = new Date().toISOString();
      const recipeData = {
        title,
        description,
        cook_time: parseInt(cookTime) || 30, // Convert to integer
        servings: parseInt(servings) || 4,   // Convert to integer
        difficulty: difficulty || 'Medium',
        ingredients: JSON.stringify(filteredIngredients), // Convert array to JSON
        instructions: JSON.stringify(filteredInstructions), // Convert array to JSON
        tags: filteredTags,
        image_path: imagePath,
        user_id: userMappings[user.uid], // Use the UUID instead of Firebase UID
        created_at: timestamp,

      };

      console.log('About to insert recipe with data:', JSON.stringify(recipeData, null, 2));
      console.log('Using Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Using Supabase Key (first 10 chars):', import.meta.env.VITE_SUPABASE_SERVICE_KEY.substring(0, 10) + '...');

      try {
        const { data, error } = await supabase
          .from('recipes')
          .insert(recipeData)
          .select();

        console.log('Insert response:', { data, error });

        if (error) {
          console.error('Supabase error details:', error);
          throw new Error('Failed to create recipe: ' + error.message);
        }

        // Navigate to the newly created recipe
        navigate(`/recipes/${data[0].id}`);
      } catch (err) {
        console.error('Error creating recipe (full error):', err);
        setError(err.message || 'Failed to create recipe');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Error creating recipe:', err);
      setError(err.message || 'Failed to create recipe');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Create New Recipe</h1>

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
                  Cook Time
                </label>
                <input
                  id="cookTime"
                  type="text"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="e.g. 30 mins"
                />
              </div>

              <div>
                <label htmlFor="servings" className="block text-sm font-medium mb-1">
                  Servings
                </label>
                <input
                  id="servings"
                  type="text"
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    Drag and drop an image, or click to browse
                  </p>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image').click()}
                  >
                    Select Image
                  </Button>
                </div>
              )}
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
              onClick={() => navigate(-1)}
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
                  Creating...
                </span>
              ) : (
                'Create Recipe'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateRecipe;





