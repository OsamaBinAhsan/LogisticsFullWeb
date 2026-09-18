"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { OrdersTable } from "@/components/admin/orders-table";
import { ordersService } from "@/lib/services/orders.service";
import type { AuraOrder } from "@/types";
import { Download } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AuraOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ordersService.getOrders().then((data: any) => {
      setOrders(Array.isArray(data) ? data : data?.orders || []);
      setIsLoading(false);
    });
  }, []);

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Order ID,Customer,Phone,Status,Total,Date\n" +
      orders
        .map(
          (o) =>
            `${o.id},"${o.customer?.name || ''}","${o.customer?.phone || ''}",${o.status},${o.total},${o.createdAt}`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aura_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-8 max-w-[1720px] mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-2xl font-bold text-on-surface tracking-tight">
              Order & Shipment Manifest
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
              Live Fleet Stream
            </span>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant mt-1">
            Track, filter, and dispatch real-time customer consignments across global nodes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV Manifest
          </button>
        </div>
      </motion.div>

      {/* Order Stats Row */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 md:grid-cols-5 gap-3"
      >
        {[
          { label: "All Consignments", count: orders.length, color: "text-on-surface" },
          { label: "Pending Pack", count: orders.filter((o) => o.status === "pending").length, color: "text-amber-600" },
          { label: "Processing", count: orders.filter((o) => ["confirmed", "processing"].includes(o.status)).length, color: "text-primary" },
          { label: "In Flight / Shipped", count: orders.filter((o) => o.status === "shipped").length, color: "text-blue-600" },
          { label: "Delivered", count: orders.filter((o) => o.status === "delivered").length, color: "text-secondary" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container shadow-sm"
          >
            <div className="text-[10px] font-label-sm uppercase tracking-wider text-outline font-bold">
              {stat.label}
            </div>
            <div className={`text-2xl font-headline font-bold mt-1 ${stat.color}`}>
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
