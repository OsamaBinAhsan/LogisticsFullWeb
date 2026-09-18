'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Printer,
  Truck,
  Boxes,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  CreditCard,
  Package,
  ExternalLink,
} from 'lucide-react';
import { ordersService } from '@/lib/services/orders.service';
import type { AuraOrder, OrderStatus } from '@/types';
import { formatBDT, formatDateTime } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/status-badge';
import { fadeUp, staggerContainer } from '@/lib/motion';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<AuraOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      ordersService.getOrderById(orderId).then((data) => {
        setOrder(data);
        setIsLoading(false);
      });
    }
  }, [orderId]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    await ordersService.updateOrderStatus(order.id, newStatus);
    setOrder({ ...order, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center font-mono text-zinc-500 text-xs">
        Retrieving order ledger #{orderId}...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center font-mono text-zinc-400 space-y-3">
        <p>Order #{orderId} not found in database records.</p>
        <Link
          href="/admin/orders"
          className="inline-block px-4 py-2 rounded bg-[#14B8A6] text-black font-bold text-xs"
        >
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-5xl mx-auto space-y-6"
    >
      {/* Top Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-lg bg-[#0E121B] border border-[#1E293B]/70 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="dyno-tape">{order.invoiceNumber}</span>
              <span className="text-xs font-mono text-zinc-500">ID: {order.id}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display mt-0.5 flex items-center gap-3">
              Order Ledger
              <StatusBadge status={order.status} />
            </h1>
          </div>
        </div>

        {/* Courier & Dispatch Action Hook Points */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <Link
            href={`/admin/logistics/labels/print?ids=${order.id}`}
            className="px-3.5 py-2 rounded-lg bg-[#0E121B] hover:bg-[#1E293B] border border-[#1E293B]/70 text-zinc-200 flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-[#14B8A6]" />
            <span>Print 4x6 Label</span>
          </Link>

          <Link
            href="/admin/logistics/dispatch"
            className="px-4 py-2 rounded-lg bg-hazard-amber hover:bg-hazard-amber-light text-black font-bold flex items-center gap-1.5 shadow-glow-amber transition-all"
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Send to Dispatch</span>
          </Link>
        </div>
      </motion.div>

      {/* Main Grid: Details + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Line items and timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Table */}
          <motion.div
            variants={fadeUp}
            className="p-5 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70 space-y-4 font-mono text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]/70">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#14B8A6]" />
                <h2 className="text-sm font-bold uppercase text-white tracking-wider">
                  Purchased Items ({order.lineItems.length})
                </h2>
              </div>
              <span className="text-zinc-500">
                Created: {formatDateTime(order.createdAt)}
              </span>
            </div>

            <div className="divide-y divide-[#1E293B]/50">
              {order.lineItems.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-white font-semibold text-sm">{item.name}</div>
                    <div className="text-[11px] text-zinc-400">
                      SKU: <span className="text-zinc-300">{item.sku}</span> • Variant: {item.variant}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-white">
                      {formatBDT(item.totalPrice)}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {formatBDT(item.unitPrice)} &times; {item.quantity} pcs
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Status Stepper Management */}
          <motion.div
            variants={fadeUp}
            className="p-5 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70 space-y-4 font-mono text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]/70">
              <span className="text-sm font-bold uppercase text-white tracking-wider">
                Lifecycle State Control
              </span>
              <span className="text-zinc-400">
                Current: <strong className="text-[#14B8A6] uppercase">{order.status}</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1">
              {(['pending', 'confirmed', 'processing', 'shipped', 'delivered'] as OrderStatus[]).map(
                (st) => {
                  const isCurrent = order.status === st;

                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`py-2 px-2 rounded-lg border text-center transition-all capitalize ${
                        isCurrent
                          ? 'bg-[#14B8A6]/20 border-[#14B8A6] text-[#14B8A6] font-bold shadow-[0_0_12px_rgba(20,184,166,0.2)]'
                          : 'bg-[#06080A] border-[#1E293B]/70 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  );
                }
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Col: Customer & Financial Audit */}
        <div className="space-y-6">
          {/* Customer Card */}
          <motion.div
            variants={fadeUp}
            className="p-5 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70 space-y-3 font-mono text-xs"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-[#1E293B]/70">
              <User className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold uppercase text-white tracking-wider">
                Customer Dossier
              </h3>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-bold text-white">{order.customer.name}</div>
              <div className="text-zinc-300 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>{order.customer.phone}</span>
              </div>
              {order.customer.email && (
                <div className="text-zinc-400 text-[11px] truncate">
                  {order.customer.email}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#1E293B]/70 space-y-1 text-zinc-400">
              <div className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Shipping Destination:
              </div>
              <div className="text-zinc-200">{order.shippingAddress.street}</div>
              <div className="text-zinc-400">
                {order.shippingAddress.district} •{' '}
                <span className="text-[#14B8A6] uppercase">
                  {order.shippingAddress.zone.replace('_', ' ')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Payment Audit Card */}
          <motion.div
            variants={fadeUp}
            className="p-5 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70 space-y-3 font-mono text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]/70">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold uppercase text-white tracking-wider">
                  Payment Ledger
                </h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                  order.isPaid
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {order.isPaid ? 'Settled' : 'Pending COD'}
              </span>
            </div>

            <div className="space-y-2 text-zinc-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatBDT(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{formatBDT(order.shippingFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#14B8A6]">
                  <span>Discount</span>
                  <span>-{formatBDT(order.discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#1E293B]/70 flex justify-between text-base font-bold text-white">
                <span>Total Due</span>
                <span className="text-emerald-400">{formatBDT(order.total)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1E293B]/70 text-[11px] text-zinc-500">
              Method:{' '}
              <strong className="text-white uppercase">{order.paymentMethod}</strong>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
