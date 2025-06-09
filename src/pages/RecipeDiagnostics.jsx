import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { debugRecipe, listAllRecipes } from '@/utils/recipeDebug';
import supabase from '@/config/supabase';

const RecipeDiagnostics = () => {
  const [recipeId, setRecipeId] = useState('');
  const [results, setResults] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDebugRecipe = async () => {
    if (!recipeId.trim()) {
      setResults('Please enter a recipe ID');
      return;
    }

    setLoading(true);
    setResults('Running diagnostics...\n');

    try {
      const result = await debugRecipe(recipeId.trim());
      
      if (result.success) {
        setResults(prev => prev + '\n✅ Recipe loaded successfully!\n' + JSON.stringify(result.recipe, null, 2));
      } else {
        setResults(prev => prev + '\n❌ Recipe failed to load: ' + result.error);
      }
    } catch (err) {
      setResults(prev => prev + '\n❌ Unexpected error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleListRecipes = async () => {
    setLoading(true);
    setResults('Fetching all recipes...\n');

    try {
      const { data: recipes, error } = await supabase
        .from('recipes')
        .select('id, title, created_at, user_id')
        .order('created_at', { ascending: false });

      if (error) {
        setResults(prev => prev + '\n❌ Error: ' + error.message);
        return;
      }

      let output = `\n✅ Found ${recipes?.length || 0} recipes:\n\n`;
      recipes?.forEach((recipe, index) => {
        output += `${index + 1}. "${recipe.title}" (ID: ${recipe.id})\n`;
        output += `   Created: ${new Date(recipe.created_at).toLocaleDateString()}\n`;
        output += `   User ID: ${recipe.user_id}\n\n`;
      });

      setResults(prev => prev + output);
    } catch (err) {
      setResults(prev => prev + '\n❌ Unexpected error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setResults('Testing Supabase connection...\n');

    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('recipes')
        .select('count')
        .limit(1);

      if (error) {
        setResults(prev => prev + '\n❌ Connection failed: ' + error.message);
      } else {
        setResults(prev => prev + '\n✅ Supabase connection successful!');
        
        // Test storage
        try {
          const { data: storageData, error: storageError } = await supabase
            .storage
            .from('recipe-images')
            .list('', { limit: 1 });

          if (storageError) {
            setResults(prev => prev + '\n⚠️ Storage access failed: ' + storageError.message);
          } else {
            setResults(prev => prev + '\n✅ Storage access successful!');
          }
        } catch (storageErr) {
          setResults(prev => prev + '\n⚠️ Storage test error: ' + storageErr.message);
        }
      }
    } catch (err) {
      setResults(prev => prev + '\n❌ Connection test error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Recipe Diagnostics</h1>
      
      <div className="space-y-6">
        {/* Test Connection */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Test Connection</h2>
          <Button onClick={handleTestConnection} disabled={loading}>
            Test Supabase Connection
          </Button>
        </div>

        {/* Debug Specific Recipe */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Debug Specific Recipe</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={recipeId}
              onChange={(e) => setRecipeId(e.target.value)}
              placeholder="Enter recipe ID"
              className="flex-1 px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Button onClick={handleDebugRecipe} disabled={loading || !recipeId.trim()}>
              Debug Recipe
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter the ID of the recipe that's failing to load
          </p>
        </div>

        {/* List All Recipes */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">List All Recipes</h2>
          <Button onClick={handleListRecipes} disabled={loading}>
            List All Recipes
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            This will show all recipes in the database with their IDs
          </p>
        </div>

        {/* Results */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <div className="bg-muted rounded-lg p-4 min-h-[200px] max-h-[500px] overflow-auto">
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {results || 'No results yet. Run a diagnostic above.'}
            </pre>
          </div>
          {results && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => setResults('')}
            >
              Clear Results
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <h2 className="text-xl font-semibold mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>First, test the Supabase connection to ensure everything is working</li>
            <li>List all recipes to see what's available in the database</li>
            <li>Copy the ID of the failing recipe and paste it in the debug field</li>
            <li>Run the debug tool to see detailed information about what's failing</li>
            <li>Check the browser console for additional debug information</li>
          </ol>
          
          <div className="mt-4 p-3 bg-background rounded border">
            <p className="text-sm font-medium mb-2">Common Issues:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Recipe ID doesn't exist in database</li>
              <li>• JSON parsing errors in ingredients/instructions</li>
              <li>• Missing or corrupted image files</li>
              <li>• Database connection issues</li>
              <li>• Missing nutrition data columns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDiagnostics;
