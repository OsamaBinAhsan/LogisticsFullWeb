'use client';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  RowSelectionState,
} from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check, Truck, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AuraOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  channel: string;
  status: string;
  paymentStatus: string;

  total: number;
  date: string;
  sku: string[]; // For fuzzy search
}

interface OrdersTableProps {
  orders: any[];
  isLoading?: boolean;
}

export function OrdersTable({ orders = [], isLoading }: OrdersTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const normalizedOrders: AuraOrder[] = useMemo(() => {
    return (orders || []).map((o: any) => ({
      id: o.id,
      customerName: o.customerName || o.customer?.name || 'Customer',
      customerPhone: o.customerPhone || o.customer?.phone || '',
      channel: o.channel || 'web',
      status: o.status || 'pending',
      paymentStatus: o.paymentStatus || (o.isPaid ? 'paid' : 'unpaid'),
      total: o.total || 0,
      date: o.date || o.createdAt || new Date().toISOString(),
      sku: o.sku || (o.lineItems ? o.lineItems.map((li: any) => li.sku) : []),
    }));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'All') return normalizedOrders;
    return normalizedOrders.filter((o) => {
      if (activeTab === 'Payment Confirmed') return o.status === 'payment_confirmed' || o.paymentStatus === 'paid';
      if (activeTab === 'Pending Dispatch') return o.status === 'pending_dispatch' || o.status === 'pending' || o.status === 'confirmed';
      if (activeTab === 'Returned') return o.status === 'returned';
      if (activeTab === 'Completed') return o.status === 'completed' || o.status === 'delivered';
      return true;
    });
  }, [normalizedOrders, activeTab]);


  const columns = useMemo<ColumnDef<AuraOrder>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-[#334155] bg-[#1E293B] text-[#14B8A6] focus:ring-[#14B8A6]"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-[#334155] bg-[#1E293B] text-[#14B8A6] focus:ring-[#14B8A6]"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        accessorKey: 'id',
        header: 'Order ID',
        cell: (info) => <span className="font-mono text-slate-300 text-xs">{info.getValue<string>()}</span>,
      },
      {
        accessorFn: (row) => `${row.customerName} ${row.customerPhone}`,
        id: 'customer',
        header: 'Customer',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{row.original.customerName}</span>
            <span className="text-xs text-slate-500 font-mono">{row.original.customerPhone}</span>
          </div>
        ),
      },
      {
        accessorKey: 'channel',
        header: 'Channel',
        cell: (info) => {
          const val = info.getValue<string>();
          const bg = val === 'whatsapp' ? 'bg-[#22C55E]/10 text-[#22C55E]' : val === 'facebook' ? 'bg-[#EC4899]/10 text-[#EC4899]' : 'bg-[#3B82F6]/10 text-[#3B82F6]';
          return <span className={cn('text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider', bg)}>{val}</span>;
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const val = info.getValue<string>();
          const colorMap: Record<string, string> = {
            payment_confirmed: 'bg-emerald-500/10 text-emerald-400',
            pending_dispatch: 'bg-amber-500/10 text-amber-400',
            returned: 'bg-red-500/10 text-red-400',
            completed: 'bg-emerald-500/20 text-emerald-500',
            pending: 'bg-slate-500/10 text-slate-400',
          };
          return (
            <motion.div layout className={cn('inline-flex text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider', colorMap[val] || colorMap.pending)}>
              <motion.span layout="position">{val.replace('_', ' ')}</motion.span>
            </motion.div>
          );
        },
      },
      {
        accessorKey: 'paymentStatus',
        header: 'Payment',
        cell: (info) => (
          <span className="text-xs font-medium text-slate-300 uppercase">{info.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'total',
        header: 'Total (BDT)',
        cell: (info) => <span className="font-mono text-white text-sm font-semibold">{info.getValue<number>().toLocaleString()}</span>,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: (info) => <span className="text-xs text-slate-400">{info.getValue<string>()}</span>,
      },
      {
        id: 'actions',
        cell: () => (
          <button className="p-1 hover:bg-[#1E293B] rounded text-slate-400 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredOrders,
    columns,
    state: { globalFilter, rowSelection },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="bg-[#0E121B]/85 border border-[#1E293B]/70 rounded-xl overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] flex flex-col">
      <div className="p-4 border-b border-[#1E293B]/70 flex items-center justify-between gap-4">
        <div className="flex space-x-1 overflow-x-auto no-scrollbar">
          {['All', 'Payment Confirmed', 'Pending Dispatch', 'Returned', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors relative',
                activeTab === tab ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/50'
              )}
            >
              {activeTab === tab && (
                <motion.div layoutId="orderTab" className="absolute inset-0 bg-[#334155] rounded-md -z-10" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
              )}
              {tab}
            </button>
          ))}
        </div>
        <input
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search orders..."
          className="bg-[#1E293B]/50 border border-[#334155] rounded-md px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6] w-64 placeholder:text-slate-500"
        />
      </div>

      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#14B8A6]/10 border-b border-[#14B8A6]/30 px-4 py-2 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-[#14B8A6]">{selectedCount} row(s) selected</span>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1 bg-[#1E293B] hover:bg-[#334155] text-white text-xs px-3 py-1.5 rounded transition-colors border border-[#334155]">
                <Download size={14} /> <span>Export CSV</span>
              </button>
              <button className="flex items-center space-x-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 rounded transition-colors border border-emerald-500/30">
                <Check size={14} /> <span>Mark as Paid</span>
              </button>
              <button className="flex items-center space-x-1 bg-[#14B8A6] hover:bg-[#0D9488] text-white text-xs px-3 py-1.5 rounded transition-colors">
                <Truck size={14} /> <span>Send to Logistics Queue</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-[#1E293B]/70 bg-[#0A0D14]">
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-[#1E293B]/40 hover:bg-[#1E293B]/40 transition-colors group">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 whitespace-nowrap align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500 text-sm">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-3 border-t border-[#1E293B]/70 flex items-center justify-end space-x-2 bg-[#0A0D14]">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 text-xs font-medium text-white bg-[#1E293B] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#334155] transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 text-xs font-medium text-white bg-[#1E293B] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#334155] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
