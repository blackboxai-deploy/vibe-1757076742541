import { Transaction, BudgetItem, CashflowSummary, CategoryReport, TrendData, FilterOptions } from '@/types';

// Format Indonesian Rupiah
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number without currency symbol
export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('id-ID').format(amount);
};

// Parse Indonesian date
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

// Calculate total amount by type
export const calculateTotal = (transactions: Transaction[], type: 'income' | 'expense'): number => {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
};

// Calculate total budget by type
export const calculateBudgetTotal = (budgetItems: BudgetItem[], type: 'income' | 'expense'): number => {
  return budgetItems
    .filter(b => b.type === type)
    .reduce((sum, b) => sum + b.plannedAmount, 0);
};

// Filter transactions by date range
export const filterTransactionsByDateRange = (
  transactions: Transaction[],
  startDate: string,
  endDate: string
): Transaction[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= start && transactionDate <= end;
  });
};

// Filter transactions based on filter options
export const applyTransactionFilters = (
  transactions: Transaction[],
  filters: FilterOptions
): Transaction[] => {
  let filtered = [...transactions];

  if (filters.dateFrom && filters.dateTo) {
    filtered = filterTransactionsByDateRange(filtered, filters.dateFrom, filters.dateTo);
  }

  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(t => t.type === filters.type);
  }

  if (filters.category) {
    filtered = filtered.filter(t => t.category === filters.category);
  }

  if (filters.minAmount !== undefined) {
    filtered = filtered.filter(t => t.amount >= filters.minAmount!);
  }

  if (filters.maxAmount !== undefined) {
    filtered = filtered.filter(t => t.amount <= filters.maxAmount!);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(t =>
      t.description.toLowerCase().includes(searchLower) ||
      t.category.toLowerCase().includes(searchLower) ||
      (t.subCategory && t.subCategory.toLowerCase().includes(searchLower)) ||
      (t.reference && t.reference.toLowerCase().includes(searchLower))
    );
  }

  return filtered;
};

// Calculate cashflow summary
export const calculateCashflowSummary = (
  transactions: Transaction[],
  budgetItems: BudgetItem[],
  period: string
): CashflowSummary => {
  const totalIncome = calculateTotal(transactions, 'income');
  const totalExpense = calculateTotal(transactions, 'expense');
  const budgetedIncome = calculateBudgetTotal(budgetItems, 'income');
  const budgetedExpense = calculateBudgetTotal(budgetItems, 'expense');

  return {
    totalIncome,
    totalExpense,
    netCashflow: totalIncome - totalExpense,
    budgetedIncome,
    budgetedExpense,
    budgetVarianceIncome: totalIncome - budgetedIncome,
    budgetVarianceExpense: totalExpense - budgetedExpense,
    period,
  };
};

// Calculate category reports
export const calculateCategoryReports = (
  transactions: Transaction[],
  budgetItems: BudgetItem[]
): CategoryReport[] => {
  const categories = new Map<string, CategoryReport>();

  // Initialize with budget data
  budgetItems.forEach(budget => {
    const key = `${budget.category}-${budget.type}`;
    if (!categories.has(key)) {
      categories.set(key, {
        categoryName: budget.category,
        budgeted: 0,
        actual: 0,
        variance: 0,
        variancePercent: 0,
        type: budget.type,
      });
    }
    const report = categories.get(key)!;
    report.budgeted += budget.plannedAmount;
  });

  // Add actual transaction data
  transactions.forEach(transaction => {
    const key = `${transaction.category}-${transaction.type}`;
    if (!categories.has(key)) {
      categories.set(key, {
        categoryName: transaction.category,
        budgeted: 0,
        actual: 0,
        variance: 0,
        variancePercent: 0,
        type: transaction.type,
      });
    }
    const report = categories.get(key)!;
    report.actual += transaction.amount;
  });

  // Calculate variances
  categories.forEach(report => {
    report.variance = report.actual - report.budgeted;
    report.variancePercent = report.budgeted > 0 
      ? (report.variance / report.budgeted) * 100 
      : 0;
  });

  return Array.from(categories.values()).sort((a, b) => a.categoryName.localeCompare(b.categoryName));
};

