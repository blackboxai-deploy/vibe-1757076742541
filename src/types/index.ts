export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  subCategory?: string;
  reference?: string;
  attachment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  subCategory?: string;
  type: 'income' | 'expense';
  plannedAmount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
  subCategories?: SubCategory[];
  isActive: boolean;
}

export interface SubCategory {
  id: string;
  name: string;
  color: string;
  parentCategoryId: string;
  isActive: boolean;
}

export interface CashflowSummary {
  totalIncome: number;
  totalExpense: number;
  netCashflow: number;
  budgetedIncome: number;
  budgetedExpense: number;
  budgetVarianceIncome: number;
  budgetVarianceExpense: number;
  period: string;
}

export interface ReportData {
  period: string;
  categories: CategoryReport[];
  summary: CashflowSummary;
  trends: TrendData[];
}

export interface CategoryReport {
  categoryName: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
  type: 'income' | 'expense';
}

export interface TrendData {
  period: string;
  income: number;
  expense: number;
  budget: number;
  actual: number;
}

export interface FilterOptions {
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  type?: 'income' | 'expense' | 'all';
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface BudgetPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  totalBudgetedIncome: number;
  totalBudgetedExpense: number;
  totalActualIncome: number;
  totalActualExpense: number;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  reportType: 'cashflow' | 'budget-variance' | 'trend-analysis' | 'income-statement';
  period: string;
  includeCharts: boolean;
}