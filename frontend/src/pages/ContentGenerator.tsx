import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useSearchHistoryContext } from '@/hooks/use-search-history';
import { contentService } from '@/services/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const contentTypes = [
  { value: 'blog', label: 'Blog Post' },
  { value: 'article', label: 'Article' },
  { value: 'social', label: 'Social Media Post' },
  { value: 'email', label: 'Email Copy' },
  { value: 'summary', label: 'Summary' }
];

export const ContentGenerator = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('blog');
  const [generatedContent, setGeneratedContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addToHistory } = useSearchHistoryContext();

  // Set the content type when navigating from dashboard
  useEffect(() => {
    const state = location.state as { selectedType?: string };
    if (state?.selectedType) {
      setType(state.selectedType);
      // Clear the state to prevent it from being reapplied on manual navigation
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !type) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await contentService.generateContent({ topic, type, content: undefined });
      setGeneratedContent(response.content);
      
      // Add to history with content ID
      addToHistory({
        type: 'content',
        query: topic,
        contentId: response._id.toString(), // Ensure ID is stored as string
        details: {
          type,
          prompt: topic,
          response: response.content
        }
      });
      
      toast({
        title: 'Content Generated',
        description: 'Your content has been generated successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast({
        title: 'No File Selected',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    setIsLoading(true);
    try {
      const response = await contentService.generateContent(formData);
      setGeneratedContent(response.content);
      
      // Add to history with content ID
      addToHistory({
        type: 'content',
        query: file.name,
        contentId: response._id.toString(), // Ensure ID is stored as string
        details: {
          type,
          prompt: `File: ${file.name}`,
          response: response.content
        }
      });
      
      toast({
        title: 'Content Generated',
        description: 'Your content has been generated from the file successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate content from file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-gradient">AI Content Generator</h1>
      
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Generate from Text</TabsTrigger>
          <TabsTrigger value="file">Generate from File</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <Card className="p-6">
            <form onSubmit={handleTextSubmit} className="space-y-6">
              <div>
                <Input
                  placeholder="Enter your topic..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mb-4"
                />
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Generate Content</Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="file">
          <Card className="p-6">
            <form onSubmit={handleFileSubmit} className="space-y-6">
              <div>
                <Input
                  type="file"
                  ref={fileInputRef}
                  className="mb-4"
                />
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Generate from File</Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      {generatedContent && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-semibold mb-4">Generated Content</h2>
          <Textarea
            value={generatedContent}
            readOnly
            className="min-h-[200px]"
          />
          <Button 
            className="mt-4"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(generatedContent);
                toast({
                  title: "Copied!",
                  description: "Content has been copied to clipboard",
                  duration: 2000
                });
              } catch (error) {
                toast({
                  title: "Failed to copy",
                  description: "Please try copying manually",
                  variant: "destructive"
                });
              }
            }}
          >
            Copy to Clipboard
          </Button>
        </Card>
      )}
    </div>
  );
};
