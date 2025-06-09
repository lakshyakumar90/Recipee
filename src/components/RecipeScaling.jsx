import { useState, useEffect } from 'react';
import { Users, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RecipeScaling = ({ originalServings, ingredients, onScaledIngredientsChange }) => {
  const [servings, setServings] = useState(originalServings);
  const [scaledIngredients, setScaledIngredients] = useState(ingredients);

  // Parse ingredient amounts and scale them
  const scaleIngredients = (newServings) => {
    const scaleFactor = newServings / originalServings;
    
    const scaled = ingredients.map(ingredient => {
      // Try to extract number from the beginning of the ingredient string
      const match = ingredient.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)\s*(.+)/);
      
      if (match) {
        const [, amount, rest] = match;
        let scaledAmount;
        
        // Handle fractions
        if (amount.includes('/')) {
          const [numerator, denominator] = amount.split('/').map(Number);
          scaledAmount = (numerator / denominator) * scaleFactor;
        } else {
          scaledAmount = parseFloat(amount) * scaleFactor;
        }
        
        // Format the scaled amount nicely
        let formattedAmount;
        if (scaledAmount % 1 === 0) {
          formattedAmount = scaledAmount.toString();
        } else if (scaledAmount < 1) {
          // Convert to fraction for small amounts
          const fraction = decimalToFraction(scaledAmount);
          formattedAmount = fraction;
        } else {
          formattedAmount = scaledAmount.toFixed(2).replace(/\.?0+$/, '');
        }
        
        return `${formattedAmount} ${rest}`;
      }
      
      // If no number found, return original ingredient
      return ingredient;
    });
    
    setScaledIngredients(scaled);
    if (onScaledIngredientsChange) {
      onScaledIngredientsChange(scaled, newServings);
    }
  };

  // Convert decimal to fraction for better readability
  const decimalToFraction = (decimal) => {
    const tolerance = 1.0E-6;
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = decimal;
    
    do {
      const a = Math.floor(b);
      let aux = h1; h1 = a * h1 + h2; h2 = aux;
      aux = k1; k1 = a * k1 + k2; k2 = aux;
      b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);
    
    return k1 === 1 ? h1.toString() : `${h1}/${k1}`;
  };

  useEffect(() => {
    scaleIngredients(servings);
  }, [servings]);

  const incrementServings = () => {
    setServings(prev => prev + 1);
  };

  const decrementServings = () => {
    if (servings > 1) {
      setServings(prev => prev - 1);
    }
  };

  const resetServings = () => {
    setServings(originalServings);
  };

  return (
    <div className="space-y-4">
      {/* Servings Control */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Servings</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={decrementServings}
            disabled={servings <= 1}
            className="h-8 w-8"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <span className="font-bold text-lg min-w-[2rem] text-center">
            {servings}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={incrementServings}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scale Info */}
      {servings !== originalServings && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Scaled from {originalServings} serving{originalServings !== 1 ? 's' : ''}
          </span>
          <Button variant="ghost" size="sm" onClick={resetServings}>
            Reset to original
          </Button>
        </div>
      )}

      {/* Scaled Ingredients */}
      <div className="space-y-2">
        <h3 className="font-semibold">Ingredients</h3>
        <ul className="space-y-2">
          {scaledIngredients.map((ingredient, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span className={servings !== originalServings ? 'font-medium' : ''}>
                {ingredient}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeScaling;
