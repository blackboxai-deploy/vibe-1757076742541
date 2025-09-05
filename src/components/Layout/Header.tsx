'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const toggleTheme = () => {
    // Simple theme toggle - can be enhanced with next-themes later
    const isDark = document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', !isDark);
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </Button>
          </div>

          {/* Page title - hidden on mobile */}
          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sistem Manajemen Cashflow
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monitoring dan analisis keuangan dengan perbandingan RKA
            </p>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Quick stats */}
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <div className="flex flex-col text-right">
                <span className="text-gray-500 dark:text-gray-400">Periode Aktif</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
              <div className="flex flex-col text-right">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className="font-medium text-green-600 dark:text-green-400">Normal</span>
              </div>
            </div>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              🌙
            </Button>

            {/* User info */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                U
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-gray-900 dark:text-white">User</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Administrator</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile page title */}
      <div className="lg:hidden px-4 pb-3 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-3">
          Sistem Cashflow
        </h2>
      </div>
    </header>
  );
}