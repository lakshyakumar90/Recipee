import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Zap, 
  Beef, 
  Wheat, 
  Droplets, 
  Apple, 
  Popcorn,
  Calculator,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Nutrition = ({ 
  nutrition, 
  servings = 1, 
  originalServings = 1, 
  editable = false, 
  onNutritionChange 
}) => {
  const [nutritionData, setNutritionData] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    ...nutrition
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(nutritionData);

  useEffect(() => {
    if (nutrition) {
      setNutritionData({ ...nutritionData, ...nutrition });
      setEditForm({ ...nutritionData, ...nutrition });
    }
  }, [nutrition]);

  // Scale nutrition values based on servings
  const scaledNutrition = {
    calories: Math.round((nutritionData.calories || 0) * (servings / originalServings)),
    protein: Number(((nutritionData.protein || 0) * (servings / originalServings)).toFixed(1)),
    carbs: Number(((nutritionData.carbs || 0) * (servings / originalServings)).toFixed(1)),
    fat: Number(((nutritionData.fat || 0) * (servings / originalServings)).toFixed(1)),
    fiber: Number(((nutritionData.fiber || 0) * (servings / originalServings)).toFixed(1)),
    sugar: Number(((nutritionData.sugar || 0) * (servings / originalServings)).toFixed(1)),
    sodium: Number(((nutritionData.sodium || 0) * (servings / originalServings)).toFixed(1))
  };

  const nutritionItems = [
    {
      key: 'calories',
      label: 'Calories',
      value: scaledNutrition.calories,
      unit: 'kcal',
      icon: Zap,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      dailyValue: 2000,
      description: 'Energy from food'
    },
    {
      key: 'protein',
      label: 'Protein',
      value: scaledNutrition.protein,
      unit: 'g',
      icon: Beef,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950',
      dailyValue: 50,
      description: 'Builds and repairs tissues'
    },
    {
      key: 'carbs',
      label: 'Carbohydrates',
      value: scaledNutrition.carbs,
      unit: 'g',
      icon: Wheat,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      dailyValue: 300,
      description: 'Primary energy source'
    },
    {
      key: 'fat',
      label: 'Total Fat',
      value: scaledNutrition.fat,
      unit: 'g',
      icon: Droplets,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      dailyValue: 65,
      description: 'Essential for hormone production'
    },
    {
      key: 'fiber',
      label: 'Dietary Fiber',
      value: scaledNutrition.fiber,
      unit: 'g',
      icon: Apple,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
      dailyValue: 25,
      description: 'Aids digestion and gut health'
    },
    {
      key: 'sugar',
      label: 'Sugars',
      value: scaledNutrition.sugar,
      unit: 'g',
      icon: Activity,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-950',
      dailyValue: 50,
      description: 'Natural and added sugars'
    },
    {
      key: 'sodium',
      label: 'Sodium',
      value: scaledNutrition.sodium,
      unit: 'mg',
      icon: Popcorn,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      dailyValue: 2300,
      description: 'Regulates fluid balance'
    }
  ];

  const handleSaveNutrition = () => {
    setNutritionData(editForm);
    setIsEditing(false);
    if (onNutritionChange) {
      onNutritionChange(editForm);
    }
  };

  const handleCancelEdit = () => {
    setEditForm(nutritionData);
    setIsEditing(false);
  };

  const calculateDailyValuePercentage = (value, dailyValue, unit) => {
    if (!value || !dailyValue) return 0;
    
    // Convert mg to g for sodium calculation
    const adjustedValue = unit === 'mg' ? value / 1000 : value;
    const adjustedDailyValue = unit === 'mg' ? dailyValue / 1000 : dailyValue;
    
    return Math.round((adjustedValue / adjustedDailyValue) * 100);
  };

  const getTotalMacros = () => {
    const protein = scaledNutrition.protein * 4; // 4 calories per gram
    const carbs = scaledNutrition.carbs * 4; // 4 calories per gram
    const fat = scaledNutrition.fat * 9; // 9 calories per gram
    const total = protein + carbs + fat;
    
    return {
      protein: total > 0 ? Math.round((protein / total) * 100) : 0,
      carbs: total > 0 ? Math.round((carbs / total) * 100) : 0,
      fat: total > 0 ? Math.round((fat / total) * 100) : 0
    };
  };

  const macroPercentages = getTotalMacros();

  const hasNutritionData = nutritionItems.some(item => item.value > 0);

  if (!hasNutritionData && !editable) {
    return (
      <div className="border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Nutrition Information</h3>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nutrition information not available for this recipe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Nutrition Information</h3>
          {servings !== originalServings && (
            <span className="text-sm text-muted-foreground">
              (scaled for {servings} serving{servings !== 1 ? 's' : ''})
            </span>
          )}
        </div>
        
        {editable && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveNutrition}
                >
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                Edit Nutrition
              </Button>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nutritionItems.map((item) => (
              <div key={item.key}>
                <label className="block text-sm font-medium mb-2">
                  {item.label} ({item.unit})
                </label>
                <input
                  type="number"
                  min="0"
                  step={item.unit === 'kcal' ? '1' : '0.1'}
                  value={editForm[item.key] || ''}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    [item.key]: parseFloat(e.target.value) || 0
                  }))}
                  className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder={`Enter ${item.label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
          
          <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Nutrition Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• Values should be per serving of the original recipe</li>
                <li>• Use nutrition labels from ingredients when available</li>
                <li>• Consider cooking methods that may affect nutrition</li>
                <li>• These values will automatically scale with serving adjustments</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Macronutrient Overview */}
          {(scaledNutrition.protein > 0 || scaledNutrition.carbs > 0 || scaledNutrition.fat > 0) && (
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium mb-3">Macronutrient Breakdown</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-500">{macroPercentages.protein}%</div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                  <div className="text-xs text-muted-foreground">{scaledNutrition.protein}g</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-500">{macroPercentages.carbs}%</div>
                  <div className="text-sm text-muted-foreground">Carbs</div>
                  <div className="text-xs text-muted-foreground">{scaledNutrition.carbs}g</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">{macroPercentages.fat}%</div>
                  <div className="text-sm text-muted-foreground">Fat</div>
                  <div className="text-xs text-muted-foreground">{scaledNutrition.fat}g</div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Nutrition */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nutritionItems.map((item) => {
              const Icon = item.icon;
              const dailyValuePercentage = calculateDailyValuePercentage(
                item.value, 
                item.dailyValue, 
                item.unit
              );

              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${item.bgColor} rounded-lg p-4 border`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-background/50`}>
                      <Icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {item.value}
                        <span className="text-sm font-normal text-muted-foreground ml-1">
                          {item.unit}
                        </span>
                      </div>
                      {dailyValuePercentage > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {dailyValuePercentage}% DV*
                        </div>
                      )}
                    </div>
                    
                    {dailyValuePercentage > 0 && (
                      <div className="w-16 h-2 bg-background/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color.replace('text-', 'bg-')} transition-all duration-500`}
                          style={{ width: `${Math.min(dailyValuePercentage, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Daily Value Note */}
          <div className="text-xs text-muted-foreground border-t pt-4">
            <p>
              * Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutrition;
