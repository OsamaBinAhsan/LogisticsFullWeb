import { z } from 'zod';

export const CheckoutFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(11, 'Enter a valid Bangladeshi phone number').max(14),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  street: z.string().min(5, 'Please enter your full address'),
  district: z.string().min(2, 'Select a district'),
  zone: z.enum(['dhaka_inside', 'dhaka_sub', 'outside_dhaka']),
  landmark: z.string().optional(),
  paymentMethod: z.enum(['cod', 'bkash', 'nagad', 'card']),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
  bkashNumber: z.string().optional(),
  nagadNumber: z.string().optional(),
  transactionId: z.string().optional(),
});
export type CheckoutForm = z.infer<typeof CheckoutFormSchema>;

export const CheckoutPayloadSchema = CheckoutFormSchema.extend({
  cartItems: z.array(z.object({
    productId: z.string(),
    variantId: z.string(),
    sku: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })).min(1),
});
export type CheckoutPayload = z.infer<typeof CheckoutPayloadSchema>;
