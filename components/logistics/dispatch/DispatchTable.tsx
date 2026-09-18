"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import { rowFadeSlide } from "@/lib/motion";
import { useHapticAudio } from "@/lib/hooks/use-haptic-audio";
import { type Order, type OrderStatus } from "@/lib/validations/logistics-order.schema";
import { formatBDT } from "@/lib/utils";
import { StatusBadge } from "@/components/logistics/shared/StatusBadge";
import { ChannelBadge } from "@/components/logistics/shared/ChannelBadge";
import {
  Search,
  ExternalLink,
  Send,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Printer,
  Sparkles,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";

interface DispatchTableProps {
  orders: Order[];
  scannedOrderId: string | null;
  onSelectOrderToBook: (order: Order) => void;
  selectedOrderIds: string[];
  onToggleSelectOrder: (orderId: string) => void;
  onSelectAllVisible: (orderIds: string[]) => void;
  onClearSelection: () => void;
}

type TabFilter = "all" | "unfulfilled" | "consignment_created" | "dispatched" | "failed";

export const DispatchTable: React.FC<DispatchTableProps> = ({
  orders,
  scannedOrderId,
  onSelectOrderToBook,
  selectedOrderIds,
  onToggleSelectOrder,
  onSelectAllVisible,
  onClearSelection,
}) => {
  const { playMechanicalClick } = useHapticAudio();
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Tab Filtering & Multi-field search
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (activeTab === "unfulfilled" && o.status !== "ready_to_pack") return false;
      if (
        activeTab === "consignment_created" &&
        !["awaiting_pickup", "in_transit"].includes(o.status)
      )
        return false;
      if (
        activeTab === "dispatched" &&
        !["in_transit", "delivered"].includes(o.status)
      )
        return false;
      if (
        activeTab === "failed" &&
        !["delivery_failed", "rto_risk", "returned"].includes(o.status)
      )
        return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        o.id.toLowerCase().includes(q) ||
        o.invoiceNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.address.district.toLowerCase().includes(q) ||
        (o.consignment?.trackingCode &&
          o.consignment.trackingCode.toLowerCase().includes(q)) ||
        o.items.some(
          (it) =>
            it.sku.toLowerCase().includes(q) ||
            it.name.toLowerCase().includes(q)
        )
      );
    });
  }, [orders, activeTab, searchQuery]);

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => {
          const visibleRows = table.getRowModel().rows;
          const allSelected =
            visibleRows.length > 0 &&
            visibleRows.every((r) => selectedOrderIds.includes(r.original.id));

          return (
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => {
                playMechanicalClick();
                if (e.target.checked) {
                  onSelectAllVisible(visibleRows.map((r) => r.original.id));
                } else {
                  onClearSelection();
                }
              }}
              className="w-4 h-4 rounded bg-carbon border-obsidian-border text-hazard-amber focus:ring-hazard-amber/30 cursor-pointer accent-hazard-amber"
            />
          );
        },
        cell: ({ row }) => {
          const isSelected = selectedOrderIds.includes(row.original.id);
          return (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {
                playMechanicalClick();
                onToggleSelectOrder(row.original.id);
              }}
              className="w-4 h-4 rounded bg-carbon border-obsidian-border text-hazard-amber focus:ring-hazard-amber/30 cursor-pointer accent-hazard-amber"
            />
          );
        },
      },
      {
        id: "orderInfo",
        header: "Order & Channel",
        cell: ({ row }) => {
          const order = row.original;
          return (
            <div className="space-y-1 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-xs tracking-tight">
                  {order.id}
                </span>
                <ChannelBadge channel={order.channel} />
              </div>
              <div className="text-[10px] text-zinc-500">
                {order.invoiceNumber}
              </div>
            </div>
          );
        },
      },
      {
        id: "customer",
        header: "Customer & Phone",
        cell: ({ row }) => {
          const customer = row.original.customer;
          return (
            <div className="font-mono space-y-0.5">
              <div className="text-xs font-semibold text-zinc-200">
                {customer.name}
              </div>
              <div className="text-[11px] text-hyper-teal font-mono flex items-center gap-1">
                <PhoneCall className="w-2.5 h-2.5 shrink-0 opacity-70" />
                {customer.phone}
              </div>
            </div>
          );
        },
      },
      {
        id: "destination",
        header: "Delivery Area / Hub",
        cell: ({ row }) => {
          const addr = row.original.customer.address;
          const isHighRisk = row.original.isHighRiskArea;
          return (
            <div className="font-mono space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-200 font-medium">
                  {addr.district}
                </span>
                {isHighRisk && (
                  <span
                    title="High Return Area (>20% RTO history)"
                    className="px-1 rounded bg-razor-crimson/20 text-razor-crimson border border-razor-crimson/40 text-[9px] font-bold uppercase inline-flex items-center gap-0.5"
                  >
                    <AlertTriangle className="w-2.5 h-2.5" />
                    RTO Zone
                  </span>
                )}
              </div>
              <div className="text-[10px] text-zinc-500 truncate max-w-[180px]">
                {addr.street}
              </div>
            </div>
          );
        },
      },
      {
        id: "itemsWeight",
        header: "Items & Weight",
        cell: ({ row }) => {
          const items = row.original.items;
          const weight = row.original.totalWeightKg;
          return (
            <div className="font-mono text-xs">
              <div className="text-zinc-300 font-medium truncate max-w-[160px]">
                {items[0]?.name}
                {items.length > 1 && ` (+${items.length - 1} more)`}
              </div>
              <div className="text-[10px] text-zinc-500">
                {weight} kg • {items.reduce((s, i) => s + i.quantity, 0)} pcs
              </div>
            </div>
          );
        },
      },
      {
        id: "cod",
        header: "COD Amount",
        cell: ({ row }) => {
          return (
            <div className="font-mono">
              <span className="text-xs font-bold text-emerald-400">
                {formatBDT(row.original.codReceivable)}
              </span>
              <div className="text-[10px] text-zinc-500">
                Fee: {formatBDT(row.original.deliveryFeeChargedToCustomer)}
              </div>
            </div>
          );
        },
      },
      {
        id: "courier",
        header: "Courier & Tracking",
        cell: ({ row }) => {
          const consignment = row.original.consignment;
          if (!consignment) {
            return (
              <span className="text-[11px] font-mono text-zinc-500 italic">
                Unassigned
              </span>
            );
          }
          return (
            <div className="font-mono space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase text-hazard-amber">
                  {consignment.courier}
                </span>
                <span className="text-[10px] text-zinc-400 bg-obsidian-card px-1 rounded border border-obsidian-border">
                  {consignment.hubRoutingCode}
                </span>
              </div>
              <a
                href={consignment.trackingUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-hyper-teal hover:underline flex items-center gap-1"
              >
                <span>{consignment.trackingCode}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          );
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          return <StatusBadge status={row.original.status} />;
        },
      },
      {
        id: "action",
        header: "Action",
        cell: ({ row }) => {
          const order = row.original;
          const isBooked = Boolean(order.consignment);

          return (
            <div className="flex items-center gap-1.5">
              {!isBooked ? (
                <button
                  onClick={() => {
                    playMechanicalClick();
                    onSelectOrderToBook(order);
                  }}
                  className="px-2.5 py-1 rounded bg-hazard-amber/10 hover:bg-hazard-amber/20 border border-hazard-amber/40 text-hazard-amber text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all"
                >
                  <Send className="w-3 h-3" />
                  Book
                </button>
              ) : (
                <Link
                  href={`/admin/logistics/labels/print?ids=${order.id}`}
                  onClick={playMechanicalClick}
                  className="px-2.5 py-1 rounded bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border text-zinc-300 text-xs font-mono flex items-center gap-1 active:scale-95 transition-all"
                  title="Print Single Thermal Label"
                >
                  <Printer className="w-3 h-3 text-hyper-teal" />
                  Label
                </Link>
              )}
            </div>
          );
        },
      },
    ],
    [
      selectedOrderIds,
      onSelectAllVisible,
      onClearSelection,
      onToggleSelectOrder,
      onSelectOrderToBook,
      playMechanicalClick,
    ]
  );

  const table = useReactTable({
    data: filteredOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Search and Tabs Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-obsidian p-1 rounded-lg border border-obsidian-border overflow-x-auto">
          {[
            { id: "all", label: "All Orders", count: orders.length },
            {
              id: "unfulfilled",
              label: "Unfulfilled",
              count: orders.filter((o) => o.status === "ready_to_pack").length,
            },
            {
              id: "consignment_created",
              label: "Manifested",
              count: orders.filter((o) =>
                ["awaiting_pickup", "in_transit"].includes(o.status)
              ).length,
            },
            {
              id: "dispatched",
              label: "In Transit",
              count: orders.filter((o) => o.status === "in_transit").length,
            },
            {
              id: "failed",
              label: "RTO & Failed",
              count: orders.filter((o) =>
                ["delivery_failed", "rto_risk", "returned"].includes(o.status)
              ).length,
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playMechanicalClick();
                  setActiveTab(tab.id as TabFilter);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? "bg-obsidian-hover text-white border border-hazard-amber/40 shadow-tactile font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-hazard-amber text-black font-bold"
                      : "bg-carbon text-zinc-500 border border-obsidian-border"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Instant Multi-Field Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter customer, phone, SKU..."
            className="w-full bg-obsidian border border-obsidian-border text-xs font-mono pl-9 pr-3 py-2 rounded-lg text-zinc-200 placeholder:text-zinc-600 focus:border-hazard-amber focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs font-mono"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* TanStack Table View */}
      <div className="hardware-panel rounded-xl border border-obsidian-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-obsidian-border bg-obsidian-card/90 text-[11px] font-mono uppercase tracking-wider text-zinc-400"
                >
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="py-3 px-4 font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-obsidian-border/60 text-xs">
              <AnimatePresence mode="wait">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => {
                    const isScanned = scannedOrderId === row.original.id;
                    const isSelected = selectedOrderIds.includes(row.original.id);

                    return (
                      <motion.tr
                        key={row.id}
                        variants={rowFadeSlide}
                        initial="hidden"
                        animate="visible"
                        className={`transition-colors duration-75 ${
                          isScanned
                            ? "bg-hyper-teal/20 border-l-4 border-l-hyper-teal shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                            : isSelected
                            ? "bg-hazard-amber/5"
                            : "hover:bg-obsidian-hover/50"
                        }`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="py-3 px-4 align-middle">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="py-12 text-center text-zinc-500 font-mono text-xs"
                    >
                      No matching consignments found for current filters.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Table Pagination Deck */}
        <div className="p-3 border-t border-obsidian-border bg-obsidian-card/60 flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span>
              Showing {table.getRowModel().rows.length} of {filteredOrders.length}{" "}
              records
            </span>
            {scannedOrderId && (
              <span className="text-hyper-teal flex items-center gap-1 font-bold">
                <Sparkles className="w-3 h-3" />
                Scanned: {scannedOrderId}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playMechanicalClick();
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded border border-obsidian-border bg-obsidian hover:bg-obsidian-hover disabled:opacity-30 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount() || 1}
            </span>
            <button
              onClick={() => {
                playMechanicalClick();
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded border border-obsidian-border bg-obsidian hover:bg-obsidian-hover disabled:opacity-30 active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
