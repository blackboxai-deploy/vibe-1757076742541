'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCategories, getStoredData } from '@/lib/data';
import { Category } from '@/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCategories = getStoredData<Category[]>('categories', mockCategories);
    setCategories(storedCategories);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Manajemen Kategori</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola kategori untuk transaksi pemasukan dan pengeluaran
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-green-600">💰</span>
                <span>Kategori Pemasukan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incomeCategories.map((category) => (
                  <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        category.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {category.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </div>
                    
                    {category.subCategories && category.subCategories.length > 0 && (
                      <div className="ml-7 space-y-1">
                        {category.subCategories.map((sub) => (
                          <div key={sub.id} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: sub.color }}
                            />
                            <span>{sub.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expense Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-red-600">💸</span>
                <span>Kategori Pengeluaran</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseCategories.map((category) => (
                  <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        category.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {category.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </div>
                    
                    {category.subCategories && category.subCategories.length > 0 && (
                      <div className="ml-7 space-y-1">
                        {category.subCategories.map((sub) => (
                          <div key={sub.id} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: sub.color }}
                            />
                            <span>{sub.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}