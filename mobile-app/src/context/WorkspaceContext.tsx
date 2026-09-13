import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ComparisonItemType = 'standard' | 'qco' | 'lab' | 'product' | 'research';

export interface ComparisonItem {
  id: string;
  type: ComparisonItemType;
  label: string;
  title: string;
  attributes: Record<string, string>;
}

interface SavedItem {
  id: string;
  type: ComparisonItemType;
  label: string;
  title: string;
  savedAt: string;
}

interface WorkspaceContextValue {
  comparisonItems: ComparisonItem[];
  addToComparison: (item: ComparisonItem) => boolean;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
  isInComparison: (id: string) => boolean;
  isTrayOpen: boolean;
  setTrayOpen: (open: boolean) => void;

  savedItems: SavedItem[];
  saveItem: (item: Omit<SavedItem, 'savedAt'>) => void;
  unsaveItem: (id: string) => void;
  isSaved: (id: string) => boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const MAX_COMPARISON = 4;
const COMPARISON_STORAGE_KEY = 'bis-sathi-comparison-items';
const SAVED_STORAGE_KEY = 'bis-sathi-saved-items';

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>([]);
  const [isTrayOpen, setTrayOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(COMPARISON_STORAGE_KEY),
      AsyncStorage.getItem(SAVED_STORAGE_KEY)
    ]).then(([comp, saved]) => {
      if (comp) setComparisonItems(JSON.parse(comp));
      if (saved) setSavedItems(JSON.parse(saved));
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(comparisonItems));
    }
  }, [comparisonItems, isReady]);

  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedItems));
    }
  }, [savedItems, isReady]);

  const addToComparison = useCallback((item: ComparisonItem): boolean => {
    if (comparisonItems.length >= MAX_COMPARISON) return false;
    if (comparisonItems.some(i => i.id === item.id)) return true;
    setComparisonItems(prev => [...prev, item]);
    setTrayOpen(true);
    return true;
  }, [comparisonItems]);

  const removeFromComparison = useCallback((id: string) => {
    setComparisonItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonItems([]);
    setTrayOpen(false);
  }, []);

  const isInComparison = useCallback((id: string) => {
    return comparisonItems.some(i => i.id === id);
  }, [comparisonItems]);

  const saveItem = useCallback((item: Omit<SavedItem, 'savedAt'>) => {
    setSavedItems(prev => {
      if (prev.some(i => i.id === item.id)) return prev;
      return [...prev, { ...item, savedAt: new Date().toISOString() }];
    });
  }, []);

  const unsaveItem = useCallback((id: string) => {
    setSavedItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const isSaved = useCallback((id: string) => {
    return savedItems.some(i => i.id === id);
  }, [savedItems]);

  return (
    <WorkspaceContext.Provider value={{
      comparisonItems, addToComparison, removeFromComparison, clearComparison,
      isInComparison, isTrayOpen, setTrayOpen,
      savedItems, saveItem, unsaveItem, isSaved,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used inside <WorkspaceProvider>');
  return ctx;
}
