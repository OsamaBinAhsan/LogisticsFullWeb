'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  ArrowUpRight,
  Edit2,
  Trash2,
} from 'lucide-react';
import { productsService } from '@/lib/services/products.service';
import type { Product } from '@/types';
import { formatUSD } from '@/lib/utils';
import { fadeUp, staggerContainer } from '@/lib/motion';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    productsService.getProducts().then(({ products: data }) => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      p.variants.some((v) => v.sku.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalStock = products.reduce(
    (sum, p) => sum + p.variants.reduce((vSum, v) => vSum + v.stock, 0),
    0
  );
  const lowStockCount = products.filter((p) =>
    p.variants.some((v) => v.stock <= 5)
  ).length;
  const inventoryValue = products.reduce(
    (sum, p) =>
      sum +
      p.variants.reduce((vSum, v) => vSum + v.stock * (v.costPrice || p.basePrice * 0.5), 0),
    0
  );

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-8 max-w-[1720px] mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-2xl font-bold text-on-surface tracking-tight">
              Product Catalog & SKU Master
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container">
              Multi-Variant Sync
            </span>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant mt-1">
            Manage multi-variant merchandise, pricing, and live catalog states
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </Link>
        </div>
      </motion.div>

      {/* KPI Stats */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm">
          <div className="text-[10px] font-label-sm uppercase tracking-wider text-outline font-bold">Total SKUs</div>
          <div className="text-3xl font-headline font-bold text-on-surface mt-1">
            {products.length}
          </div>
          <div className="text-[11px] text-outline mt-0.5">
            {categories.length - 1} active categories
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm">
          <div className="text-[10px] font-label-sm uppercase tracking-wider text-outline font-bold">Stock Units</div>
          <div className="text-3xl font-headline font-bold text-on-surface mt-1">
            {totalStock}
          </div>
          <div className="text-[11px] text-secondary font-bold mt-0.5">
            Omni-channel ready
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm">
          <div className="text-[10px] font-label-sm uppercase tracking-wider text-outline font-bold">Low Stock Alerts</div>
          <div className="text-3xl font-headline font-bold text-amber-500 mt-1">
            {lowStockCount}
          </div>
          <div className="text-[11px] text-outline mt-0.5">
            Stock &le; 5 units
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm">
          <div className="text-[10px] font-label-sm uppercase tracking-wider text-outline font-bold">Inventory Asset Value</div>
          <div className="text-3xl font-headline font-bold text-primary mt-1">
            {formatUSD(inventoryValue)}
          </div>
          <div className="text-[11px] text-outline mt-0.5">
            Estimated cost basis
          </div>
        </div>
      </motion.div>

      {/* Filter and Search Bar */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-2xl border border-surface-container shadow-sm"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU, or tag..."
            className="w-full bg-surface-container-low border border-outline-variant/40 text-xs pl-10 pr-4 py-2 rounded-full text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto p-1 bg-surface-container rounded-full border border-outline-variant/30">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div
        variants={fadeUp}
        className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container-low text-[11px] uppercase tracking-wider text-outline font-bold">
                <th className="py-3 px-4 rounded-l-xl">Item & Info</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Variants</th>
                <th className="py-3 px-4 text-right">Stock</th>
                <th className="py-3 px-4 text-right">Retail Price</th>
                <th className="py-3 px-4 text-center">Badge</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filteredProducts.map((p) => {
                const totalProdStock = p.variants.reduce((s, v) => s + v.stock, 0);
                const isLow = totalProdStock <= 5;

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-surface-container-low/50 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-container-low border border-surface-container overflow-hidden shrink-0 relative">
                          <Image
                            src={p.images?.[0] || '/images/placeholder.jpg'}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface group-hover:text-primary transition-colors">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-outline font-mono">
                            {p.variants[0]?.sku || 'SKU-N/A'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 capitalize text-on-surface-variant">
                      {p.category}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-container text-on-surface">
                        {p.variants.length} variant{p.variants.length !== 1 ? 's' : ''}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono">
                      <span
                        className={`font-bold ${
                          isLow ? 'text-amber-600' : 'text-on-surface'
                        }`}
                      >
                        {totalProdStock}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-on-surface">
                      {formatUSD(p.basePrice)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {p.badge ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-secondary-container text-on-secondary-container">
                          {p.badge}
                        </span>
                      ) : (
                        <span className="text-outline text-[11px]">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products`}
                          target="_blank"
                          className="p-1.5 rounded-full hover:bg-surface-container text-outline hover:text-on-surface transition-colors"
                          title="View on Storefront"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-1.5 rounded-full hover:bg-surface-container text-outline hover:text-on-surface transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
