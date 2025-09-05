import { Transaction, BudgetItem, Category, BudgetPeriod } from '@/types';

// Mock Categories Data
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Pendapatan Operasional',
    type: 'income',
    color: '#22c55e',
    isActive: true,
    subCategories: [
      { id: '1-1', name: 'Penjualan', color: '#16a34a', parentCategoryId: '1', isActive: true },
      { id: '1-2', name: 'Jasa', color: '#15803d', parentCategoryId: '1', isActive: true },
      { id: '1-3', name: 'Komisi', color: '#166534', parentCategoryId: '1', isActive: true }
    ]
  },
  {
    id: '2',
    name: 'Pendapatan Lain-lain',
    type: 'income',
    color: '#3b82f6',
    isActive: true,
    subCategories: [
      { id: '2-1', name: 'Bunga Bank', color: '#2563eb', parentCategoryId: '2', isActive: true },
      { id: '2-2', name: 'Investasi', color: '#1d4ed8', parentCategoryId: '2', isActive: true }
    ]
  },
  {
    id: '3',
    name: 'Biaya Operasional',
    type: 'expense',
    color: '#ef4444',
    isActive: true,
    subCategories: [
      { id: '3-1', name: 'Gaji & Tunjangan', color: '#dc2626', parentCategoryId: '3', isActive: true },
      { id: '3-2', name: 'Listrik & Utilities', color: '#b91c1c', parentCategoryId: '3', isActive: true },
      { id: '3-3', name: 'Sewa Kantor', color: '#991b1b', parentCategoryId: '3', isActive: true },
      { id: '3-4', name: 'Komunikasi', color: '#7f1d1d', parentCategoryId: '3', isActive: true }
    ]
  },
  {
    id: '4',
    name: 'Biaya Marketing',
    type: 'expense',
    color: '#f59e0b',
    isActive: true,
    subCategories: [
      { id: '4-1', name: 'Iklan Digital', color: '#d97706', parentCategoryId: '4', isActive: true },
      { id: '4-2', name: 'Event & Promosi', color: '#b45309', parentCategoryId: '4', isActive: true },
      { id: '4-3', name: 'Materi Marketing', color: '#92400e', parentCategoryId: '4', isActive: true }
    ]
  },
  {
    id: '5',
    name: 'Biaya Administrasi',
    type: 'expense',
    color: '#8b5cf6',
    isActive: true,
    subCategories: [
      { id: '5-1', name: 'Alat Tulis Kantor', color: '#7c3aed', parentCategoryId: '5', isActive: true },
      { id: '5-2', name: 'Pajak & Perizinan', color: '#6d28d9', parentCategoryId: '5', isActive: true },
      { id: '5-3', name: 'Konsultan Legal', color: '#5b21b6', parentCategoryId: '5', isActive: true }
    ]
  }
];

// Mock Budget Period
export const mockBudgetPeriod: BudgetPeriod = {
  id: '1',
  name: 'Anggaran 2024',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  isActive: true,
  totalBudgetedIncome: 2400000000,
  totalBudgetedExpense: 1800000000,
  totalActualIncome: 1950000000,
  totalActualExpense: 1650000000
};

