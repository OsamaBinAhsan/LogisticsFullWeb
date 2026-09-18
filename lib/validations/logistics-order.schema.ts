import { z } from 'zod';

export const RecipientZoneEnum = z.enum(['dhaka_inside', 'dhaka_sub', 'outside_dhaka']);
export type RecipientZone = z.infer<typeof RecipientZoneEnum>;

export const ChannelEnum = z.enum(['facebook', 'instagram', 'whatsapp', 'shopify', 'custom_web']);
export type Channel = z.infer<typeof ChannelEnum>;

export const OrderStatusEnum = z.enum([
  'ready_to_pack', 'awaiting_pickup', 'in_transit', 'delivered',
  'delivery_failed', 'rto_risk', 'returned', 'cancelled',
]);
export type OrderStatus = z.infer<typeof OrderStatusEnum>;

export const CourierNameEnum = z.enum(['steadfast', 'pathao', 'redx', 'custom']);
export type CourierName = z.infer<typeof CourierNameEnum>;

export const AddressSchema = z.object({
  street: z.string().min(3),
  district: z.string().min(2),
  zone: RecipientZoneEnum,
  hubCode: z.string().default('DHK-CENTRAL'),
  landmark: z.string().optional(),
});
export type RecipientAddress = z.infer<typeof AddressSchema>;

export const CustomerSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  phone: z.string().min(10),
  secondaryPhone: z.string().optional(),
  address: AddressSchema,
  trustScore: z.number().min(0).max(100).default(95),
  totalOrders: z.number().default(1),
  returnRatePercentage: z.number().default(0),
});
export type Customer = z.infer<typeof CustomerSchema>;

export const ParcelItemSchema = z.object({
  sku: z.string(),
  name: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  weightKg: z.number().positive(),
  variation: z.string().optional(),
});
export type ParcelItem = z.infer<typeof ParcelItemSchema>;

export const CourierConsignmentSchema = z.object({
  consignmentId: z.string(),
  trackingCode: z.string(),
  courier: CourierNameEnum,
  bookedAt: z.string(),
  estimatedDeliveryAt: z.string().optional(),
  deliveryCharge: z.number().nonnegative(),
  codAmount: z.number().nonnegative(),
  status: OrderStatusEnum,
  hubRoutingCode: z.string(),
  trackingUrl: z.string().optional(),
});
export type CourierConsignment = z.infer<typeof CourierConsignmentSchema>;

export const ReturnReasonEnum = z.enum([
  'unreachable', 'delayed', 'refused_doorstep', 'damaged_in_transit', 'wrong_item_sent',
]);
export type ReturnReason = z.infer<typeof ReturnReasonEnum>;

export const ReturnRecordSchema = z.object({
  returnId: z.string(),
  orderId: z.string(),
  reasonCategory: ReturnReasonEnum,
  reasonDetail: z.string(),
  failureCode: z.string(),
  attemptCount: z.number().min(1),
  agentNotes: z.string().optional(),
  timestamp: z.string(),
  recoveryStatus: z.enum(['pending_call', 'rescheduled', 'rto_confirmed', 'dispatched_again']),
});
export type ReturnRecord = z.infer<typeof ReturnRecordSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  channel: ChannelEnum,
  createdAt: z.string(),
  customer: CustomerSchema,
  items: z.array(ParcelItemSchema).min(1),
  totalWeightKg: z.number().positive(),
  codReceivable: z.number().nonnegative(),
  deliveryFeeChargedToCustomer: z.number().nonnegative(),
  discountAmount: z.number().nonnegative().optional(),
  totalAmount: z.number().positive(),
  status: OrderStatusEnum,
  consignment: CourierConsignmentSchema.optional(),
  returnRecord: ReturnRecordSchema.optional(),
  notes: z.string().optional(),
  isHighRiskArea: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});
export type Order = z.infer<typeof OrderSchema>;

export const ConsignmentBookingPayloadSchema = z.object({
  orderId: z.string(),
  courier: CourierNameEnum,
  recipientName: z.string(),
  recipientPhone: z.string(),
  recipientAddress: z.string(),
  recipientDistrict: z.string(),
  recipientZone: RecipientZoneEnum,
  codAmount: z.number().nonnegative(),
  weightKg: z.number().positive(),
  itemDescription: z.string(),
  deliveryInstructions: z.string().optional(),
});
export type ConsignmentBookingPayload = z.infer<typeof ConsignmentBookingPayloadSchema>;

export const ConsignmentResponseSchema = z.object({
  success: z.boolean(),
  consignmentId: z.string(),
  trackingCode: z.string(),
  courier: CourierNameEnum,
  deliveryCharge: z.number(),
  estimatedDays: z.string(),
  hubCode: z.string(),
  trackingUrl: z.string(),
  message: z.string(),
});
export type ConsignmentResponse = z.infer<typeof ConsignmentResponseSchema>;
