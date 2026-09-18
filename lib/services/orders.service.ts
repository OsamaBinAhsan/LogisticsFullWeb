import { type AuraOrder, type OrderStatus, type OrderChannel, type AuraCustomer, type RevenueDataPoint, type DashboardStats } from '@/types';
import { type CheckoutPayload } from '@/lib/validations/checkout.schema';
import { generateOrderId, generateInvoiceNumber, calculateShippingFee } from '@/lib/utils';
import { productsService } from './products.service';

const INITIAL_ORDERS: AuraOrder[] = Array.from({ length: 20 }).map((_, i) => {
  const isPaid = i % 3 !== 0;
  return {
    id: `AC-ORD-${1000 + i}`,
    invoiceNumber: `INV-2026-${8000 + i}`,
    channel: ['web', 'whatsapp', 'facebook', 'instagram'][i % 4] as OrderChannel,
    status: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'][i % 7] as OrderStatus,
    customer: {
      id: `CUST-${100 + i}`,
      name: `Customer ${i + 1}`,
      phone: `01711${200000 + i}`,
      email: `customer${i + 1}@example.com`,
      totalOrders: (i % 5) + 1,
      lifetimeValue: 1000 * ((i % 5) + 1),
    },
    shippingAddress: {
      name: `Customer ${i + 1}`,
      phone: `01711${200000 + i}`,
      street: `House ${i}, Road ${i % 10}, Block ${(i % 3) + 1}`,
      district: i % 2 === 0 ? 'Dhaka' : 'Chattogram',
      zone: i % 2 === 0 ? 'dhaka_inside' : 'outside_dhaka',
    },
    lineItems: [
      {
        productId: `PROD-00${(i % 5) + 1}`,
        variantId: `VAR-00${(i % 5) + 1}`,
        sku: `SKU-TEST-${i}`,
        name: `Test Product ${i}`,
        variant: 'Default',
        quantity: (i % 3) + 1,
        unitPrice: 1500,
        totalPrice: 1500 * ((i % 3) + 1),
      }
    ],
    subtotal: 1500 * ((i % 3) + 1),
    shippingFee: i % 2 === 0 ? 60 : 130,
    discount: 0,
    total: (1500 * ((i % 3) + 1)) + (i % 2 === 0 ? 60 : 130),
    paymentMethod: ['cod', 'bkash', 'card'][i % 3] as 'cod' | 'bkash' | 'nagad' | 'card',
    isPaid,
    createdAt: new Date(Date.now() - (i * 86400000)).toISOString(),
    updatedAt: new Date(Date.now() - (i * 86400000) + 3600000).toISOString(),
  };
});

class OrdersService {
  private orders: AuraOrder[] = [...INITIAL_ORDERS];