// Mock Budget Items
export const mockBudgetItems: BudgetItem[] = [
  // Income Budget Items
  {
    id: 'b1',
    category: 'Pendapatan Operasional',
    subCategory: 'Penjualan',
    type: 'income',
    plannedAmount: 150000000,
    period: 'monthly',
    description: 'Target penjualan produk bulanan',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'b2',
    category: 'Pendapatan Operasional',
    subCategory: 'Jasa',
    type: 'income',
    plannedAmount: 50000000,
    period: 'monthly',
    description: 'Pendapatan dari layanan jasa',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'b3',
    category: 'Pendapatan Lain-lain',
    subCategory: 'Bunga Bank',
    type: 'income',
    plannedAmount: 2000000,
    period: 'monthly',
    description: 'Bunga deposito dan tabungan',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // Expense Budget Items
  {
    id: 'b4',
    category: 'Biaya Operasional',
    subCategory: 'Gaji & Tunjangan',
    type: 'expense',
    plannedAmount: 80000000,
    period: 'monthly',
    description: 'Gaji karyawan dan tunjangan',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'b5',
    category: 'Biaya Operasional',
    subCategory: 'Sewa Kantor',
    type: 'expense',
    plannedAmount: 15000000,
    period: 'monthly',
    description: 'Sewa kantor dan fasilitas',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'b6',
    category: 'Biaya Operasional',
    subCategory: 'Listrik & Utilities',
    type: 'expense',
    plannedAmount: 8000000,
    period: 'monthly',
    description: 'Listrik, air, internet',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'b7',
    category: 'Biaya Marketing',
    subCategory: 'Iklan Digital',
    type: 'expense',
    plannedAmount: 25000000,
    period: 'monthly',
    description: 'Facebook Ads, Google Ads, Instagram',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'b8',
    category: 'Biaya Administrasi',
    subCategory: 'Alat Tulis Kantor',
    type: 'expense',
    plannedAmount: 3000000,
    period: 'monthly',
    description: 'ATK dan supplies kantor',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  // January 2024 Transactions
  {
    id: 't1',
    date: '2024-01-15',
    description: 'Penjualan Produk Batch A',
    amount: 125000000,
    type: 'income',
    category: 'Pendapatan Operasional',
    subCategory: 'Penjualan',
    reference: 'INV-2024-001',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 't2',
    date: '2024-01-20',
    description: 'Layanan Konsultasi PT ABC',
    amount: 45000000,
    type: 'income',
    category: 'Pendapatan Operasional',
    subCategory: 'Jasa',
    reference: 'INV-2024-002',
    createdAt: '2024-01-20T14:15:00Z',
    updatedAt: '2024-01-20T14:15:00Z'
  },
  {
    id: 't3',
    date: '2024-01-31',
    description: 'Bunga Deposito Bank Mandiri',
    amount: 1800000,
    type: 'income',
    category: 'Pendapatan Lain-lain',
    subCategory: 'Bunga Bank',
    reference: 'DEP-001',
    createdAt: '2024-01-31T16:45:00Z',
    updatedAt: '2024-01-31T16:45:00Z'
  },
  {
    id: 't4',
    date: '2024-01-01',
    description: 'Gaji Karyawan Januari 2024',
    amount: 78000000,
    type: 'expense',
    category: 'Biaya Operasional',
    subCategory: 'Gaji & Tunjangan',
    reference: 'PAY-2024-001',
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-01T09:00:00Z'
  },
  {
    id: 't5',
    date: '2024-01-05',
    description: 'Sewa Kantor Januari 2024',
    amount: 15000000,
    type: 'expense',
    category: 'Biaya Operasional',
    subCategory: 'Sewa Kantor',
    reference: 'RENT-001',
    createdAt: '2024-01-05T11:30:00Z',
    updatedAt: '2024-01-05T11:30:00Z'
  },
  {
    id: 't6',
    date: '2024-01-10',
    description: 'Tagihan Listrik & Internet',
    amount: 7200000,
    type: 'expense',
    category: 'Biaya Operasional',
    subCategory: 'Listrik & Utilities',
    reference: 'UTIL-001',
    createdAt: '2024-01-10T13:20:00Z',
    updatedAt: '2024-01-10T13:20:00Z'
  },
  {
    id: 't7',
    date: '2024-01-25',
    description: 'Facebook & Google Ads Campaign',
    amount: 22000000,
    type: 'expense',
    category: 'Biaya Marketing',
    subCategory: 'Iklan Digital',
    reference: 'MKT-001',
    createdAt: '2024-01-25T15:45:00Z',
    updatedAt: '2024-01-25T15:45:00Z'
  },
  // February 2024 Transactions
  {
    id: 't8',
    date: '2024-02-10',
    description: 'Penjualan Produk Batch B',
    amount: 140000000,
    type: 'income',
    category: 'Pendapatan Operasional',
    subCategory: 'Penjualan',
    reference: 'INV-2024-003',
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z'
  },
  {
    id: 't9',
    date: '2024-02-15',
    description: 'Konsultasi Sistem PT XYZ',
    amount: 55000000,
    type: 'income',
    category: 'Pendapatan Operasional',
    subCategory: 'Jasa',
    reference: 'INV-2024-004',
    createdAt: '2024-02-15T09:30:00Z',
    updatedAt: '2024-02-15T09:30:00Z'
  },
  {
    id: 't10',
    date: '2024-02-01',
    description: 'Gaji Karyawan Februari 2024',
    amount: 78000000,
    type: 'expense',
    category: 'Biaya Operasional',
    subCategory: 'Gaji & Tunjangan',
    reference: 'PAY-2024-002',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z'
  },
  {
    id: 't11',
    date: '2024-02-20',
    description: 'Event Marketing & Promosi',
    amount: 18000000,
    type: 'expense',
    category: 'Biaya Marketing',
    subCategory: 'Event & Promosi',
    reference: 'EVENT-001',
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z'
  }
];

// Helper function to get data from localStorage or return mock data
export const getStoredData = <T>(key: string, defaultData: T): T => {
  if (typeof window === 'undefined') return defaultData;
  
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch {
    return defaultData;
  }
};

// Helper function to save data to localStorage
export const saveToStorage = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};