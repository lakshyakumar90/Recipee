import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  Folder,
  Eye,
  EyeOff,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import supabase from '@/config/supabase';
import { formatDate } from '@/lib/utils';
import Collections from '@/components/Collections';
import CollectionRecipeManager from '@/components/CollectionRecipeManager';

const CollectionsPage = () => {
  const { id } = useParams();
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchCollections();
  }, [currentUser]);

  useEffect(() => {
    if (id) {
      fetchCollectionById(id);
    }
  }, [id]);



  const fetchCollections = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      const userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
      const userUuid = userMappings[currentUser.uid];

      if (!userUuid) {
        setLoading(false);
        return;
      }

      // Fetch user's collections and public collections
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_recipes (
            recipe_id
          )
        `)
        .or(`user_id.eq.${userUuid},is_public.eq.true`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectionById = async (collectionId) => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_recipes (
            recipe_id
          )
        `)
        .eq('id', collectionId)
        .single();

      if (error) throw error;
      setSelectedCollection(data);
    } catch (error) {
      console.error('Error fetching collection:', error);
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return;

    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collectionId);

      if (error) throw error;

      // If we're viewing the deleted collection, go back to collections list
      if (selectedCollection?.id === collectionId) {
        setSelectedCollection(null);
        window.history.pushState({}, '', '/collections');
      }

      fetchCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  const isOwner = (collection) => {
    if (!currentUser) return false;
    const userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
    const userUuid = userMappings[currentUser.uid];
    return collection.user_id === userUuid;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border rounded-lg p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If viewing a specific collection
  if (selectedCollection) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedCollection(null);
            window.history.pushState({}, '', '/collections');
          }}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collections
        </Button>

        {/* Collection Recipe Manager */}
        <CollectionRecipeManager
          collection={selectedCollection}
          onUpdate={fetchCollections}
        />
      </div>
    );
  }

  // Collections list view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recipe Collections</h1>
      </div>

      {/* Collections Component */}
      <Collections onCollectionUpdate={fetchCollections} />

      {/* Collections Grid */}
      {collections.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {currentUser ? 'Your Collections & Public Collections' : 'Public Collections'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedCollection(collection);
                  window.history.pushState({}, '', `/collections/${collection.id}`);
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {collection.is_public ? (
                      <FolderOpen className="h-6 w-6 text-primary" />
                    ) : (
                      <Folder className="h-6 w-6 text-muted-foreground" />
                    )}
                    <div>
                      <h3 className="font-semibold">{collection.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {collection.is_public ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                        <span>{collection.is_public ? 'Public' : 'Private'}</span>
                      </div>
                    </div>
                  </div>

                  {isOwner(collection) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCollection(collection.id);
                      }}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {collection.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {collection.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {collection.collection_recipes?.length || 0} recipe{(collection.collection_recipes?.length || 0) !== 1 ? 's' : ''}
                  </span>
                  <span>{formatDate(collection.created_at)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
