'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  AlertTriangle,
  ArrowUpRight,
  Edit2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { productsService } from '@/lib/services/products.service';
import type { Product } from '@/types';
import { formatBDT } from '@/lib/utils';
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
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-display">
            Product Catalog & SKU Master
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Manage multi-variant merchandise, pricing, and live catalog states
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#14B8A6] hover:bg-[#2DD4BF] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_16px_rgba(20,184,166,0.3)] active:scale-95"
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
        <div className="p-4 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70">
          <div className="text-xs font-mono text-zinc-400 uppercase">Total Products</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {products.length}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
            {categories.length - 1} active categories
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70">
          <div className="text-xs font-mono text-zinc-400 uppercase">Total Stock Units</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {totalStock}
          </div>
          <div className="text-[11px] text-[#14B8A6] font-mono mt-0.5">
            Omni-channel ready
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70">
          <div className="text-xs font-mono text-zinc-400 uppercase">Low Stock Alerts</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {lowStockCount}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
            Stock &le; 5 units
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70">
          <div className="text-xs font-mono text-zinc-400 uppercase">Inventory Asset Value</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {formatBDT(inventoryValue)}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
            Estimated cost basis
          </div>
        </div>
      </motion.div>

      {/* Filter and Search Bar */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0E121B]/80 p-4 rounded-xl border border-[#1E293B]/70"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU, or tag..."
            className="w-full bg-[#06080A] border border-[#1E293B]/70 text-xs font-mono pl-9 pr-4 py-2 rounded-lg text-white placeholder:text-zinc-500 focus:border-[#14B8A6] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#14B8A6] text-black font-bold'
                  : 'bg-[#06080A] text-zinc-400 border border-[#1E293B]/70 hover:text-white'
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
        className="p-1 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70 overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1E293B]/70 bg-[#06080A]/60 text-[11px] uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-4">Item & Info</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Variants</th>
                <th className="py-3 px-4 text-right">Stock</th>
                <th className="py-3 px-4 text-right">Retail Price</th>
                <th className="py-3 px-4 text-center">Badge</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/50">
              {filteredProducts.map((p) => {
                const totalProdStock = p.variants.reduce((s, v) => s + v.stock, 0);
                const isLow = totalProdStock <= 5;

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-[#131929]/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-black/40 border border-[#1E293B]/70 shrink-0">
                          <Image
                            src={p.images[0] || '/images/placeholder.jpg'}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white text-xs tracking-tight">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-zinc-500 flex items-center gap-2 mt-0.5">
                            <span>ID: {p.id}</span>
                            <span>•</span>
                            <span className="text-zinc-400">{p.slug}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-300">{p.category}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-[#1E293B]/60 text-zinc-300 font-bold border border-[#1E293B]">
                        {p.variants.length} SKUs
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-bold ${
                          isLow ? 'text-amber-400 animate-pulse' : 'text-emerald-400'
                        }`}
                      >
                        {totalProdStock} pcs
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-white">
                      {formatBDT(p.basePrice)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {p.badge ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          {p.badge}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          title="View on Storefront"
                          className="p-1.5 rounded hover:bg-[#1E293B] text-zinc-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/new?edit=${p.id}`}
                          title="Edit Product"
                          className="p-1.5 rounded hover:bg-[#1E293B] text-zinc-400 hover:text-[#14B8A6] transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
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
