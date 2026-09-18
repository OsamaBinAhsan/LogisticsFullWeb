"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { StatCard } from "@/components/admin/stat-card";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { OrdersTable } from "@/components/admin/orders-table";
import { LogisticsMountCard } from "@/components/admin/logistics-mount-card";
import { ordersService } from "@/lib/services/orders.service";
import type { AuraOrder } from "@/types";
import {
  ShoppingBag,
  TrendingUp,
  Users,
  Package,
  Zap,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<AuraOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ordersService.getOrders().then((data: any) => {
      setOrders(Array.isArray(data) ? data : data?.orders || []);
      setIsLoading(false);
    });
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) =>
    ["pending", "confirmed", "processing"].includes(o.status)
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const totalCustomers = new Set(orders.map((o) => o.customer.id)).size;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Operations Dashboard
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time overview of your AuraCommerce store
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Sync Active</span>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Revenue"
          value={totalRevenue}
          format="currency"
          icon={TrendingUp}
          change={+12.4}
          color="teal"
        />
        <StatCard
          title="Total Orders"
          value={orders.length}
          format="number"
          icon={ShoppingBag}
          change={+8.1}
          color="amber"
        />
        <StatCard
          title="Pending Dispatch"
          value={pendingOrders}
          format="number"
          icon={Package}
          change={-2.3}
          color="crimson"
        />
        <StatCard
          title="Customers"
          value={totalCustomers}
          format="number"
          icon={Users}
          change={+5.7}
          color="teal"
        />
      </motion.div>

      {/* Revenue Chart + Logistics Mount */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <RevenueChart orders={orders} />
        </div>
        <div>
          <LogisticsMountCard pendingOrders={pendingOrders} />
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div variants={fadeUp}>
        <OrdersTable orders={orders} isLoading={isLoading} />
      </motion.div>
    </motion.div>
  );
}
