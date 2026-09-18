"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { InventoryGrid } from "@/components/admin/inventory-grid";
import { VariantMatrix } from "@/components/admin/variant-matrix";
import { productsService } from "@/lib/services/products.service";
import type { Product, ProductVariant } from "@/types";
import {
  Package,
  AlertTriangle,
  Plus,
  RefreshCw,
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

  const handleVariantChange = (productId: string, variants: ProductVariant[]) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, variants } : p))
    );
  };

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
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Inventory Management
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage product stock levels and variants
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-razor-crimson/10 border border-razor-crimson/30 text-razor-crimson text-xs font-mono">
              <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
              <span>{lowStockCount} SKUs Low Stock</span>
            </div>
          )}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-black font-mono font-bold text-xs transition-all active:scale-95">
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </button>
        </div>
      </motion.div>

      {/* Inventory Grid */}
      <motion.div variants={fadeUp}>
        <InventoryGrid products={gridProducts} isLoading={isLoading} />
      </motion.div>
    </motion.div>
  );

}
