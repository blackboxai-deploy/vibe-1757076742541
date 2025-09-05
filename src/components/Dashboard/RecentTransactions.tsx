'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/calculations';
import { mockTransactions, getStoredData } from '@/lib/data';
import { Transaction } from '@/types';

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedTransactions = getStoredData<Transaction[]>('transactions', mockTransactions);
    // Sort by date descending and take last 8
    const recentTransactions = storedTransactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
    
    setTransactions(recentTransactions);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 mt-1"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Transaksi Terbaru</CardTitle>
        <Link href="/transactions">
          <Button variant="outline" size="sm">
            Lihat Semua
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-center space-x-4">
                {/* Transaction Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                  transaction.type === 'income' 
                    ? 'bg-green-500' 
                    : 'bg-red-500'
                }`}>
                  {transaction.type === 'income' ? '↗' : '↙'}
                </div>

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {transaction.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.category}
                    </span>
                    {transaction.subCategory && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.subCategory}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  transaction.type === 'income' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
                {transaction.reference && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {transaction.reference}
                  </p>
                )}
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="w-12 h-12 mx-auto mb-4 text-4xl">💰</div>
              <p className="font-medium">Belum ada transaksi</p>
              <p className="text-sm mt-1">
                Transaksi yang Anda tambahkan akan muncul di sini
              </p>
              <Link href="/transactions">
                <Button variant="outline" size="sm" className="mt-4">
                  Tambah Transaksi
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Summary */}
        {transactions.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Total {transactions.length} transaksi terbaru
              </span>
              <div className="flex space-x-4">
                <span className="text-green-600">
                  +{formatCurrency(transactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </span>
                <span className="text-red-600">
                  -{formatCurrency(transactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}