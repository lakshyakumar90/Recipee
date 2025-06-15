export const getDietaryType = (tags) => {
  if (!tags || !Array.isArray(tags)) return null;

  const lowerTags = tags.map(tag => tag.toLowerCase());

  if (lowerTags.some(tag => tag.includes('vegan'))) {
    return 'vegan';
  }

  if (lowerTags.some(tag => tag.includes('vegetarian') ||
    tag.includes('veggie') ||
    tag.includes('dessert') ||
    tag.includes('cookies') ||
    tag.includes('chocolate'))) {
    return 'vegetarian';
  }

  const nonVegKeywords = ['chicken', 'beef', 'pork', 'fish', 'meat', 'seafood', 'lamb', 'turkey', 'bacon', 'ham', 'sausage'];
  if (lowerTags.some(tag => nonVegKeywords.some(keyword => tag.includes(keyword)))) {
    return 'non-vegetarian';
  }
  return null;
};

export const getDietaryIcon = (dietaryType) => {
  switch (dietaryType) {
    case 'vegan':
      return '🌱'; 
    case 'vegetarian':
      return '🥬'; 
    case 'non-vegetarian':
      return '🍖'; 
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