// Calculate monthly trend data
export const calculateTrendData = (
  transactions: Transaction[],
  budgetItems: BudgetItem[],
  months: number = 12
): TrendData[] => {
  const trends: TrendData[] = [];
  const currentDate = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const monthTransactions = filterTransactionsByDateRange(
      transactions,
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0]
    );

    const income = calculateTotal(monthTransactions, 'income');
    const expense = calculateTotal(monthTransactions, 'expense');
    const budgetIncome = calculateBudgetTotal(budgetItems, 'income');
    const budgetExpense = calculateBudgetTotal(budgetItems, 'expense');

    trends.push({
      period: date.toLocaleString('id-ID', { year: 'numeric', month: 'short' }),
      income,
      expense,
      budget: budgetIncome - budgetExpense,
      actual: income - expense,
    });
  }

  return trends;
};

// Calculate budget utilization percentage
export const calculateBudgetUtilization = (actual: number, budgeted: number): number => {
  if (budgeted === 0) return 0;
  return (actual / budgeted) * 100;
};

// Get budget health status
export const getBudgetHealthStatus = (
  variancePercent: number,
  type: 'income' | 'expense'
): 'excellent' | 'good' | 'warning' | 'danger' => {
  if (type === 'income') {
    if (variancePercent >= 10) return 'excellent';
    if (variancePercent >= 0) return 'good';
    if (variancePercent >= -10) return 'warning';
    return 'danger';
  } else {
    if (variancePercent <= -10) return 'excellent';
    if (variancePercent <= 0) return 'good';
    if (variancePercent <= 10) return 'warning';
    return 'danger';
  }
};

// Get health status color
export const getHealthStatusColor = (status: string): string => {
  switch (status) {
    case 'excellent': return 'text-green-600';
    case 'good': return 'text-blue-600';
    case 'warning': return 'text-yellow-600';
    case 'danger': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

// Calculate net worth projection
export const calculateProjection = (
  currentCashflow: number,
  avgMonthlyIncome: number,
  avgMonthlyExpense: number,
  months: number
): number => {
  const monthlyNet = avgMonthlyIncome - avgMonthlyExpense;
  return currentCashflow + (monthlyNet * months);
};

// Group transactions by category
export const groupTransactionsByCategory = (transactions: Transaction[]): Map<string, Transaction[]> => {
  const grouped = new Map<string, Transaction[]>();
  
  transactions.forEach(transaction => {
    const key = transaction.category;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(transaction);
  });
  
  return grouped;
};

// Calculate average monthly amount
export const calculateAverageMonthly = (
  transactions: Transaction[],
  type: 'income' | 'expense',
  months: number
): number => {
  const total = calculateTotal(transactions, type);
  return months > 0 ? total / months : 0;
};

// Validate budget item
export const validateBudgetItem = (item: Partial<BudgetItem>): string[] => {
  const errors: string[] = [];
  
  if (!item.category) errors.push('Kategori wajib diisi');
  if (!item.type) errors.push('Jenis transaksi wajib dipilih');
  if (!item.plannedAmount || item.plannedAmount <= 0) errors.push('Jumlah anggaran harus lebih dari 0');
  if (!item.period) errors.push('Periode anggaran wajib dipilih');
  
  return errors;
};

// Validate transaction
export const validateTransaction = (transaction: Partial<Transaction>): string[] => {
  const errors: string[] = [];
  
  if (!transaction.description) errors.push('Deskripsi wajib diisi');
  if (!transaction.amount || transaction.amount <= 0) errors.push('Jumlah harus lebih dari 0');
  if (!transaction.type) errors.push('Jenis transaksi wajib dipilih');
  if (!transaction.category) errors.push('Kategori wajib dipilih');
  if (!transaction.date) errors.push('Tanggal wajib diisi');
  
  return errors;
};