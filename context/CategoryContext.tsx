import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, DEFAULT_CATEGORIES } from '@/types/category';

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategoryAmount: (id: string, amount: number) => Promise<void>;
  loading: boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const stored = await AsyncStorage.getItem('categories');
      if (stored) {
        setCategories(JSON.parse(stored));
      } else {
        // Initialize with default categories
        await AsyncStorage.setItem('categories', JSON.stringify(DEFAULT_CATEGORIES));
        setCategories(DEFAULT_CATEGORIES);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (newCategory: Omit<Category, 'id'>) => {
    try {
      const category: Category = {
        ...newCategory,
        id: Date.now().toString(),
      };
      const updatedCategories = [...categories, category];
      await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const updateCategoryAmount = async (id: string, amount: number) => {
    try {
      // Update the category's amount based on the given id
      const updatedCategories = categories.map((category) =>
        category.id === id ? { ...category, amount: (category.amount || 0) + amount, count: (category.count || 0) + 1 } : category
      );

      // Persist updated categories to AsyncStorage
      await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error updating category amount:', error);
      throw error;
    }
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, updateCategoryAmount, loading }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}
