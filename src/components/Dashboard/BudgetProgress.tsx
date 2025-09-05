'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { calculateCategoryReports } from '@/lib/calculations';
import { mockTransactions, mockBudgetItems, getStoredData } from '@/lib/data';
import { Transaction, BudgetItem, CategoryReport } from '@/types';

export default function BudgetProgress() {
  const [categoryReports, setCategoryReports] = useState<CategoryReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const transactions = getStoredData<Transaction[]>('transactions', mockTransactions);
    const budgetItems = getStoredData<BudgetItem[]>('budgetItems', mockBudgetItems);
    
    const reports = calculateCategoryReports(transactions, budgetItems);
    setCategoryReports(reports);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress Anggaran per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Progress Anggaran per Kategori</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Realisasi vs RKA
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categoryReports.slice(0, 8).map((report, index) => {
            const utilizationPercent = report.budgeted > 0 
              ? (report.actual / report.budgeted) * 100 
              : 0;
            
            const isOverBudget = utilizationPercent > 100;
            const isIncome = report.type === 'income';

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      isIncome ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      {report.categoryName}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isIncome 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {isIncome ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {utilizationPercent.toFixed(1)}%
                    </div>
                    <div className={`text-xs ${
                      isOverBudget ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {isOverBudget ? 'Melebihi anggaran' : 'Dalam anggaran'}
                    </div>
                  </div>
                </div>

                <Progress 
                  value={Math.min(utilizationPercent, 100)} 
                  className="h-2"
                />

                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>
                    Realisasi: {formatCurrency(report.actual)}
                  </span>
                  <span>
                    Anggaran: {formatCurrency(report.budgeted)}
                  </span>
                </div>

                {report.variance !== 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Selisih:</span>
                    <span className={report.variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {report.variance >= 0 ? '+' : ''}{formatCurrency(report.variance)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {categoryReports.length > 8 && (
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                +{categoryReports.length - 8} kategori lainnya
              </span>
            </div>
          )}
        </div>

        {categoryReports.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Belum ada data anggaran yang tersedia.</p>
            <p className="text-sm">Silakan tambahkan data anggaran terlebih dahulu.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}