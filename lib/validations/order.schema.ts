import { z } from 'zod';

export const AddressSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(11).max(14),
  street: z.string().min(5),
  district: z.string().min(2),
  zone: z.enum(['dhaka_inside', 'dhaka_sub', 'outside_dhaka']),
  landmark: z.string().optional(),
});

export const LineItemSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  sku: z.string(),
  name: z.string(),
  variant: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
});

export const AuraOrderSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  channel: z.enum(['web', 'whatsapp', 'facebook', 'instagram']),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']),
  customer: z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string(),
    email: z.string().email().optional(),
    totalOrders: z.number(),
    lifetimeValue: z.number(),
  }),
  shippingAddress: AddressSchema,
  lineItems: z.array(LineItemSchema).min(1),
  subtotal: z.number().nonnegative(),
  shippingFee: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().positive(),
  paymentMethod: z.enum(['cod', 'bkash', 'nagad', 'card']),
  isPaid: z.boolean(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type AuraOrder = z.infer<typeof AuraOrderSchema>;
