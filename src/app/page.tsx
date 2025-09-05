'use client';

import React from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import DashboardOverview from '@/components/Dashboard/DashboardOverview';
import CashflowChart from '@/components/Dashboard/CashflowChart';
import RecentTransactions from '@/components/Dashboard/RecentTransactions';
import BudgetProgress from '@/components/Dashboard/BudgetProgress';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard Cashflow
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ringkasan keuangan dan perbandingan dengan Rencana Kerja Anggaran (RKA)
          </p>
        </div>

        {/* Overview Cards */}
        <DashboardOverview />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cashflow Chart */}
          <div className="lg:col-span-2">
            <CashflowChart />
          </div>

          {/* Budget Progress */}
          <BudgetProgress />

          {/* Recent Transactions */}
          <RecentTransactions />
        </div>
      </div>
    </AppLayout>
  );
}