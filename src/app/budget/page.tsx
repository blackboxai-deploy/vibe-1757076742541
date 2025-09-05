'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/calculations';
import { mockBudgetItems, mockCategories, getStoredData } from '@/lib/data';
import { BudgetItem } from '@/types';

export default function BudgetPage() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedBudgetItems = getStoredData<BudgetItem[]>('budgetItems', mockBudgetItems);
    // Store categories for future use
    getStoredData('categories', mockCategories);
    
    setBudgetItems(storedBudgetItems);
    setLoading(false);
  }, []);

  const totalBudgetedIncome = budgetItems
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.plannedAmount, 0);

  const totalBudgetedExpense = budgetItems
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.plannedAmount, 0);

  const netBudget = totalBudgetedIncome - totalBudgetedExpense;

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

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Rencana Kerja Anggaran (RKA)</CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Kelola anggaran pemasukan dan pengeluaran
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                + Tambah Anggaran
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Anggaran Pemasukan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {formatCurrency(totalBudgetedIncome)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {budgetItems.filter(item => item.type === 'income').length} kategori
              </p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Anggaran Pengeluaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 mb-2">
                {formatCurrency(totalBudgetedExpense)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {budgetItems.filter(item => item.type === 'expense').length} kategori
              </p>
            </CardContent>
          </Card>

          <Card className={`${
            netBudget >= 0 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Net Anggaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold mb-2 ${
                netBudget >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(netBudget)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {netBudget >= 0 ? 'Surplus' : 'Defisit'} anggaran
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Items List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Budget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-green-600">💰</span>
                <span>Anggaran Pemasukan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetItems
                  .filter(item => item.type === 'income')
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.category}
                        </div>
                        {item.subCategory && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {item.subCategory}
                          </div>
                        )}
                        <div className="text-xs text-gray-400">
                          {item.period === 'monthly' ? 'Bulanan' : 
                           item.period === 'quarterly' ? 'Kuartalan' : 'Tahunan'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">
                          {formatCurrency(item.plannedAmount)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Target
                        </div>
                      </div>
                    </div>
                  ))}

                {budgetItems.filter(item => item.type === 'income').length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>Belum ada anggaran pemasukan</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expense Budget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-red-600">💸</span>
                <span>Anggaran Pengeluaran</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetItems
                  .filter(item => item.type === 'expense')
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.category}
                        </div>
                        {item.subCategory && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {item.subCategory}
                          </div>
                        )}
                        <div className="text-xs text-gray-400">
                          {item.period === 'monthly' ? 'Bulanan' : 
                           item.period === 'quarterly' ? 'Kuartalan' : 'Tahunan'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-red-600">
                          {formatCurrency(item.plannedAmount)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Target
                        </div>
                      </div>
                    </div>
                  ))}

                {budgetItems.filter(item => item.type === 'expense').length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>Belum ada anggaran pengeluaran</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Analisis Anggaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {budgetItems.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Item Anggaran</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {((totalBudgetedIncome / (totalBudgetedIncome + totalBudgetedExpense)) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Rasio Pemasukan</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  {((totalBudgetedExpense / (totalBudgetedIncome + totalBudgetedExpense)) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Rasio Pengeluaran</div>
              </div>
              
              <div className="text-center">
                <div className={`text-lg font-bold ${
                  netBudget >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {netBudget >= 0 ? '✅' : '⚠️'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {netBudget >= 0 ? 'Sehat' : 'Perlu Perhatian'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}