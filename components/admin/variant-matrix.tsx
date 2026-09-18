'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProductVariant {
  sku: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  costPrice: number;
}

interface VariantMatrixProps {
  onChange: (variants: ProductVariant[]) => void;
  productSlug?: string;
}

export function VariantMatrix({ onChange, productSlug = 'PROD' }: VariantMatrixProps) {
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L']);
  const [colors, setColors] = useState<string[]>(['Black']);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Auto-generate variants matrix when sizes/colors change
  useEffect(() => {
    const newVariants: ProductVariant[] = [];
    sizes.forEach((size) => {
      colors.forEach((color) => {
        // Keep existing variant data if available
        const existing = variants.find((v) => v.size === size && v.color === color);
        if (existing) {
          newVariants.push(existing);
        } else {
          newVariants.push({
            sku: `${productSlug.toUpperCase()}-${size.toUpperCase()}-${color.toUpperCase()}`.replace(/\s+/g, '-'),
            size,
            color,
            stock: 0,
            price: 0,
            costPrice: 0,
          });
        }
      });
    });
    setVariants(newVariants);
    onChange(newVariants);
  }, [sizes, colors, productSlug]);

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
    onChange(updated);
  };

  const addSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize('');
    }
  };

  const addColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor('');
    }
  };

  return (
    <div className="bg-[#0E121B]/85 border border-[#1E293B]/70 rounded-xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
      <h3 className="text-white font-medium mb-4">Variant Matrix Generator</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">Sizes</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {sizes.map((s) => (
              <span key={s} className="bg-[#1E293B] text-slate-200 text-xs px-2 py-1 rounded flex items-center gap-1 border border-[#334155]">
                {s}
                <button onClick={() => setSizes(sizes.filter((x) => x !== s))} className="text-slate-400 hover:text-red-400 transition-colors">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <form onSubmit={addSize} className="flex gap-2">
            <input
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="e.g. XL"
              className="flex-1 bg-[#1E293B]/50 border border-[#334155] rounded text-sm px-2 py-1.5 text-white focus:outline-none focus:border-[#14B8A6]"
            />
            <button type="submit" className="bg-[#1E293B] hover:bg-[#334155] text-white px-3 py-1.5 rounded text-xs font-medium transition-colors border border-[#334155]">
              Add
            </button>
          </form>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">Colors</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {colors.map((c) => (
              <span key={c} className="bg-[#1E293B] text-slate-200 text-xs px-2 py-1 rounded flex items-center gap-1 border border-[#334155]">
                {c}
                <button onClick={() => setColors(colors.filter((x) => x !== c))} className="text-slate-400 hover:text-red-400 transition-colors">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <form onSubmit={addColor} className="flex gap-2">
            <input
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="e.g. Navy Blue"
              className="flex-1 bg-[#1E293B]/50 border border-[#334155] rounded text-sm px-2 py-1.5 text-white focus:outline-none focus:border-[#14B8A6]"
            />
            <button type="submit" className="bg-[#1E293B] hover:bg-[#334155] text-white px-3 py-1.5 rounded text-xs font-medium transition-colors border border-[#334155]">
              Add
            </button>
          </form>
        </div>
      </div>

      {variants.length > 0 && (
        <div className="overflow-x-auto border border-[#1E293B]/70 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0A0D14] border-b border-[#1E293B]/70">
                <th className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase">Variant</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase">SKU</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase">Stock</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase">Price (৳)</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase">Cost (৳)</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v, i) => (
                <tr key={`${v.size}-${v.color}`} className="border-b border-[#1E293B]/40 hover:bg-[#1E293B]/20">
                  <td className="px-3 py-2">
                    <span className="text-sm font-medium text-white">{v.size} / {v.color}</span>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={v.sku}
                      onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                      className="w-full bg-transparent border-none text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#14B8A6] rounded px-1"
                    />
                  </td>
                  <td className="px-3 py-2 w-24">
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => updateVariant(i, 'stock', Number(e.target.value))}
                      className="w-full bg-[#1E293B]/50 border border-[#334155] text-sm text-white px-2 py-1 rounded focus:outline-none focus:border-[#14B8A6]"
                    />
                  </td>
                  <td className="px-3 py-2 w-32">
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => updateVariant(i, 'price', Number(e.target.value))}
                      className="w-full bg-[#1E293B]/50 border border-[#334155] text-sm text-white px-2 py-1 rounded focus:outline-none focus:border-[#14B8A6]"
                    />
                  </td>
                  <td className="px-3 py-2 w-32">
                    <input
                      type="number"
                      value={v.costPrice}
                      onChange={(e) => updateVariant(i, 'costPrice', Number(e.target.value))}
                      className="w-full bg-[#1E293B]/50 border border-[#334155] text-sm text-white px-2 py-1 rounded focus:outline-none focus:border-[#14B8A6]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
