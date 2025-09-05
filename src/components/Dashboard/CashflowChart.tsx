'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateTrendData } from '@/lib/calculations';
import { mockTransactions, mockBudgetItems, getStoredData } from '@/lib/data';
import { Transaction, BudgetItem, TrendData } from '@/types';

export default function CashflowChart() {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const transactions = getStoredData<Transaction[]>('transactions', mockTransactions);
    const budgetItems = getStoredData<BudgetItem[]>('budgetItems', mockBudgetItems);
    
    const trends = calculateTrendData(transactions, budgetItems, 6);
    setTrendData(trends);
    setLoading(false);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trend Cashflow - 6 Bulan Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse flex space-x-4 w-full h-full">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-60 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Trend Cashflow - 6 Bulan Terakhir</span>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Pemasukan</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Pengeluaran</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Net Cashflow</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={trendData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
                tickFormatter={(value) => {
                  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}M`;
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}Jt`;
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}rb`;
                  return value.toString();
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="income" 
                name="Pemasukan" 
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="expense" 
                name="Pengeluaran" 
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="actual" 
                name="Net Cashflow" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {(() => {
                const avg = trendData.reduce((sum, data) => sum + data.income, 0) / trendData.length;
                return new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(avg);
              })()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Rata-rata Pemasukan</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {(() => {
                const avg = trendData.reduce((sum, data) => sum + data.expense, 0) / trendData.length;
                return new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(avg);
              })()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Rata-rata Pengeluaran</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              (trendData.reduce((sum, data) => sum + data.actual, 0) / trendData.length) >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {(() => {
                const avg = trendData.reduce((sum, data) => sum + data.actual, 0) / trendData.length;
                return new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(avg);
              })()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Rata-rata Net Cashflow</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}