import { type CheckoutPayload } from '@/lib/validations/checkout.schema';
import { calculateShippingFee } from '@/lib/utils';

const COUPON_CODES: Record<string, { type: 'percent' | 'fixed'; value: number }> = {
  'AURA10': { type: 'percent', value: 10 },
  'AURA20': { type: 'percent', value: 20 },
  'FREESHIP': { type: 'fixed', value: 0 },
  'SAVE100': { type: 'fixed', value: 100 },
};

export function validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string } {
  const upperCode = code.toUpperCase();
  const coupon = COUPON_CODES[upperCode];
  
  if (!coupon) {
    return { valid: false, discount: 0, message: 'Invalid coupon code' };
  }

  let discountAmount = 0;
  if (coupon.type === 'percent') {
    discountAmount = subtotal * (coupon.value / 100);
  } else if (coupon.type === 'fixed') {
    discountAmount = coupon.value;
  }

  // Subtotal must be greater than discount
  if (subtotal < discountAmount) {
    return { valid: false, discount: 0, message: 'Cart total is too low for this coupon' };
  }

  return { 
    valid: true, 
    discount: discountAmount, 
    message: 'Coupon applied successfully' 
  };
}

export function calculateOrderTotals(payload: CheckoutPayload): { subtotal: number; shippingFee: number; discount: number; total: number } {
  let subtotal = 0;
  
  for (const item of payload.cartItems) {
    subtotal += item.price * item.quantity;
  }

  let shippingFee = calculateShippingFee(payload.zone);
  let discount = 0;

  if (payload.couponCode) {
    const couponValidation = validateCoupon(payload.couponCode, subtotal);
    if (couponValidation.valid) {
      discount = couponValidation.discount;
      if (payload.couponCode.toUpperCase() === 'FREESHIP') {
        shippingFee = 0;
      }
    }
  }

  const total = (subtotal + shippingFee) - discount;

  return {
    subtotal,
    shippingFee,
    discount,
    total: Math.max(0, total)
  };
}

export async function processPayment(method: string, amount: number): Promise<{ success: boolean; transactionId: string }> {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const transactionId = `TXN-${timestamp}-${random}`;

  return {
    success: true,
    transactionId
  };
}
