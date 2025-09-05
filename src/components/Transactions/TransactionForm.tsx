'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { validateTransaction } from '@/lib/calculations';
import { Transaction, Category } from '@/types';

interface TransactionFormProps {
  transaction?: Transaction;
  categories: Category[];
  onSave: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function TransactionForm({ transaction, categories, onSave, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: transaction?.date || new Date().toISOString().split('T')[0],
    description: transaction?.description || '',
    amount: transaction?.amount?.toString() || '',
    type: transaction?.type || 'expense' as const,
    category: transaction?.category || '',
    subCategory: transaction?.subCategory || '',
    reference: transaction?.reference || '',
    attachment: transaction?.attachment || ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [availableSubCategories, setAvailableSubCategories] = useState<any[]>([]);

  useEffect(() => {
    if (formData.category) {
      const selectedCategory = categories.find(c => c.name === formData.category);
      setAvailableSubCategories(selectedCategory?.subCategories || []);
      
      // Reset sub-category if it's not available in the new category
      if (formData.subCategory && !selectedCategory?.subCategories?.some(sub => sub.name === formData.subCategory)) {
        setFormData(prev => ({ ...prev, subCategory: '' }));
      }
    } else {
      setAvailableSubCategories([]);
      setFormData(prev => ({ ...prev, subCategory: '' }));
    }
  }, [formData.category, categories]);

  const filteredCategories = categories.filter(cat => cat.type === formData.type && cat.isActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount) || 0
    };

    const validationErrors = validateTransaction(transactionData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave(transactionData);
  };

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setFormData(prev => ({
      ...prev,
      type: newType,
      category: '',
      subCategory: ''
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
          </DialogTitle>
          <DialogDescription>
            {transaction 
              ? 'Ubah data transaksi yang sudah ada' 
              : 'Isi data transaksi pemasukan atau pengeluaran'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                Mohon perbaiki kesalahan berikut:
              </h4>
              <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Transaction Type */}
          <div className="space-y-3">
            <Label>Jenis Transaksi *</Label>
            <RadioGroup 
              value={formData.type} 
              onValueChange={handleTypeChange}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="cursor-pointer">
                  💰 Pemasukan
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="cursor-pointer">
                  💸 Pengeluaran
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal Transaksi *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah (Rp) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
                min="0"
                step="1"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Transaksi *</Label>
            <Textarea
              id="description"
              placeholder="Masukkan deskripsi transaksi..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={3}
            />
          </div>

          {/* Category and Sub-Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kategori *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sub Kategori</Label>
              <Select 
                value={formData.subCategory} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, subCategory: value }))}
                disabled={availableSubCategories.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih sub kategori..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSubCategories.map(subCategory => (
                    <SelectItem key={subCategory.id} value={subCategory.name}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: subCategory.color }}
                        />
                        <span>{subCategory.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reference */}
          <div className="space-y-2">
            <Label htmlFor="reference">Nomor Referensi</Label>
            <Input
              id="reference"
              placeholder="No. Invoice, Receipt, dll (opsional)"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {transaction ? 'Update Transaksi' : 'Simpan Transaksi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}