import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderPlus,
  Folder,
  FolderOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  BookmarkPlus,
  BookmarkCheck,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import supabase from '@/config/supabase';
import { formatDate } from '@/lib/utils';

const Collections = ({ recipeId, onCollectionUpdate }) => {
  const [collections, setCollections] = useState([]);
  const [userCollections, setUserCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddToCollection, setShowAddToCollection] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [collectionForm, setCollectionForm] = useState({
    name: '',
    description: '',
    isPublic: false
  });
  const [submitting, setSubmitting] = useState(false);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      fetchUserCollections();
    }
    if (recipeId) {
      fetchRecipeCollections();
    }
  }, [currentUser, recipeId]);

  const fetchUserCollections = async () => {
    if (!currentUser) return;

    try {
      let userMappings = {};
      try {
        userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
      } catch (err) {
        console.error('Error parsing userMappings from localStorage:', err);
        userMappings = {};
      }
      const userUuid = userMappings[currentUser.uid];

      if (!userUuid) return;

      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_recipes (
            recipe_id
          )
        `)
        .eq('user_id', userUuid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserCollections(data || []);
    } catch (error) {
      console.error('Error fetching user collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipeCollections = async () => {
    if (!recipeId) return;

    try {
      const { data, error } = await supabase
        .from('collection_recipes')
        .select(`
          collection_id,
          collections (
            id,
            name,
            description,
            is_public,
            user_id,
            created_at
          )
        `)
        .eq('recipe_id', recipeId);

      if (error) throw error;

      const collectionsData = data?.map(item => item.collections).filter(Boolean) || [];
      setCollections(collectionsData);
    } catch (error) {
      console.error('Error fetching recipe collections:', error);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!currentUser || !collectionForm.name.trim()) return;

    setSubmitting(true);
    try {
      const userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
      const userUuid = userMappings[currentUser.uid];

      if (!userUuid) return;

      const collectionData = {
        user_id: userUuid,
        name: collectionForm.name.trim(),
        description: collectionForm.description.trim(),
        is_public: collectionForm.isPublic
      };

      if (editingCollection) {
        // Update existing collection
        const { error } = await supabase
          .from('collections')
          .update(collectionData)
          .eq('id', editingCollection.id);

        if (error) throw error;
        setEditingCollection(null);
      } else {
        // Create new collection
        const { data, error } = await supabase
          .from('collections')
          .insert(collectionData)
          .select()
          .single();

        if (error) throw error;
      }

      setShowCreateForm(false);
      setCollectionForm({ name: '', description: '', isPublic: false });
      fetchUserCollections();

      if (onCollectionUpdate) {
        onCollectionUpdate();
      }
    } catch (error) {
      console.error('Error saving collection:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    if (!window.confirm('Are you sure you want to delete this collection? This will remove all recipes from it.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collectionId);

      if (error) throw error;

      fetchUserCollections();
      if (recipeId) {
        fetchRecipeCollections();
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  const handleAddToCollection = async (collectionId) => {
    if (!recipeId || !currentUser) return;

    try {
      // Check if recipe is already in collection
      const { data: existing } = await supabase
        .from('collection_recipes')
        .select('id')
        .eq('collection_id', collectionId)
        .eq('recipe_id', recipeId)
        .single();

      if (existing) {
        // Remove from collection
        const { error } = await supabase
          .from('collection_recipes')
          .delete()
          .eq('collection_id', collectionId)
          .eq('recipe_id', recipeId);

        if (error) throw error;
      } else {
        // Add to collection
        const { error } = await supabase
          .from('collection_recipes')
          .insert({
            collection_id: collectionId,
            recipe_id: recipeId
          });

        if (error) throw error;
      }

      fetchUserCollections();
      fetchRecipeCollections();
    } catch (error) {
      console.error('Error updating collection:', error);
    }
  };

  const isRecipeInCollection = (collectionId) => {
    return userCollections
      .find(c => c.id === collectionId)
      ?.collection_recipes?.some(cr => cr.recipe_id === recipeId) || false;
  };

  const startEditCollection = (collection) => {
    setEditingCollection(collection);
    setCollectionForm({
      name: collection.name,
      description: collection.description || '',
      isPublic: collection.is_public
    });
    setShowCreateForm(true);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-muted rounded w-1/3"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Collections Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Collections</h3>
        {currentUser && (
          <div className="flex gap-2">
            {recipeId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddToCollection(!showAddToCollection)}
                className="flex items-center gap-2"
              >
                <BookmarkPlus className="h-4 w-4" />
                Add to Collection
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2"
            >
              <FolderPlus className="h-4 w-4" />
              New Collection
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Collection Form */}
      <AnimatePresence>
        {showCreateForm && currentUser && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-6 bg-card"
          >
            <h4 className="font-semibold mb-4">
              {editingCollection ? 'Edit Collection' : 'Create New Collection'}
            </h4>

            <form onSubmit={handleCreateCollection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Collection Name *
                </label>
                <input
                  type="text"
                  value={collectionForm.name}
                  onChange={(e) => setCollectionForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Enter collection name..."
                  required
                  maxLength={255}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={collectionForm.description}
                  onChange={(e) => setCollectionForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Describe your collection..."
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={collectionForm.isPublic}
                  onChange={(e) => setCollectionForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isPublic" className="text-sm flex items-center gap-2">
                  {collectionForm.isPublic ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  Make this collection public
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting || !collectionForm.name.trim()}
                  className="flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      {editingCollection ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <FolderPlus className="h-4 w-4" />
                      {editingCollection ? 'Update Collection' : 'Create Collection'}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingCollection(null);
                    setCollectionForm({ name: '', description: '', isPublic: false });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add to Collection Panel */}
      <AnimatePresence>
        {showAddToCollection && currentUser && recipeId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-6 bg-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Add to Collection</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddToCollection(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {userCollections.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No collections yet. Create one first!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {userCollections.map((collection) => {
                  const isInCollection = isRecipeInCollection(collection.id);
                  return (
                    <div
                      key={collection.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {collection.is_public ? (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <div className="font-medium">{collection.name}</div>
                          {collection.description && (
                            <div className="text-sm text-muted-foreground">
                              {collection.description}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {collection.collection_recipes?.length || 0} recipe{(collection.collection_recipes?.length || 0) !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant={isInCollection ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleAddToCollection(collection.id)}
                        className="flex items-center gap-2"
                      >
                        {isInCollection ? (
                          <>
                            <BookmarkCheck className="h-4 w-4" />
                            Added
                          </>
                        ) : (
                          <>
                            <BookmarkPlus className="h-4 w-4" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Collections */}
      {currentUser && userCollections.length > 0 && (
        <div>
          <h4 className="font-semibold mb-4">Your Collections</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userCollections.map((collection) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {collection.is_public ? (
                      <FolderOpen className="h-5 w-5 text-primary" />
                    ) : (
                      <Folder className="h-5 w-5 text-muted-foreground" />
                    )}
                    <h5 className="font-medium">{collection.name}</h5>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditCollection(collection)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCollection(collection.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {collection.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {collection.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {collection.collection_recipes?.length || 0} recipe{(collection.collection_recipes?.length || 0) !== 1 ? 's' : ''}
                  </span>
                  <span>{formatDate(collection.created_at)}</span>
                </div>

                {collection.is_public && (
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      <Eye className="h-3 w-3" />
                      Public
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recipe Collections (if viewing a specific recipe) */}
      {recipeId && collections.length > 0 && (
        <div>
          <h4 className="font-semibold mb-4">This recipe is in these collections:</h4>
          <div className="flex flex-wrap gap-2">
            {collections.map((collection) => (
              <span
                key={collection.id}
                className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm"
              >
                {collection.is_public ? (
                  <FolderOpen className="h-4 w-4" />
                ) : (
                  <Folder className="h-4 w-4" />
                )}
                {collection.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {currentUser && userCollections.length === 0 && !showCreateForm && (
        <div className="text-center py-8 text-muted-foreground">
          <FolderPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="mb-4">You haven't created any collections yet.</p>
          <Button
            variant="outline"
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            Create Your First Collection
          </Button>
        </div>
      )}
    </div>
  );
};

export default Collections;
