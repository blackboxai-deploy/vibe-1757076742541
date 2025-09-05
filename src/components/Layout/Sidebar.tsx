'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: '📊',
    description: 'Ringkasan & Overview'
  },
  {
    name: 'Transaksi',
    href: '/transactions',
    icon: '💰',
    description: 'Pemasukan & Pengeluaran'
  },
  {
    name: 'Anggaran (RKA)',
    href: '/budget',
    icon: '📋',
    description: 'Rencana Kerja Anggaran'
  },
  {
    name: 'Laporan',
    href: '/reports',
    icon: '📈',
    description: 'Analisis & Laporan'
  },
  {
    name: 'Kategori',
    href: '/categories',
    icon: '🏷️',
    description: 'Manajemen Kategori'
  }
];

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                CF
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Cashflow
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Management System
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            'group flex gap-x-3 rounded-md p-3 text-sm font-medium leading-6 transition-colors',
                            isActive
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700'
                          )}
                        >
                          <span className="text-xl" aria-hidden="true">
                            {item.icon}
                          </span>
                          <div className="flex flex-col">
                            <span>{item.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {item.description}
                            </span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>

          {/* Footer Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <div className="font-medium mb-1">Sistem Cashflow</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Modul pengelolaan keuangan dengan perbandingan RKA vs Realisasi
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        'relative z-50 lg:hidden',
        open ? 'fixed inset-0' : 'hidden'
      )}>
        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button
                type="button"
                className="-m-2.5 p-2.5"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <div className="h-6 w-6 text-white" aria-hidden="true">✕</div>
              </button>
            </div>

            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-4">
              {/* Mobile Logo */}
              <div className="flex h-16 shrink-0 items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    CF
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Cashflow
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Management System
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                'group flex gap-x-3 rounded-md p-3 text-sm font-medium leading-6 transition-colors',
                                isActive
                                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700'
                              )}
                            >
                              <span className="text-xl" aria-hidden="true">
                                {item.icon}
                              </span>
                              <div className="flex flex-col">
                                <span>{item.name}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {item.description}
                                </span>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}