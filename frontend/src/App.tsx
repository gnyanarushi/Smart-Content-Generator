import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchHistoryProvider } from "@/hooks/use-search-history";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import { ContentGenerator } from "./pages/ContentGenerator";
import { ImageGenerator } from "./pages/ImageGenerator";
import { ContentList } from "./pages/ContentList";
import { ContentDetail } from "./pages/ContentDetail";
import { Favorites } from "./pages/Favorites";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SearchHistoryProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/generate" element={<ContentGenerator />} />
            <Route path="/generate-image" element={<ImageGenerator />} />
            <Route path="/content" element={<ContentList />} />
            <Route path="/content/:id" element={<ContentDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/chat" element={<Chat />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SearchHistoryProvider>
  </QueryClientProvider>
);

export default App;
