'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, calculateTotal } from '@/lib/calculations';
import { Transaction } from '@/types';

interface TransactionStatsProps {
  transactions: Transaction[];
}

export default function TransactionStats({ transactions }: TransactionStatsProps) {
  const totalIncome = calculateTotal(transactions, 'income');
  const totalExpense = calculateTotal(transactions, 'expense');
  const netCashflow = totalIncome - totalExpense;

  const stats = [
    {
      title: 'Total Pemasukan',
      value: totalIncome,
      count: transactions.filter(t => t.type === 'income').length,
      icon: '💰',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      title: 'Total Pengeluaran',
      value: totalExpense,
      count: transactions.filter(t => t.type === 'expense').length,
      icon: '💸',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    {
      title: 'Net Cashflow',
      value: netCashflow,
      count: transactions.length,
      icon: '📊',
      color: netCashflow >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: netCashflow >= 0 
        ? 'bg-green-50 dark:bg-green-900/20' 
        : 'bg-red-50 dark:bg-red-900/20',
      borderColor: netCashflow >= 0 
        ? 'border-green-200 dark:border-green-800' 
        : 'border-red-200 dark:border-red-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border-2`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.title}
            </CardTitle>
            <span className="text-2xl">{stat.icon}</span>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color} mb-2`}>
              {formatCurrency(stat.value)}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {stat.count} transaksi
              </p>
              {index < 2 && (
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    stat.title.includes('Pemasukan') ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {((stat.value / (totalIncome + totalExpense)) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            {/* Progress Bar for Visual Reference */}
            {index < 2 && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      stat.title.includes('Pemasukan') ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min((stat.value / Math.max(totalIncome, totalExpense)) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}