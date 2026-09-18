import { z } from 'zod';

export const ProductVariantSchema = z.object({
  id: z.string(),
  sku: z.string().min(2),
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.number().positive(),
  costPrice: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string().url()).default([]),
});
export type ProductVariant = z.infer<typeof ProductVariantSchema>;

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string().min(2),
  description: z.string(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  variants: z.array(ProductVariantSchema).min(1),
  basePrice: z.number().positive(),
  images: z.array(z.string()).min(1),
  rating: z.number().min(0).max(5).default(4.5),
  reviewCount: z.number().int().nonnegative().default(0),
  badge: z.enum(['new', 'bestseller', 'low-stock', 'sale']).optional(),
  isFeatured: z.boolean().default(false),
  createdAt: z.string(),
});
export type Product = z.infer<typeof ProductSchema>;

export const CreateProductSchema = ProductSchema.omit({ id: true, slug: true, createdAt: true });
export type CreateProduct = z.infer<typeof CreateProductSchema>;
