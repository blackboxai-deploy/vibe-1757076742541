'use client';

import React from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Laporan Keuangan</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Analisis dan laporan komprehensif RKA vs Realisasi
            </p>
          </CardHeader>
        </Card>

        {/* Coming Soon */}
        <Card>
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 text-6xl">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Laporan Sedang Dikembangkan
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Fitur laporan komprehensif seperti Cashflow Report, Budget Variance, 
              dan Trend Analysis akan segera hadir.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}