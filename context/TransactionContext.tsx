import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '@/types/transaction';
import { Balance } from '@/types/balance';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  loading: boolean;
  balance: Balance;
  setInitialBalance: (amount: number) => Promise<void>;
  isInitialized: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<Balance>({ total: 0, isInitialized: false });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedTransactions, storedBalance] = await Promise.all([
        AsyncStorage.getItem('transactions'),
        AsyncStorage.getItem('balance')
      ]);

      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
      
      if (storedBalance) {
        setBalance(JSON.parse(storedBalance));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setInitialBalance = async (amount: number) => {
    try {
      const newBalance = { total: amount, isInitialized: true };
      await AsyncStorage.setItem('balance', JSON.stringify(newBalance));
      setBalance(newBalance);
    } catch (error) {
      console.error('Error setting initial balance:', error);
      throw error;
    }
  };

  const addTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    try {
      const transaction: Transaction = {
        ...newTransaction,
        id: Date.now().toString(),
      };
      
      // Update transactions
      const updatedTransactions = [...transactions, transaction];
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      setTransactions(updatedTransactions);

      // Update balance
      const balanceChange = transaction.type === 'income' ? transaction.amount : -transaction.amount;
      const newBalance = {
        ...balance,
        total: balance.total + balanceChange
      };
      await AsyncStorage.setItem('balance', JSON.stringify(newBalance));
      setBalance(newBalance);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      addTransaction, 
      loading,
      balance: balance,
      setInitialBalance,
      isInitialized: balance.isInitialized
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
