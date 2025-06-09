import { useState } from 'react';
import { Search, Filter, X, Clock, ChefHat, Users, Star, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const SearchFilters = ({ onSearch, onFiltersChange, onSortChange, initialFilters = {} }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    difficulty: '',
    maxCookTime: '',
    minCookTime: '',
    cuisine: '',
    dietary: '',
    minRating: '',
    maxServings: '',
    minServings: '',
    ...initialFilters
  });

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const cookTimes = [
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '2+ hours', value: 120 }
  ];
  const cuisines = [
    'Italian', 'Mexican', 'Chinese', 'Indian', 'American',
    'French', 'Japanese', 'Thai', 'Mediterranean', 'Korean',
    'Spanish', 'Greek', 'Lebanese', 'Vietnamese', 'Brazilian'
  ];
  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
    'Keto', 'Low-Carb', 'High-Protein', 'Paleo', 'Whole30',
    'Sugar-Free', 'Nut-Free', 'Soy-Free'
  ];
  const sortOptions = [
    { label: 'Newest First', value: 'created_at', order: 'desc' },
    { label: 'Oldest First', value: 'created_at', order: 'asc' },
    { label: 'Highest Rated', value: 'rating', order: 'desc' },
    { label: 'Most Reviews', value: 'review_count', order: 'desc' },
    { label: 'Shortest Cook Time', value: 'cook_time', order: 'asc' },
    { label: 'Longest Cook Time', value: 'cook_time', order: 'desc' },
    { label: 'Alphabetical A-Z', value: 'title', order: 'asc' },
    { label: 'Alphabetical Z-A', value: 'title', order: 'desc' }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: filters[filterType] === value ? '' : value
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption.value);
    setSortOrder(sortOption.order);
    if (onSortChange) {
      onSortChange({ sortBy: sortOption.value, sortOrder: sortOption.order });
    }
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      difficulty: '',
      maxCookTime: '',
      minCookTime: '',
      cuisine: '',
      dietary: '',
      minRating: '',
      maxServings: '',
      minServings: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar and Controls */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Search recipes by name, description, ingredients, or tags..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [value, order] = e.target.value.split('-');
              handleSortChange({ value, order });
            }}
            className="appearance-none bg-background border rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[180px]"
          >
            {sortOptions.map((option) => (
              <option key={`${option.value}-${option.order}`} value={`${option.value}-${option.order}`}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4 text-muted-foreground" />
            ) : (
              <SortDesc className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 ml-1">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={clearAllFilters} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border rounded-lg p-4 bg-card space-y-6"
          >
            {/* Difficulty Filter */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Difficulty
              </h3>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={filters.difficulty === difficulty ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('difficulty', difficulty)}
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>

            {/* Cook Time Filter */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Max Cook Time
              </h3>
              <div className="flex flex-wrap gap-2">
                {cookTimes.map((time) => (
                  <Button
                    key={time.value}
                    variant={filters.maxCookTime === time.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('maxCookTime', time.value)}
                  >
                    {time.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Cuisine Filter */}
            <div>
              <h3 className="font-medium mb-3">Cuisine</h3>
              <div className="flex flex-wrap gap-2">
                {cuisines.map((cuisine) => (
                  <Button
                    key={cuisine}
                    variant={filters.cuisine === cuisine ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('cuisine', cuisine)}
                  >
                    {cuisine}
                  </Button>
                ))}
              </div>
            </div>

            {/* Dietary Filter */}
            <div>
              <h3 className="font-medium mb-3">Dietary</h3>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map((dietary) => (
                  <Button
                    key={dietary}
                    variant={filters.dietary === dietary ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('dietary', dietary)}
                  >
                    {dietary}
                  </Button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Minimum Rating
              </h3>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={filters.minRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('minRating', rating)}
                    className="flex items-center gap-1"
                  >
                    {rating}
                    <Star className="h-3 w-3 fill-current" />
                    +
                  </Button>
                ))}
              </div>
            </div>

            {/* Servings Filter */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Servings
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Minimum</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={filters.minServings}
                    onChange={(e) => handleFilterChange('minServings', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Min"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Maximum</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={filters.maxServings}
                    onChange={(e) => handleFilterChange('maxServings', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            {/* Cook Time Range Filter */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Cook Time Range (minutes)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Minimum</label>
                  <input
                    type="number"
                    min="1"
                    max="480"
                    value={filters.minCookTime}
                    onChange={(e) => handleFilterChange('minCookTime', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Min"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Maximum</label>
                  <input
                    type="number"
                    min="1"
                    max="480"
                    value={filters.maxCookTime}
                    onChange={(e) => handleFilterChange('maxCookTime', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilters;
