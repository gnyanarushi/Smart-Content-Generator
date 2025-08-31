import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { contentService, type ContentResponse } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

export const ContentList = () => {
  const [contents, setContents] = useState<ContentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const data = await contentService.getAllContents();
        setContents(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch contents. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, [toast]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gradient">Generated Content</h1>
        <Button onClick={() => navigate('/generate')}>Create New</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contents.map((content) => (
          <Card key={content._id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2 truncate">{content.topic}</h2>
                <span className="inline-block px-2 py-1 text-sm rounded-full bg-primary/10 text-primary">
                  {content.type}
                </span>
              </div>
              
              {content.imageUrl && (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={content.imageUrl}
                    alt={content.topic}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              <p className="text-muted-foreground line-clamp-3">
                {content.content}
              </p>

              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/content/${content._id}`)}
                >
                  View Details
                </Button>
                <span className="text-sm text-muted-foreground">
                  {new Date(content.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {contents.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No Content Yet</h2>
          <p className="text-muted-foreground mb-4">
            Start by generating some content using our AI tools.
          </p>
          <Button onClick={() => navigate('/generate')}>
            Create Your First Content
          </Button>
        </div>
      )}
    </div>
  );
};