  private async delay(ms: number = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getOrders(filters?: { status?: OrderStatus; channel?: OrderChannel; search?: string; page?: number; limit?: number }): Promise<{ orders: AuraOrder[]; total: number }> {
    await this.delay(150);
    
    let result = [...this.orders];

    if (filters?.status) {
      result = result.filter(o => o.status === filters.status);
    }

    if (filters?.channel) {
      result = result.filter(o => o.channel === filters.channel);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) ||
        o.invoiceNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q)
      );
    }

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    
    return {
      orders: result.slice(startIndex, startIndex + limit),
      total: result.length
    };
  }

  async getOrderById(id: string): Promise<AuraOrder | null> {
    await this.delay(100);
    return this.orders.find(o => o.id === id) || null;
  }

  async createOrder(payload: CheckoutPayload): Promise<AuraOrder> {
    await this.delay(300);

    let subtotal = 0;
    const lineItems = payload.cartItems.map(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      // Decrement stock asynchronously
      productsService.updateStock(item.variantId, -item.quantity).catch(console.error);

      return {
        productId: item.productId,
        variantId: item.variantId,
        sku: item.sku,
        name: item.name,
        variant: 'Default',
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: itemTotal
      };
    });

    const shippingFee = calculateShippingFee(payload.zone);
    
    // Simplistic discount logic based on subtotal (real implementation would re-run validateCoupon)
    let discount = 0;
    if (payload.couponCode?.toUpperCase() === 'AURA10') {
      discount = subtotal * 0.1;
    }

    const total = (subtotal + shippingFee) - discount;

    const newOrder: AuraOrder = {
      id: generateOrderId(),
      invoiceNumber: generateInvoiceNumber(),
      channel: 'web',
      status: 'pending',
      customer: {
        id: `CUST-${Math.floor(Math.random() * 10000)}`,
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        totalOrders: 1,
        lifetimeValue: total,
      },
      shippingAddress: {
        name: payload.name,
        phone: payload.phone,
        street: payload.street,
        district: payload.district,
        zone: payload.zone,
        landmark: payload.landmark,
      },
      lineItems,
      subtotal,
      shippingFee,
      discount,
      total,
      paymentMethod: payload.paymentMethod,
      isPaid: payload.paymentMethod !== 'cod',
      notes: payload.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<AuraOrder | null> {
    await this.delay(150);
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) return null;

    this.orders[index] = {
      ...this.orders[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    return this.orders[index];
  }

  async getRevenueData(period: '7d' | '30d' | '90d'): Promise<RevenueDataPoint[]> {
    await this.delay(100);
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const data: RevenueDataPoint[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - (i * 86400000));
      const dateStr = date.toISOString().split('T')[0];
      
      const dayOrders = this.orders.filter(o => o.createdAt.startsWith(dateStr));
      const revenue = dayOrders.reduce((sum, o) => sum + o.total, 0);
      
      data.push({
        date: dateStr,
        revenue,
        orders: dayOrders.length,
        profit: revenue * 0.35 // Simulated 35% margin
      });
    }

    return data;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    await this.delay(100);
    
    const validOrders = this.orders.filter(o => !['cancelled', 'returned'].includes(o.status));
    const netRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
    
    return {
      netRevenue,
      totalOrders: validOrders.length,
      aov: validOrders.length > 0 ? netRevenue / validOrders.length : 0,
      pendingShipments: this.orders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status)).length,
      outOfStockSkus: 2, // Mocked
      revenueChange: 12.5, // Mocked 12.5% increase
      ordersChange: 8.2 // Mocked 8.2% increase
    };
  }

  async getTopCustomers(limit: number = 5): Promise<AuraCustomer[]> {
    await this.delay(100);
    // Group and mock
    return [
      { id: "CUST-01", name: "Ahmed", phone: "01711000001", email: "ahmed@example.com", totalOrders: 12, lifetimeValue: 45000, averageOrderValue: 3750, lastOrderDate: new Date().toISOString(), firstOrderDate: "2023-01-01T00:00:00Z", returnRate: 0, preferredChannel: "web" as OrderChannel },
      { id: "CUST-02", name: "Sara", phone: "01711000002", email: "sara@example.com", totalOrders: 8, lifetimeValue: 28000, averageOrderValue: 3500, lastOrderDate: new Date().toISOString(), firstOrderDate: "2023-02-01T00:00:00Z", returnRate: 0, preferredChannel: "instagram" as OrderChannel },
    ].slice(0, limit);
  }

}

export const ordersService = new OrdersService();

export const getOrders = (filters?: any) => ordersService.getOrders(filters);
export const getOrderById = (id: string) => ordersService.getOrderById(id);
export const createOrder = (payload: any) => ordersService.createOrder(payload);
export const updateOrderStatus = (id: string, status: any) => ordersService.updateOrderStatus(id, status);
export const getRevenueData = (period: '7d' | '30d' | '90d') => ordersService.getRevenueData(period);
export const getDashboardStats = () => ordersService.getDashboardStats();
export const getTopCustomers = (limit?: number) => ordersService.getTopCustomers(limit);

