"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeartIcon, CheckIcon, ShoppingCartIcon } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { useWishlist } from "@/lib/context/wishlist-context";
import type { Product } from "@/types/index";
import { CurrencyFormatter } from "@/components/shared/currency-formatter";
import { springPresets } from "@/lib/motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isAdded, setIsAdded] = React.useState(false);
  const [selectedVariant, setSelectedVariant] = React.useState(
    product.variants?.[0]?.id || ""
  );

  const { addItem } = useCart();
  const { has, toggle } = useWishlist();

  const isWishlisted = has ? has(product.id) : false;

  const currentVariant =
    product.variants?.find((v) => v.id === selectedVariant) ||
    product.variants?.[0];

  const primaryImage =
    product.images?.[0] || (product as any).image || "/images/placeholder.jpg";
  const secondaryImage =
    product.images?.[1] || (product as any).secondaryImage;

  const displayPrice = currentVariant?.price || product.basePrice || (product as any).price || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      productId: product.id,
      variantId: currentVariant?.id || `${product.id}-default`,
      name: product.name,
      slug: product.slug,
      image: primaryImage,
      price: displayPrice,
      quantity: 1,
      sku: currentVariant?.sku || product.id,
      size: currentVariant?.size,
      color: currentVariant?.color,
      variantName: currentVariant
        ? [currentVariant.size, currentVariant.color].filter(Boolean).join(" / ")
        : undefined,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggle) toggle(product.id);
  };

  const isNew = product.badge === "new" || (product as any).isNew;
  const isBestseller = product.badge === "bestseller" || (product as any).isBestseller;

  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
        transition={springPresets?.stiff || { type: "spring", stiffness: 300, damping: 20 }}
        className="relative flex flex-col rounded-xl border border-[#1E293B]/70 bg-[#0E121B]/85 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] overflow-hidden group h-full cursor-pointer"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex gap-1.5">
          {isNew && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#14B8A6] text-black">
              New Drop
            </span>
          )}
          {isBestseller && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F59E0B] text-black">
              Bestseller
            </span>
          )}
          {product.badge === "low-stock" && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500 text-white">
              Low Stock
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-[#06080A]/60 backdrop-blur text-slate-300 hover:text-red-500 transition-colors"
        >
          <HeartIcon
            className={`h-4 w-4 ${isWishlisted ? "text-red-500 fill-current" : ""}`}
          />
        </button>

        {/* Image Area */}
        <div className="relative aspect-square bg-[#06080A] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={isHovered && secondaryImage ? secondaryImage : primaryImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full h-full"
            >
              <Image
                src={isHovered && secondaryImage ? secondaryImage : primaryImage}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Quick Add Slide-up */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute bottom-3 left-3 right-3 z-20"
              >
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-white/15 backdrop-blur-md border border-white/25 text-white hover:bg-[#14B8A6] hover:text-black font-mono font-bold text-xs uppercase tracking-wider"
                >
                  Quick Add
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Area */}
        <div className="p-4 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="font-semibold text-slate-100 font-[Space_Grotesk] line-clamp-2 text-sm group-hover:text-[#14B8A6] transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center gap-1 mt-1 mb-2">
              <span className="text-amber-400 text-xs">★</span>
              <span className="text-xs text-slate-400 font-mono">
                {product.rating?.toFixed(1) || "4.8"} ({product.reviewCount || 0})
              </span>
            </div>

            <CurrencyFormatter
              amount={displayPrice}
              className="text-[#14B8A6] font-mono font-bold text-base"
            />
          </div>

          {/* Variants Selection */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {product.variants.map((v) => {
                const isSelected = selectedVariant === v.id;
                const label = v.size || v.color || v.sku;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariant(v.id);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                      isSelected
                        ? "border-[#14B8A6] bg-[#14B8A6]/20 text-white font-bold"
                        : "border-[#1E293B]/70 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            className={`mt-4 w-full transition-all duration-300 font-mono text-xs uppercase tracking-wider ${
              isAdded
                ? "bg-[#10B981] hover:bg-[#10B981] text-black font-bold"
                : "bg-[#14B8A6] hover:bg-[#2DD4BF] text-black font-bold"
            }`}
            disabled={isAdded}
          >
            {isAdded ? (
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <CheckIcon className="w-4 h-4" /> Added
              </motion.div>
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingCartIcon className="w-4 h-4" /> Add to Cart
              </span>
            )}
          </Button>
        </div>
      </motion.div>
    </Link>
  );
}
