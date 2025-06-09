// Utility functions for dietary indicators

export const getDietaryType = (tags) => {
  if (!tags || !Array.isArray(tags)) return null;
  
  const lowerTags = tags.map(tag => tag.toLowerCase());
  
  // Check for vegan first (vegan is also vegetarian)
  if (lowerTags.some(tag => tag.includes('vegan'))) {
    return 'vegan';
  }
  
  // Check for vegetarian
  if (lowerTags.some(tag => tag.includes('vegetarian') || tag.includes('veggie'))) {
    return 'vegetarian';
  }
  
  // Check for non-vegetarian indicators
  const nonVegKeywords = ['chicken', 'beef', 'pork', 'fish', 'meat', 'seafood', 'lamb', 'turkey', 'bacon', 'ham', 'sausage'];
  if (lowerTags.some(tag => nonVegKeywords.some(keyword => tag.includes(keyword)))) {
    return 'non-vegetarian';
  }
  
  // Default to null if no clear indication
  return null;
};

export const getDietaryIcon = (dietaryType) => {
  switch (dietaryType) {
    case 'vegan':
      return '🌱'; // Plant emoji for vegan
    case 'vegetarian':
      return '🥬'; // Leafy greens for vegetarian
    case 'non-vegetarian':
      return '🍖'; // Meat emoji for non-vegetarian
    default:
      return null;
  }
};

export const getDietaryColor = (dietaryType) => {
  switch (dietaryType) {
    case 'vegan':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'vegetarian':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'non-vegetarian':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

export const getDietaryLabel = (dietaryType) => {
  switch (dietaryType) {
    case 'vegan':
      return 'Vegan';
    case 'vegetarian':
      return 'Vegetarian';
    case 'non-vegetarian':
      return 'Non-Veg';
    default:
      return null;
  }
};
