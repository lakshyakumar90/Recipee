import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';

export default function ReviewForm({
  initialRating = 0,
  initialTitle = '',
  initialContent = '',
  onSubmit,
  onCancel,
  isSubmitting,
  isEditing = false,
  onRatingChange,
}) {
  const [formData, setFormData] = useState({
    rating: initialRating,
    title: initialTitle,
    content: initialContent,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.content.trim() && formData.rating) {
      onSubmit(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border rounded-lg p-6 bg-card"
    >
      <h4 className="font-semibold mb-4">
        {isEditing ? 'Edit Your Review' : 'Write a Review'}
      </h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Rating (required)
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={(rating) => {
              setFormData(prev => ({ ...prev, rating }));
              onRatingChange?.(rating);
            }}
            size="lg"
            showValue={false}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Review Title (optional)
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Give your review a title..."
            maxLength={255}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Review (required)
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px]"
            placeholder="Share your thoughts about this recipe..."
            required
            maxLength={2000}
          />
          <div className="text-xs text-muted-foreground mt-1">
            {formData.content.length}/2000 characters
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || !formData.content.trim() || !formData.rating}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                {isEditing ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4" />
                {isEditing ? 'Update Review' : 'Submit Review'}
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
