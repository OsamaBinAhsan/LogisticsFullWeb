'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Package,
  Layers,
  Sparkles,
  DollarSign,
  Tag,
  CheckCircle,
} from 'lucide-react';
import { ImageDropzone } from '@/components/shared/image-dropzone';
import { VariantMatrix } from '@/components/admin/variant-matrix';
import { productsService } from '@/lib/services/products.service';
import { fadeUp, staggerContainer } from '@/lib/motion';

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Apparel');
  const [tagsInput, setTagsInput] = useState('');
  const [basePrice, setBasePrice] = useState(1500);
  const [badge, setBadge] = useState<'new' | 'bestseller' | 'low-stock' | 'sale' | ''>('new');
  const [isFeatured, setIsFeatured] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>(['/images/placeholder.jpg']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFilesAdded = (files: File[]) => {
    // Simulated image URLs
    const newUrls = files.map((_, i) => `/images/products/upload-${Date.now()}-${i}.jpg`);
    setImages((prev) => [...prev, ...newUrls]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Product name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const formattedVariants =
        variants.length > 0
          ? variants.map((v, i) => ({
              id: `VAR-${Date.now()}-${i}`,
              sku: v.sku || `${name.slice(0, 3).toUpperCase()}-${i}`,
              size: v.size,
              color: v.color,
              price: Number(v.price) || basePrice,
              costPrice: Number(v.costPrice) || Math.round(basePrice * 0.5),
              stock: Number(v.stock) || 10,
              images: [],
            }))
          : [
              {
                id: `VAR-${Date.now()}-0`,
                sku: `${name.slice(0, 4).toUpperCase()}-STD`,
                price: basePrice,
                costPrice: Math.round(basePrice * 0.5),
                stock: 25,
                images: [],
              },
            ];

      await productsService.createProduct({
        name,
        description,
        category,
        tags,
        basePrice,
        images: images.length > 0 ? images : ['/images/placeholder.jpg'],
        badge: badge ? badge : undefined,
        isFeatured,
        rating: 5.0,
        reviewCount: 0,
        variants: formattedVariants,
      });

      router.push('/admin/products');
    } catch (err) {
      console.error('Failed to create product', err);
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-5xl mx-auto space-y-6"
    >
      {/* Top Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg bg-[#0E121B] border border-[#1E293B]/70 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="dyno-tape">CATALOG STUDIO</span>
              <span className="text-xs font-mono text-zinc-500">NEW SKU GENERATOR</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display mt-0.5">
              Create New Product
            </h1>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#14B8A6] hover:bg-[#2DD4BF] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_16px_rgba(20,184,166,0.3)] active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : 'Publish Product'}
        </button>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <motion.div
          variants={fadeUp}
          className="p-6 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70 space-y-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E293B]/70">
            <Package className="w-4 h-4 text-[#14B8A6]" />
            <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wider">
              1. General Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-zinc-400 font-semibold uppercase block">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Obsidian Heavyweight Fleece Hoodie"
                className="w-full bg-[#06080A] border border-[#1E293B]/70 rounded-lg px-3.5 py-2.5 text-white focus:border-[#14B8A6] focus:outline-none text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-semibold uppercase block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#06080A] border border-[#1E293B]/70 rounded-lg px-3.5 py-2.5 text-white focus:border-[#14B8A6] focus:outline-none"
              >
                <option value="Apparel">Apparel</option>
                <option value="Accessories">Accessories</option>
                <option value="Footwear">Footwear</option>
                <option value="Electronics">Electronics</option>
                <option value="Beauty">Beauty & Grooming</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-semibold uppercase block">
                Badge / Ribbon Tag
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value as any)}
                className="w-full bg-[#06080A] border border-[#1E293B]/70 rounded-lg px-3.5 py-2.5 text-white focus:border-[#14B8A6] focus:outline-none"
              >
                <option value="">No Badge</option>
                <option value="new">New Drop</option>
                <option value="bestseller">Bestseller</option>
                <option value="low-stock">Low Stock</option>
                <option value="sale">Special Sale</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-zinc-400 font-semibold uppercase block">
                Description & Care Info
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write full product specs, fabric compositions, and styling details..."
                className="w-full bg-[#06080A] border border-[#1E293B]/70 rounded-lg p-3 text-white focus:border-[#14B8A6] focus:outline-none font-sans text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-zinc-400 font-semibold uppercase block flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-zinc-500" />
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="winter, oversized, streetwear, organic"
                className="w-full bg-[#06080A] border border-[#1E293B]/70 rounded-lg px-3.5 py-2 text-white focus:border-[#14B8A6] focus:outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Pricing & Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pricing */}
          <motion.div
            variants={fadeUp}
            className="p-6 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70 space-y-4"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-[#1E293B]/70">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wider">
                2. Base Pricing (BDT)
              </h2>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Standard Retail Price</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full bg-[#06080A] border border-[#1E293B]/70 rounded-lg px-3 py-2 text-emerald-400 font-bold text-base focus:border-[#14B8A6] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-[#1E293B] text-[#14B8A6] accent-[#14B8A6]"
                />
                <label
                  htmlFor="featured-toggle"
                  className="text-xs text-zinc-300 cursor-pointer font-mono"
                >
                  Feature this item on storefront home drops
                </label>
              </div>
            </div>
          </motion.div>

          {/* Media Dropzone */}
          <motion.div
            variants={fadeUp}
            className="p-6 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70 space-y-4"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-[#1E293B]/70">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wider">
                3. Product Imagery
              </h2>
            </div>

            <ImageDropzone onFilesAdded={handleFilesAdded} />
          </motion.div>
        </div>

        {/* Multi-Variant Matrix */}
        <motion.div
          variants={fadeUp}
          className="p-6 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70 space-y-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E293B]/70">
            <Layers className="w-4 h-4 text-[#14B8A6]" />
            <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wider">
              4. Variant Matrix (Size &times; Color SKUs)
            </h2>
          </div>

          <VariantMatrix
            onChange={(newVars) => setVariants(newVars)}
            productSlug={name ? name.slice(0, 6) : 'PROD'}
          />
        </motion.div>
      </form>
    </motion.div>
  );
}
