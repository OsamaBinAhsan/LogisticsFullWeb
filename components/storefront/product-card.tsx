"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
        className="relative flex flex-col rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm hover:shadow-card-hover transition-all duration-300 overflow-hidden group h-full cursor-pointer"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {isNew && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary text-on-primary shadow-sm">
              New Drop
            </span>
          )}
          {isBestseller && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container shadow-sm">
              ⚡ High Velocity
            </span>
          )}
          {product.badge === "low-stock" && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container shadow-sm">
              Low Stock
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-surface/80 backdrop-blur text-on-surface-variant hover:text-error hover:bg-surface-container transition-all shadow-sm"
        >
          <HeartIcon
            className={`h-4 w-4 ${isWishlisted ? "text-error fill-current" : ""}`}
          />
        </button>

        {/* Image Area */}
        <div className="relative aspect-square bg-surface-container-low overflow-hidden">
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

          {/* Quick SLA Indicator */}
          <div className="absolute bottom-2 left-2 z-10">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur text-on-surface">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-ping" />
              SLA 24h
            </span>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-4 flex flex-col flex-1 justify-between bg-surface-container-lowest">
          <div>
            <div className="flex items-center justify-between text-xs text-outline mb-1">
              <span className="uppercase tracking-widest font-bold text-[10px]">{product.category || "Hardware"}</span>
              <div className="flex items-center gap-1">
                <span className="text-tertiary-container text-xs">★</span>
                <span className="font-semibold text-on-surface text-xs">
                  {product.rating?.toFixed(1) || "4.9"}
                </span>
              </div>
            </div>

            <h3 className="font-headline font-bold text-on-surface line-clamp-2 text-base group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            <div className="mt-2 flex items-baseline gap-2">
              <CurrencyFormatter
                amount={displayPrice}
                className="text-primary font-headline font-bold text-lg"
              />
              <span className="text-[11px] text-outline">Incl. Global Freight</span>
            </div>
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
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-on-primary font-bold shadow-sm"
                        : "border-outline-variant/60 bg-surface-container-low text-on-surface-variant hover:border-outline"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            className={`mt-4 w-full py-2.5 rounded-full font-label-md text-xs uppercase tracking-wider font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
              isAdded
                ? "bg-secondary-container text-on-secondary-container"
                : "bg-primary text-on-primary hover:bg-primary-container active:scale-98"
            }`}
            disabled={isAdded}
          >
            {isAdded ? (
              <motion.span
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5"
              >
                <CheckIcon className="w-4 h-4" /> Manifest Reserved
              </motion.span>
            ) : (
              <span className="flex items-center gap-1.5">
                <ShoppingCartIcon className="w-4 h-4" /> Quick Dispatch
              </span>
            )}
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
