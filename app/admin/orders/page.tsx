"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { OrdersTable } from "@/components/admin/orders-table";
import { ordersService } from "@/lib/services/orders.service";
import type { AuraOrder } from "@/types";
import {
  ShoppingBag,
  Filter,
  Download,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AuraOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ordersService.getOrders().then((data: any) => {
      setOrders(Array.isArray(data) ? data : data?.orders || []);
      setIsLoading(false);
    });
  }, []);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Order Management
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Track and manage all customer orders across channels
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-obsidian-card border border-obsidian-border text-zinc-300 text-xs font-mono hover:bg-obsidian-hover transition-all">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </motion.div>

      {/* Order Stats Row */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 md:grid-cols-5 gap-3"
      >
        {[
          { label: "All Orders", count: orders.length, color: "text-white" },
          { label: "Pending", count: orders.filter((o) => o.status === "pending").length, color: "text-hazard-amber" },
          { label: "Processing", count: orders.filter((o) => ["confirmed", "processing"].includes(o.status)).length, color: "text-blue-400" },
          { label: "Shipped", count: orders.filter((o) => o.status === "shipped").length, color: "text-hyper-teal" },
          { label: "Delivered", count: orders.filter((o) => o.status === "delivered").length, color: "text-emerald-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="hardware-panel rounded-lg p-3 border border-obsidian-border"
          >
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              {stat.label}
            </div>
            <div className={`text-2xl font-mono font-bold mt-1 ${stat.color}`}>
              {stat.count}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Full Orders Table */}
      <motion.div variants={fadeUp}>
        <OrdersTable orders={orders} isLoading={isLoading} />
      </motion.div>
    </motion.div>
  );
}
