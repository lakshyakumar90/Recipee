import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp, Flag, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import supabase from '@/config/supabase';
import StarRating from './StarRating';
import { formatDate } from '@/lib/utils';

const Reviews = ({ recipeId, averageRating, totalReviews, onRatingUpdate }) => {
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchReviews();
    if (currentUser) {
      fetchUserRating();
    }
  }, [recipeId, currentUser]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          ratings (rating)
        `)
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enhance reviews with user names if not already present
      const enhancedReviews = (data || []).map(review => {
        if (!review.user_name) {
          // Try to get user name from localStorage userMappings
          try {
            const userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
            const firebaseUid = Object.keys(userMappings).find(uid => userMappings[uid] === review.user_id);

            if (firebaseUid && currentUser && currentUser.uid === firebaseUid) {
              // This is the current user's review
              review.user_name = currentUser.displayName || currentUser.email?.split('@')[0] || 'You';
            } else {
              // For other users, use a generic name
              review.user_name = 'User';
            }
          } catch (err) {
            // If localStorage parsing fails, use fallback
            review.user_name = 'User';
          }
        }
        return review;
      });

      setReviews(enhancedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRating = async () => {
    if (!currentUser) return;

    try {
      // Get user UUID mapping
      const userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
      const userUuid = userMappings[currentUser.uid];

      if (!userUuid) return;

      // Fetch user's rating
      const { data: ratingData, error: ratingError } = await supabase
        .from('ratings')
        .select('*')
        .eq('recipe_id', recipeId)
        .eq('user_id', userUuid)
        .single();

      if (ratingData) {
        setUserRating(ratingData);
        setReviewForm(prev => ({ ...prev, rating: ratingData.rating }));
      }

      // Fetch user's review
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .select('*')
        .eq('recipe_id', recipeId)
        .eq('user_id', userUuid)
        .single();

      if (reviewData) {
        setUserReview(reviewData);
        setReviewForm({
          rating: ratingData?.rating || 0,
          title: reviewData.title || '',
          content: reviewData.content || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user rating/review:', error);
    }
  };

  const handleRatingChange = async (rating) => {
    if (!currentUser) return;

    try {
      const userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
      const userUuid = userMappings[currentUser.uid];

      if (!userUuid) return;

      const ratingData = {
        recipe_id: recipeId,
        user_id: userUuid,
        rating: rating
      };

      if (userRating) {
        // Update existing rating
        const { error } = await supabase
          .from('ratings')
          .update({ rating })
          .eq('id', userRating.id);

        if (error) throw error;
        setUserRating({ ...userRating, rating });
      } else {
        // Create new rating
        const { data, error } = await supabase
          .from('ratings')
          .insert(ratingData)
          .select()
          .single();

        if (error) throw error;
        setUserRating(data);
      }

      setReviewForm(prev => ({ ...prev, rating }));

      // Notify parent component to update average rating
      if (onRatingUpdate) {
        onRatingUpdate();
      }
    } catch (error) {
      console.error('Error saving rating:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !reviewForm.content.trim()) return;

    setSubmitting(true);
    try {
      const userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
      const userUuid = userMappings[currentUser.uid];

      if (!userUuid) return;

      const reviewData = {
        recipe_id: recipeId,
        user_id: userUuid,
        rating_id: userRating?.id,
        title: reviewForm.title.trim(),
        content: reviewForm.content.trim(),
        user_name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous'
      };

      if (editingReview) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({
            title: reviewData.title,
            content: reviewData.content
          })
          .eq('id', editingReview.id);

        if (error) throw error;
        setEditingReview(null);
      } else {
        // Create new review
        const { data, error } = await supabase
          .from('reviews')
          .insert(reviewData)
          .select()
          .single();

        if (error) throw error;
        setUserReview(data);
      }

      setShowReviewForm(false);
      setReviewForm({ rating: userRating?.rating || 0, title: '', content: '' });
      fetchReviews();
    } catch (error) {
      console.error('Error saving review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setUserReview(null);
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const startEditReview = (review) => {
    setEditingReview(review);
    setReviewForm({
      rating: userRating?.rating || 0,
      title: review.title || '',
      content: review.content || ''
    });
    setShowReviewForm(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-1"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="border rounded-lg p-6 bg-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Reviews & Ratings</h3>
          {currentUser && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {userReview ? 'Edit Review' : 'Write Review'}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {averageRating ? averageRating.toFixed(1) : '0.0'}
            </div>
            <StarRating rating={averageRating || 0} readonly size="lg" showValue={false} />
            <div className="text-sm text-muted-foreground mt-2">
              Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </div>
          </div>

          {currentUser && (
            <div>
              <h4 className="font-medium mb-3">Your Rating</h4>
              <StarRating
                rating={userRating?.rating || 0}
                onRatingChange={handleRatingChange}
                size="lg"
                showValue={false}
              />
              {userRating && (
                <div className="text-sm text-muted-foreground mt-2">
                  You rated this recipe {userRating.rating} star{userRating.rating !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && currentUser && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-6 bg-card"
          >
            <h4 className="font-semibold mb-4">
              {editingReview ? 'Edit Your Review' : 'Write a Review'}
            </h4>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rating (required)
                </label>
                <StarRating
                  rating={reviewForm.rating}
                  onRatingChange={(rating) => {
                    setReviewForm(prev => ({ ...prev, rating }));
                    handleRatingChange(rating);
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
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
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
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px]"
                  placeholder="Share your thoughts about this recipe..."
                  required
                  maxLength={2000}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {reviewForm.content.length}/2000 characters
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting || !reviewForm.content.trim() || !reviewForm.rating}
                  className="flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      {editingReview ? 'Updating...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4" />
                      {editingReview ? 'Update Review' : 'Submit Review'}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowReviewForm(false);
                    setEditingReview(null);
                    setReviewForm({
                      rating: userRating?.rating || 0,
                      title: userReview?.title || '',
                      content: userReview?.content || ''
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="font-semibold">
          All Reviews ({reviews.length})
        </h4>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No reviews yet. Be the first to review this recipe!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 bg-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {review.user_name ? review.user_name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm mb-1">
                        {review.user_name || 'Anonymous User'}
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating
                          rating={review.ratings?.rating || 0}
                          readonly
                          size="sm"
                          showValue={false}
                        />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {currentUser && review.user_id === JSON.parse(localStorage.getItem('userMappings') || '{}')[currentUser.uid] && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditReview(review)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReview(review.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {review.title && (
                  <h5 className="font-medium mb-2">{review.title}</h5>
                )}

                <p className="text-muted-foreground leading-relaxed">
                  {review.content}
                </p>

                {review.updated_at !== review.created_at && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Edited {formatDate(review.updated_at)}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
