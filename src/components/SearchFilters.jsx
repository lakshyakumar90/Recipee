import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const SearchFilters = ({ onSearch, onFiltersChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dietary: ''
  });

  const dietaryOptions = [
    { display: 'Vegetarian', value: 'vegetarian' },
    { display: 'Vegan', value: 'vegan' },
    { display: 'Non-Vegetarian', value: 'non-vegetarian' }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (value) => {
    const newFilters = {
      dietary: filters.dietary === value ? '' : value
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = { dietary: '' };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFiltersCount = filters.dietary ? 1 : 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Diet Type
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 ml-1">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={clearAllFilters} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border rounded-lg p-4 bg-card"
          >
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={filters.dietary === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(option.value)}
                >
                  {option.display}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilters;
