import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';

const Reviews = ({ averageRating = 4.5 }) => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample reviews data
  useEffect(() => {
    const sampleReviews = [
      {
        id: 1,
        user_name: 'John',
        rating: 5,
        title: 'Amazing recipe!',
        content: 'This was so delicious and easy to make. Will definitely cook again!',
        created_at: '2023-05-15'
      },
      {
        id: 2,
        user_name: 'Sarah',
        rating: 4,
        title: 'Tasty and simple',
        content: 'Loved the flavors, though I added a bit more spice to my taste.',
        created_at: '2023-05-10'
      }
    ];
    setReviews(sampleReviews);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.content.trim() || !formData.rating) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newReview = {
        id: Date.now(),
        user_name: 'You',
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
        created_at: new Date().toISOString().split('T')[0]
      };
      
      setReviews([newReview, ...reviews]);
      setFormData({ rating: 0, title: '', content: '' });
      setShowForm(false);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Reviews</h3>
          <Button onClick={() => setShowForm(!showForm)} variant="outline">
            {showForm ? 'Cancel' : 'Write a Review'}
          </Button>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <StarRating rating={averageRating} readonly size="lg" />
          <div className="text-sm text-gray-500 mt-1">
            Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg">
            <div>
              <label className="block mb-2">Your Rating</label>
              <StarRating
                rating={formData.rating}
                onRatingChange={(rating) => setFormData({...formData, rating})}
                size="lg"
              />
            </div>

            <div>
              <label className="block mb-2">Title (optional)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Add a title..."
              />
            </div>

            <div>
              <label className="block mb-2">Your Review</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full p-2 border rounded h-24"
                placeholder="Share your thoughts..."
                required
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium">
          All Reviews ({reviews.length})
        </h4>

        {reviews.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {review.user_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{review.user_name}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <StarRating rating={review.rating} readonly size="sm" />
                      <span>•</span>
                      <span>{review.created_at}</span>
                    </div>
                  </div>
                </div>

                {review.title && (
                  <h5 className="font-medium mt-2">{review.title}</h5>
                )}
                <p className="text-gray-700 mt-1">{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
