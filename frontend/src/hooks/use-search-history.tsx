import { useState, useEffect } from 'react';
import type { HistoryItem } from '@/components/SearchHistory';

const MAX_HISTORY_ITEMS = 50;

export function useSearchHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(history));
  }, [history]);

  // Add a new item to history
  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    setHistory(prev => {
      // Remove duplicates and limit the size
      const filtered = prev.filter(h => 
        !(h.type === item.type && h.query === item.query)
      );
      return [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    });
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Get recent items of a specific type
  const getRecentByType = (type: HistoryItem['type'], limit = 5) => {
    return history
      .filter(item => item.type === type)
      .slice(0, limit);
  };

  return {
    history,
    addToHistory,
    clearHistory,
    getRecentByType
  };
}

// Context to share search history across components
import { createContext, useContext, ReactNode } from 'react';

interface SearchHistoryContextValue {
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  getRecentByType: (type: HistoryItem['type'], limit?: number) => HistoryItem[];
}

const SearchHistoryContext = createContext<SearchHistoryContextValue | undefined>(undefined);

export function SearchHistoryProvider({ children }: { children: ReactNode }) {
  const historyUtils = useSearchHistory();

  return (
    <SearchHistoryContext.Provider value={historyUtils}>
      {children}
    </SearchHistoryContext.Provider>
  );
}

export function useSearchHistoryContext() {
  const context = useContext(SearchHistoryContext);
  if (context === undefined) {
    throw new Error('useSearchHistoryContext must be used within a SearchHistoryProvider');
  }
  return context;
}
