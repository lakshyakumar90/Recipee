import { getDietaryType, getDietaryIcon, getDietaryColor, getDietaryLabel } from '@/utils/dietaryUtils';

const DietaryBadge = ({ tags, size = 'sm' }) => {
  const dietaryType = getDietaryType(tags);
  
  if (!dietaryType) return null;
  
  const icon = getDietaryIcon(dietaryType);
  const colorClass = getDietaryColor(dietaryType);
  const label = getDietaryLabel(dietaryType);
  
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1.5',
    lg: 'text-base px-3 py-2'
  };
  
  return (
    <span 
      className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        ${colorClass} 
        ${sizeClasses[size]}
      `}
    >
      <span className="text-sm">{icon}</span>
      <span>{label}</span>
    </span>
  );
};

export default DietaryBadge;