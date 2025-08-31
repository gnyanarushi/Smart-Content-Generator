import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { contentService, type ContentResponse } from '@/services/api';
import { Star, FileText, Image as ImageIcon } from 'lucide-react';

export const Favorites = () => {
  const [favorites, setFavorites] = useState<ContentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchFavorites = async () => {
    try {
      const data = await contentService.getFavorites();
      setFavorites(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch favorites',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleUnfavorite = async (id: string) => {
    try {
      await contentService.toggleFavorite(id);
      await fetchFavorites(); // Refresh the list
      toast({
        title: 'Removed from Favorites',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorite status',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-gradient">Favorites</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No favorites yet. Start adding some!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <Card key={item._id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                {item.type === 'image' ? (
                  <ImageIcon className="w-5 h-5 text-primary" />
                ) : (
                  <FileText className="w-5 h-5 text-primary" />
                )}
                <h3 className="text-lg font-semibold flex-1 truncate">{item.topic}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnfavorite(item._id)}
                >
                  <Star className="w-4 h-4 fill-current text-primary" />
                </Button>
              </div>

              {item.imageUrl && (
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <img
                    src={item.imageUrl}
                    alt={item.topic}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.content}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/content/${item._id}`)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
