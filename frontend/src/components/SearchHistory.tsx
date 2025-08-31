import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  Clock,
  Search,
  ImageIcon,
  FileText,
  MessageSquare,
  Bot
} from "lucide-react";

export interface HistoryItem {
  id: string;
  type: 'search' | 'image' | 'content' | 'chat';
  query: string;
  timestamp: string;
  contentId?: string;  // Add contentId for direct navigation
  searchResults?: Array<{
    url: string;
    photographer: string;
    alt: string;
  }>;  // Add searchResults for image searches
  details?: {
    type?: string;
    prompt?: string;
    response?: string;
    imageUrl?: string;
    id?: string;  // Add id in details for backward compatibility
  };
}

interface SearchHistoryProps {
  items?: HistoryItem[];
  onItemClick?: (item: HistoryItem) => void;
}

const getIconForType = (type: HistoryItem['type']) => {
  switch (type) {
    case 'search':
      return <Search className="h-4 w-4" />;
    case 'image':
      return <ImageIcon className="h-4 w-4" />;
    case 'content':
      return <FileText className="h-4 w-4" />;
    case 'chat':
      return <MessageSquare className="h-4 w-4" />;
    default:
      return <Bot className="h-4 w-4" />;
  }
};

export const SearchHistory = ({ items = [], onItemClick }: SearchHistoryProps) => {
  return (
    <Card className="flex flex-col h-full">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Search History
        </h2>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              No history yet. Start creating content!
            </div>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick?.(item)}
                className="w-full text-left group hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center">
                    {getIconForType(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.query}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                    {item.details?.type && (
                      <p className="text-xs text-primary mt-1">
                        {item.details.type.charAt(0).toUpperCase() + item.details.type.slice(1)}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
