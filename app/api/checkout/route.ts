import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/services/orders.service';

// Mock function for checkout logic
const calculateOrderTotals = (items: any[], baseShipping: number) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : baseShipping;
  return { subtotal, shipping, total: subtotal + shipping };
};

const processPayment = async (amount: number, paymentMethod: string) => {
  // Simulate payment processing
  return new Promise(resolve => setTimeout(() => resolve(true), 1000));
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, items, shipping: clientShipping } = body;
    
    // Server-side validation and calculation
    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    const { total, shipping, subtotal } = calculateOrderTotals(items, clientShipping || 100);
    
    // Mock Payment processing
    await processPayment(total, customer.paymentMethod || 'cash_on_delivery');

    // Create Order
    const orderData = {
      customer,
      items,
      subtotal,
      shipping,
      total,
      status: 'pending',
      paymentStatus: customer.paymentMethod === 'cash_on_delivery' ? 'unpaid' : 'paid',
    };

    const order = await createOrder(orderData);
    
    return NextResponse.json({ 
      success: true, 
      orderId: order.id, 
      invoiceNumber: order.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
      total 
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ success: false, error: 'Checkout process failed' }, { status: 500 });
  }
}
