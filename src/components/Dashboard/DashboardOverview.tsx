'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, calculateCashflowSummary } from '@/lib/calculations';
import { mockTransactions, mockBudgetItems, getStoredData } from '@/lib/data';
import { Transaction, BudgetItem, CashflowSummary } from '@/types';

export default function DashboardOverview() {
  const [summary, setSummary] = useState<CashflowSummary | null>(null);

  useEffect(() => {
    const transactions = getStoredData<Transaction[]>('transactions', mockTransactions);
    const budgetItems = getStoredData<BudgetItem[]>('budgetItems', mockBudgetItems);
    
    const currentMonth = new Date().toLocaleDateString('id-ID', { 
      month: 'long', 
      year: 'numeric' 
    });
    
    const calculatedSummary = calculateCashflowSummary(transactions, budgetItems, currentMonth);
    setSummary(calculatedSummary);
  }, []);

  if (!summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Pemasukan',
      value: summary.totalIncome,
      budget: summary.budgetedIncome,
      variance: summary.budgetVarianceIncome,
      type: 'income' as const,
      icon: '💰',
      color: 'text-green-600'
    },
    {
      title: 'Total Pengeluaran',
      value: summary.totalExpense,
      budget: summary.budgetedExpense,
      variance: summary.budgetVarianceExpense,
      type: 'expense' as const,
      icon: '💸',
      color: 'text-red-600'
    },
    {
      title: 'Net Cashflow',
      value: summary.netCashflow,
      budget: summary.budgetedIncome - summary.budgetedExpense,
      variance: summary.netCashflow - (summary.budgetedIncome - summary.budgetedExpense),
      type: 'net' as const,
      icon: '📊',
      color: summary.netCashflow >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Budget Utilization',
      value: summary.budgetedIncome > 0 
        ? (summary.totalIncome / summary.budgetedIncome) * 100 
        : 0,
      budget: 100,
      variance: summary.budgetedIncome > 0 
        ? ((summary.totalIncome / summary.budgetedIncome) * 100) - 100 
        : 0,
      type: 'percentage' as const,
      icon: '🎯',
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {card.title}
            </CardTitle>
            <span className="text-2xl">{card.icon}</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {card.type === 'percentage' 
                ? `${card.value.toFixed(1)}%`
                : formatCurrency(card.value)
              }
            </div>
            
            {/* Budget comparison */}
            {card.type !== 'percentage' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Budget: {formatCurrency(card.budget)}</span>
                  <span className={card.variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {card.variance >= 0 ? '+' : ''}{formatCurrency(card.variance)}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      card.type === 'income' 
                        ? 'bg-green-500' 
                        : card.type === 'expense'
                        ? 'bg-red-500'
                        : card.value >= 0
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(Math.abs(card.value / card.budget) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            )}

            {/* Percentage utilization */}
            {card.type === 'percentage' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Target: 100%</span>
                  <span className={card.variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {card.variance >= 0 ? '+' : ''}{card.variance.toFixed(1)}%
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      card.value >= 80 ? 'bg-green-500' : 
                      card.value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(card.value, 100)}%`
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>

          {/* Status indicator */}
          <div className={`absolute top-0 right-0 w-1 h-full ${
            card.variance >= 0 ? 'bg-green-500' : 'bg-red-500'
          }`} />
        </Card>
      ))}
    </div>
  );
}