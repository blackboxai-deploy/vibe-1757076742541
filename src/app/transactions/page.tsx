'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TransactionForm from '@/components/Transactions/TransactionForm';
import TransactionList from '@/components/Transactions/TransactionList';
import TransactionStats from '@/components/Transactions/TransactionStats';
import { mockTransactions, mockCategories, getStoredData, saveToStorage } from '@/lib/data';
import { applyTransactionFilters } from '@/lib/calculations';
import { Transaction, Category, FilterOptions } from '@/types';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    search: '',
    category: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedTransactions = getStoredData<Transaction[]>('transactions', mockTransactions);
    const storedCategories = getStoredData<Category[]>('categories', mockCategories);
    
    setTransactions(storedTransactions);
    setCategories(storedCategories);
    setLoading(false);
  }, []);

  useEffect(() => {
    const filtered = applyTransactionFilters(transactions, filters);
    setFilteredTransactions(filtered);
  }, [transactions, filters]);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    saveToStorage('transactions', updatedTransactions);
    setShowForm(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    const updatedTransactions = transactions.map(t => 
      t.id === transaction.id 
        ? { ...transaction, updatedAt: new Date().toISOString() }
        : t
    );
    
    setTransactions(updatedTransactions);
    saveToStorage('transactions', updatedTransactions);
    setEditingTransaction(undefined);
    setShowForm(false);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    saveToStorage('transactions', updatedTransactions);
  };

  const resetFilters = () => {
    setFilters({
      type: 'all',
      search: '',
      category: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Manajemen Transaksi</CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Kelola pemasukan dan pengeluaran keuangan
                </p>
              </div>
              <Button 
                onClick={() => {
                  setEditingTransaction(undefined);
                  setShowForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                + Tambah Transaksi
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Transaction Stats */}
        <TransactionStats transactions={filteredTransactions} />

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Pencarian
                </label>
                <Input
                  placeholder="Cari transaksi..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Jenis
                </label>
                <Select value={filters.type || 'all'} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, type: value as any }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    <SelectItem value="income">Pemasukan</SelectItem>
                    <SelectItem value="expense">Pengeluaran</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Kategori
                </label>
                <Select value={filters.category || ''} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, category: value || '' }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Kategori</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Dari Tanggal
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Sampai Tanggal
                </label>
                <Input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction List */}
        <TransactionList
          transactions={filteredTransactions}
          categories={categories}
          onEdit={(transaction) => {
            setEditingTransaction(transaction);
            setShowForm(true);
          }}
          onDelete={handleDeleteTransaction}
        />

        {/* Transaction Form Modal */}
        {showForm && (
          <TransactionForm
            transaction={editingTransaction}
            categories={categories}
            onSave={editingTransaction ? handleEditTransaction : handleAddTransaction}
            onCancel={() => {
              setShowForm(false);
              setEditingTransaction(undefined);
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}