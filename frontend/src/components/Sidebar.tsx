import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchHistoryContext } from '@/hooks/use-search-history';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  Search,
  Clock,
  Triangle,
  MessageSquare,
  Library,
  Settings,
  FileText,
  Image as ImageIcon,
  Database,
  PenTool
} from 'lucide-react';

export const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { open, setOpen } = useSidebar();
  const { history, getRecentByType } = useSearchHistoryContext();
  const collapsed = !open;
  const isDashboard = location.pathname === '/dashboard';
  const isChat = location.pathname === '/chat';
  const isGenerate = location.pathname === '/generate';
  const isGenerateImage = location.pathname === '/generate-image';
  const isContent = location.pathname === '/content';

  // Get recent history items (limited to 5)
  const recentHistory = history.slice(0, 5);

  // Handle history item click
  const handleHistoryItemClick = (item: any) => {
    // Handle image history items
    if (item.type === 'image') {
      if (item.contentId && /^[0-9a-fA-F]{24}$/.test(item.contentId)) {
        // If it's a saved image, go to its content page
        navigate(`/content/${item.contentId}`);
      } else if (item.details?.type === 'search' && item.query) {
        // If it's an image search, go to image generator with the search term
        navigate('/generate-image', { 
          state: { 
            searchQuery: item.query,
            searchResults: item.searchResults 
          }
        });
      } else {
        // Default to image generator
        navigate('/generate-image');
      }
      return;
    }

    // Handle other content types
    if (item.contentId && /^[0-9a-fA-F]{24}$/.test(item.contentId)) {
      navigate(`/content/${item.contentId}`);
      return;
    }

    // Otherwise, fallback to type-based navigation
    switch (item.type) {
      case 'chat':
        navigate('/chat');
        break;
      case 'content':
        navigate('/content');
        break;
      case 'search':
        navigate('/content');
        break;
      default:
        navigate('/content');
    }

    // Show error if invalid ID was provided
    if (item.contentId && !/^[0-9a-fA-F]{24}$/.test(item.contentId)) {
      toast({
        title: "Error",
        description: "Invalid content ID. Redirecting to content list.",
        variant: "destructive"
      });
    }
  };

  // Get icon for history item type
  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return <MessageSquare className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'content':
        return <FileText className="w-4 h-4" />;
      case 'search':
        return <Search className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 bg-gradient-primary">
              <div className="w-full h-full rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">I</span>
              </div>
            </Avatar>
            {!collapsed && (
              <div className="flex-1">
                <p className="font-semibold text-sidebar-foreground">Intellisys</p>
                <p className="text-xs text-muted-foreground">12 members</p>
              </div>
            )}
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/dashboard"
                    className={`flex items-center gap-2 transition-colors ${
                      isDashboard 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <Triangle className="w-4 h-4" />
                    {!collapsed && <span>Artificium</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/chat"
                    className={`flex items-center gap-2 transition-colors ${
                      isChat 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    {!collapsed && <span>Chat</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/generate"
                    className={`flex items-center gap-2 transition-colors ${
                      isGenerate 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <PenTool className="w-4 h-4" />
                    {!collapsed && <span>Generate Content</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/generate-image"
                    className={`flex items-center gap-2 transition-colors ${
                      isGenerateImage 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    {!collapsed && <span>Generate Image</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/content"
                    className={`flex items-center gap-2 transition-colors ${
                      isContent 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <Database className="w-4 h-4" />
                    {!collapsed && <span>My Content</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
                  <Library className="w-4 h-4" />
                  {!collapsed && <span>Library</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <>
            {/* Search */}
            <div className="px-4 py-3 border-b border-sidebar-border">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  className="pl-10 bg-sidebar-accent/50 border-sidebar-border text-sm"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-sidebar-border">
                    ⌘S
                  </Badge>
                </div>
              </div>
            </div>

            {/* History Section */}
            <SidebarGroup>
              <div className="flex items-center justify-between px-4">
                <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Recent History
                </SidebarGroupLabel>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-6 h-6 p-0"
                  onClick={() => window.location.href = '/history'}
                >
                  <Clock className="w-4 h-4" />
                </Button>
              </div>
              <SidebarGroupContent>
                <div className="px-2 py-2 space-y-1">
                  {recentHistory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleHistoryItemClick(item)}
                      className="w-full text-left text-sm hover:bg-sidebar-accent/50 rounded-md p-2 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {getHistoryIcon(item.type)}
                        <span className="truncate">{item.query}</span>
                      </div>
                    </button>
                  ))}
                  {recentHistory.length === 0 && (
                    <div className="text-sm text-muted-foreground py-1 px-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="truncate">Recent activity will appear here</span>
                      </div>
                    </div>
                  )}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* User Section */}
        <div className="px-4 py-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 bg-gradient-primary">
              <div className="w-full h-full rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">R</span>
              </div>
            </Avatar>
            {!collapsed && (
              <div className="flex-1">
                <p className="font-medium text-sidebar-foreground text-sm">Ryan Lee</p>
                <p className="text-xs text-muted-foreground">Premium</p>
              </div>
            )}
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};