'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/calculations';
import { Transaction, Category } from '@/types';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, categories, onEdit, onDelete }: TransactionListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);

  const getCategoryColor = (categoryName: string): string => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#6b7280';
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 text-6xl">📋</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Tidak ada transaksi ditemukan
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Belum ada transaksi yang sesuai dengan filter yang dipilih
          </p>
          <Button variant="outline" onClick={() => setCurrentPage(1)}>
            Reset Pencarian
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Daftar Transaksi ({transactions.length.toLocaleString()} transaksi)
          </CardTitle>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Halaman {currentPage} dari {totalPages}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr className="text-left">
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal</th>
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Deskripsi</th>
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Kategori</th>
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Jenis</th>
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400 text-right">Jumlah</th>
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4 text-sm text-gray-900 dark:text-white">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </div>
                      {transaction.reference && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Ref: {transaction.reference}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getCategoryColor(transaction.category) }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.category}
                        </div>
                        {transaction.subCategory && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.subCategory}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'income'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {transaction.type === 'income' ? '💰 Pemasukan' : '💸 Pengeluaran'}
                    </span>
                  </td>
                  <td className={`py-4 text-right font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(transaction)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Yakin ingin menghapus transaksi ini?')) {
                            onDelete(transaction.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {paginatedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(transaction.category) }}
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {transaction.category}
                  </span>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.type === 'income'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {transaction.type === 'income' ? 'Masuk' : 'Keluar'}
                </span>
              </div>

              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {transaction.description}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(transaction.date)}
                  {transaction.reference && ` • Ref: ${transaction.reference}`}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className={`text-lg font-bold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(transaction)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Yakin ingin menghapus transaksi ini?')) {
                        onDelete(transaction.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, transactions.length)} dari {transactions.length} transaksi
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Sebelumnya
              </Button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}