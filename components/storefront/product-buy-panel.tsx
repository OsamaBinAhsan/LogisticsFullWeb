'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Zap,
  Check,
  Truck,
  ShieldCheck,
  MessageCircle,
  Heart,
  Minus,
  Plus,
} from 'lucide-react';
import type { Product, ProductVariant } from '@/types';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { formatBDT } from '@/lib/utils';

interface ProductBuyPanelProps {
  product: Product;
}

export function ProductBuyPanel({ product }: ProductBuyPanelProps) {
  const router = useRouter();
  const { addItem, openDrawer } = useCart();
  const { has, toggle } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: `${product.id}-default`,
      sku: product.id,
      price: product.basePrice,
      costPrice: product.basePrice * 0.5,
      stock: 10,
      images: [],
    }
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = has(product.id);
  const isOutOfStock = selectedVariant.stock <= 0;
  const isLowStock = selectedVariant.stock > 0 && selectedVariant.stock <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      image: product.images[0] || '/images/placeholder.jpg',
      price: selectedVariant.price,
      quantity,
      size: selectedVariant.size,
      color: selectedVariant.color,
      sku: selectedVariant.sku,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
    openDrawer();
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      image: product.images[0] || '/images/placeholder.jpg',
      price: selectedVariant.price,
      quantity,
      size: selectedVariant.size,
      color: selectedVariant.color,
      sku: selectedVariant.sku,
    });
    router.push('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Hi! I would like to order *${product.name}* (SKU: ${selectedVariant.sku}, Price: ${formatBDT(selectedVariant.price)}, Qty: ${quantity}). Please confirm availability.`
    );
    window.open(`https://wa.me/8801700000000?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Title, Category & Ratings */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/30 uppercase tracking-wider">
            {product.category}
          </span>
          {product.badge && (
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
              {product.badge}
            </span>
          )}
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-white font-display tracking-tight">
          {product.name}
        </h1>

        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center text-amber-400 text-sm">
            {'★'.repeat(Math.round(product.rating))}
            {'☆'.repeat(5 - Math.round(product.rating))}
            <span className="ml-2 font-mono font-bold text-zinc-300">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            ({product.reviewCount} customer reviews)
          </span>
        </div>
      </div>

      {/* Price & Stock Display */}
      <div className="p-4 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70 flex items-baseline justify-between">
        <div>
          <span className="text-3xl font-black text-white font-mono">
            {formatBDT(selectedVariant.price)}
          </span>
          {product.basePrice > selectedVariant.price && (
            <span className="ml-3 text-sm text-zinc-500 line-through font-mono">
              {formatBDT(product.basePrice)}
            </span>
          )}
        </div>

        <div>
          {isOutOfStock ? (
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-red-500/15 text-red-400 border border-red-500/30">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
              Only {selectedVariant.stock} left!
            </span>
          ) : (
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              In Stock & Ready
            </span>
          )}
        </div>
      </div>

      {/* Variant Selector */}
      {product.variants.length > 1 && (
        <div className="space-y-3">
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Select Variation:
          </label>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((variant) => {
              const isSelected = selectedVariant.id === variant.id;
              const label = [variant.color, variant.size].filter(Boolean).join(' - ') || variant.sku;

              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-3.5 py-2 rounded-lg border text-xs font-mono transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#14B8A6]/15 border-[#14B8A6] text-white shadow-[0_0_12px_rgba(20,184,166,0.25)] font-bold'
                      : 'bg-[#0E121B] border-[#1E293B]/70 text-zinc-400 hover:text-white hover:border-zinc-600'
                  }`}
                >
                  <span>{label}</span>
                  {variant.stock <= 5 && variant.stock > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity & CTA Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-[#0E121B] border border-[#1E293B]/70 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-[#1E293B]/60 disabled:opacity-40 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-mono font-bold text-white text-sm">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(selectedVariant.stock || 99, q + 1))}
              disabled={quantity >= (selectedVariant.stock || 99)}
              className="w-9 h-9 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-[#1E293B]/60 disabled:opacity-40 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 py-3.5 px-6 rounded-lg font-mono font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
              isAdded
                ? 'bg-emerald-500 text-black shadow-[0_0_16px_rgba(16,185,129,0.4)]'
                : 'bg-[#14B8A6] hover:bg-[#2DD4BF] text-black shadow-[0_0_16px_rgba(20,184,166,0.3)] disabled:opacity-50'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added to Bag!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </motion.button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => toggle(product.id)}
            className={`p-3.5 rounded-lg border transition-all ${
              isWishlisted
                ? 'bg-pink-500/20 border-pink-500/50 text-pink-500'
                : 'bg-[#0E121B] border-[#1E293B]/70 text-zinc-400 hover:text-white hover:bg-[#1E293B]/40'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Express Checkout Buy Now */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="w-full py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(245,158,11,0.25)] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <Zap className="w-4 h-4 fill-current" />
          Instant Express Checkout (COD)
        </button>

        {/* WhatsApp Checkout Button */}
        <button
          type="button"
          onClick={handleWhatsAppOrder}
          className="w-full py-3 rounded-lg bg-[#22C55E]/10 hover:bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          Order Directly via WhatsApp
        </button>
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#1E293B]/70 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#14B8A6]" />
          <span>Same-day Dhaka delivery</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Cash on Delivery (COD)</span>
        </div>
      </div>
    </div>
  );
}
