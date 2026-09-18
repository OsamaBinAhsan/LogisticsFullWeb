"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { InventoryGrid } from "@/components/admin/inventory-grid";
import { productsService } from "@/lib/services/products.service";
import type { Product } from "@/types";
import {
  AlertTriangle,
  Plus,
} from "lucide-react";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productsService.getProducts().then(({ products: data }) => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  const lowStockCount = products.filter((p) =>
    p.variants.some((v) => v.stock <= 5)
  ).length;

  const gridProducts = products.map((p) => {
    const totalStock = p.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
    const firstVar = p.variants?.[0];
    return {
      id: p.id,
      thumbnail: p.images?.[0] || '/images/placeholder.jpg',
      name: p.name,
      sku: firstVar?.sku || p.id,
      category: p.category,
      variantsCount: p.variants?.length || 1,
      stock: totalStock,
      costPrice: firstVar?.costPrice || Math.round(p.basePrice * 0.5),
      retailPrice: firstVar?.price || p.basePrice,
      status: 'active' as const,
    };
  });

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-8 max-w-[1720px] mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-2xl font-bold text-on-surface tracking-tight">
              Warehouse Inventory & SKU Vault
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container">
              Autonomous Sync
            </span>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant mt-1">
            Real-time multi-channel SKU balances, unit costs, and warehouse pallet allocations
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-tertiary-container/20 border border-tertiary/30 text-tertiary text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
              <span>{lowStockCount} SKUs Low Stock</span>
            </div>
          )}
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Product
          </Link>
        </div>
      </motion.div>

      {/* Inventory Grid */}
      <motion.div variants={fadeUp}>
        <InventoryGrid products={gridProducts} isLoading={isLoading} />
      </motion.div>
    </motion.div>
  );
}
