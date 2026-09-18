'use client';

import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export interface Product {
  id: string;
  thumbnail: string;
  name: string;
  sku: string;
  category: string;
  variantsCount: number;
  stock: number;
  costPrice: number;
  retailPrice: number;
  status: 'active' | 'draft' | 'archived';
}

interface InventoryGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function InventoryGrid({ products: initialProducts, isLoading }: InventoryGridProps) {
  const [data, setData] = useState(initialProducts);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    setData(initialProducts);
  }, [initialProducts]);


  // Inline editing component
  const EditableStockCell = ({ getValue, row, column, table }: any) => {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);
    const [isEditing, setIsEditing] = useState(false);

    const onBlur = () => {
      table.options.meta?.updateData(row.index, column.id, value);
      setIsEditing(false);
    };

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    if (isEditing) {
      return (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          autoFocus
          className="w-16 bg-[#0E121B] border border-[#14B8A6] text-white px-1 py-0.5 rounded text-sm font-mono focus:outline-none"
          type="number"
        />
      );
    }

    const numValue = Number(value);
    const stockClass = numValue === 0 ? 'bg-red-500/20 text-red-500' : numValue < 10 ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-500/20 text-slate-300';

    return (
      <div onDoubleClick={() => setIsEditing(true)} className="cursor-pointer group flex items-center space-x-2">
        <span className={cn('px-2 py-0.5 rounded-md font-mono text-sm font-semibold inline-block min-w-[2rem] text-center', stockClass)}>
          {value}
        </span>
        <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
      </div>
    );
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'thumbnail',
      header: '',
      cell: (info) => (
        <div className="w-10 h-10 rounded bg-[#1E293B] overflow-hidden flex items-center justify-center border border-[#334155]">
          {info.getValue() ? <img src={info.getValue<string>()} alt="" className="w-full h-full object-cover" /> : <span className="text-slate-500 text-xs">IMG</span>}
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Product Name',
      cell: (info) => <span className="text-sm font-medium text-white">{info.getValue<string>()}</span>,
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
      cell: (info) => <span className="text-xs font-mono text-slate-400">{info.getValue<string>()}</span>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: (info) => <span className="text-xs text-slate-300">{info.getValue<string>()}</span>,
    },
    {
      accessorKey: 'variantsCount',
      header: 'Variants',
      cell: (info) => <span className="text-xs text-slate-400">{info.getValue<number>()}</span>,
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: EditableStockCell,
    },
    {
      accessorKey: 'costPrice',
      header: 'Cost Price',
      cell: (info) => <span className="text-sm font-mono text-slate-400">৳{info.getValue<number>().toLocaleString()}</span>,
    },
    {
      accessorKey: 'retailPrice',
      header: 'Retail Price',
      cell: (info) => <span className="text-sm font-mono text-white">৳{info.getValue<number>().toLocaleString()}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const val = info.getValue<string>();
        return (
          <span className={cn('text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider', val === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400')}>
            {val}
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return { ...old[rowIndex]!, [columnId]: Number(value) };
            }
            return row;
          })
        );
      },
    },
  });

  return (
    <div className="bg-[#0E121B]/85 border border-[#1E293B]/70 rounded-xl overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] flex flex-col">
      <div className="p-4 border-b border-[#1E293B]/70 flex items-center justify-between gap-4">
        <h2 className="text-white font-medium">Inventory Grid</h2>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search products, SKU..."
            className="bg-[#1E293B]/50 border border-[#334155] rounded-md pl-9 pr-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6] w-64 placeholder:text-slate-500"
          />
        </div>
      </div>

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
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
