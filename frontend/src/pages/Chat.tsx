import { useState, useRef, useEffect } from 'react';
import { AppSidebar } from '@/components/Sidebar';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/components/ui/use-toast';
import { useSearchHistoryContext } from '@/hooks/use-search-history';
import { contentService, type ChatMessage } from '@/services/api';
import { 
  Send,
  Mic,
  Bot,
  User,
  Image as ImageIcon,
  FileText,
  Sparkles,
  Code,
  RefreshCw
} from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const suggestedPrompts = [
  {
    title: 'Content Creation',
    prompts: [
      "Write a blog post about sustainable living",
      "Create a social media campaign for a new product",
      "Generate email copy for a welcome sequence"
    ]
  },
  {
    title: 'Creative Writing',
    prompts: [
      "Write a short story about time travel",
      "Create a character description for a novel",
      "Generate a plot outline for a mystery"
    ]
  },
  {
    title: 'Business',
    prompts: [
      "Write a business proposal template",
      "Create a marketing strategy outline",
      "Generate a company mission statement"
    ]
  }
];

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI assistant. How can I help you today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addToHistory } = useSearchHistoryContext();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await contentService.sendMessage(message);
      setMessages(prev => [...prev, response]);
      
      // Add to history
      addToHistory({
        type: 'content',
        query: message.substring(0, 100), // Limit length for display
        details: {
          type: 'chat',
          prompt: message,
          response: response.content
        }
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const usePrompt = (prompt: string) => {
    setMessage(prompt);
    inputRef.current?.focus();
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background w-full">
        <AppSidebar />
        
        <main ref={containerRef} className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="mr-2" />
                <Avatar className="h-8 w-8 bg-gradient-primary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">AI Assistant</h2>
                  <p className="text-sm text-muted-foreground">Smart Content Creation</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setMessages([messages[0]]);
                    setMessage('');
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="h-full flex">
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto space-y-6">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${
                        msg.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div className="shrink-0">
                        <Avatar className={`h-8 w-8 ${msg.role === 'user' ? 'bg-primary' : 'bg-secondary'} flex items-center justify-center`}>
                          {msg.role === 'user' ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-white" />
                          )}
                        </Avatar>
                      </div>
                      <div
                        className={`flex-1 rounded-lg p-4 ${
                          msg.role === 'user'
                            ? 'bg-primary/10 ml-12'
                            : 'bg-muted mr-12'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                        <span className="text-xs text-muted-foreground mt-2 block">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <div className="shrink-0">
                        <Avatar className="h-8 w-8 bg-secondary flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </Avatar>
                      </div>
                      <Card className="p-4">
                        <LoadingSpinner />
                      </Card>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="max-w-3xl mx-auto space-y-2">
                  {/* Quick Actions */}
                  <div className="flex items-center gap-1 px-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Code className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Input Area */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="pr-10"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Mic className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button 
                      className="h-10 w-10 rounded-full p-0 flex items-center justify-center"
                      onClick={handleSendMessage}
                      disabled={isLoading || !message.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestions Sidebar */}
            <div className="w-80 border-l p-4 hidden lg:block overflow-y-auto">
              <div className="space-y-6">
                {suggestedPrompts.map((category, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-semibold mb-3">{category.title}</h3>
                    <div className="space-y-2">
                      {category.prompts.map((prompt, promptIndex) => (
                        <button
                          key={promptIndex}
                          onClick={() => usePrompt(prompt)}
                          className="w-full p-2 text-left text-sm rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Chat;