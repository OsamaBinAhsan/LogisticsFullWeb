"use client";

import React from "react";
import { type Order } from "@/lib/validations/logistics-order.schema";
import { formatBDT } from "@/lib/utils";
import { SvgBarcode } from "@/components/logistics/shared/SvgBarcode";
import { ChannelBadge } from "@/components/logistics/shared/ChannelBadge";

interface ThermalLabelCardProps {
  order: Order;
  size?: "4x6" | "3x2";
}

export const ThermalLabelCard: React.FC<ThermalLabelCardProps> = ({
  order,
  size = "4x6",
}) => {
  const trackingCode = order.consignment?.trackingCode || `EXP-${order.id}`;
  const courierName = order.consignment?.courier || "steadfast";
  const hubCode = order.customer.address.hubCode || "DHK-CENTRAL";

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-BD");
  };

  return (
    <div
      className={`thermal-label-container bg-white text-black font-sans border-2 border-dashed border-zinc-400 p-5 rounded-md shadow-md mx-auto print:border-none print:shadow-none print:m-0 print:p-4 print:rounded-none ${
        size === "4x6" ? "w-[380px] min-h-[570px]" : "w-[320px] min-h-[420px]"
      }`}
      style={{
        pageBreakAfter: "always",
        breakAfter: "page",
      }}
    >
      {/* 1. Header: Merchant Logo, Hub Code & Courier Engine */}
      <div className="border-b-2 border-black pb-2 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black tracking-tighter uppercase font-mono">
              AURACOMMERCE
            </span>
            <span className="text-[9px] font-mono px-1 py-0.5 bg-black text-white font-bold rounded">
              EXPRESS
            </span>
          </div>
          <div className="text-[9px] text-zinc-600 leading-tight mt-0.5">
            Merchant Return: House 12, Road 4, Tejgaon I/A, Dhaka 1208
            <br />
            Support Hotline: +880 9612-000111
          </div>
        </div>

        {/* Large Bold Hub Code */}
        <div className="text-right">
          <div className="text-lg font-black font-mono uppercase bg-black text-white px-2 py-0.5 rounded leading-tight">
            {hubCode}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-800 mt-0.5">
            {courierName}
          </div>
        </div>
      </div>

      {/* 2. Primary Barcode Section: Code 128 */}
      <div className="py-3 text-center border-b-2 border-black flex flex-col items-center justify-center">
        <SvgBarcode
          value={trackingCode}
          width={2.2}
          height={62}
          barColor="#000000"
          includeText={true}
        />
        <div className="flex items-center justify-between w-full px-2 mt-1 text-[10px] font-mono">
          <span>ORD: {order.id}</span>
          <span>WEIGHT: {order.totalWeightKg} KG</span>
          <span>DATE: {formatDate(order.createdAt)}</span>
        </div>
      </div>

      {/* 3. Recipient Details (Bold, >= 14pt print typography) */}
      <div className="py-2.5 border-b-2 border-black space-y-1">
        <div className="text-[11px] font-bold uppercase text-zinc-600 tracking-wider">
          SHIP TO RECIPIENT:
        </div>
        <div className="text-lg font-black text-black leading-snug">
          {order.customer.name}
        </div>
        <div className="text-base font-extrabold text-black font-mono tracking-tight">
          📞 {order.customer.phone}
          {order.customer.secondaryPhone && ` / ${order.customer.secondaryPhone}`}
        </div>
        <div className="text-sm font-semibold text-zinc-800 leading-tight pt-0.5">
          {order.customer.address.street}
        </div>
        <div className="text-sm font-bold text-black uppercase">
          {order.customer.address.district} — {order.customer.address.zone.replace("_", " ")}
        </div>
      </div>

      {/* 4. COD Box Callout (Bold & High Visibility) */}
      <div className="my-2 border-4 border-black p-2 text-center bg-zinc-100 print:bg-transparent">
        <div className="text-[11px] font-black uppercase tracking-wider text-black">
          CASH ON DELIVERY (COD) RECEIVABLE
        </div>
        <div className="text-2xl font-black font-mono text-black">
          {formatBDT(order.codReceivable)}
        </div>
        <div className="text-[9px] font-bold uppercase text-zinc-700">
          *** EXACT CASH ONLY • PLEASE VERIFY PACKAGE SEAL ***
        </div>
      </div>

      {/* 5. Parcel Items & Packing Notes Breakdown */}
      <div className="pt-2 text-[10px] font-mono border-t border-zinc-300">
        <div className="flex justify-between font-bold text-zinc-700 border-b border-zinc-300 pb-0.5">
          <span>ITEM / SKU</span>
          <span>QTY</span>
        </div>
        <div className="space-y-0.5 py-1">
          {order.items.map((it, idx) => (
            <div key={idx} className="flex justify-between text-zinc-800">
              <span className="truncate max-w-[280px]">
                {it.name} ({it.sku})
              </span>
              <span className="font-bold">x{it.quantity}</span>
            </div>
          ))}
        </div>

        {order.notes && (
          <div className="mt-1 p-1 bg-zinc-100 rounded text-[9px] text-zinc-800 italic">
            Note: {order.notes}
          </div>
        )}
      </div>

      {/* 6. Footer Stamp */}
      <div className="mt-auto pt-2 border-t-2 border-black flex items-center justify-between text-[8px] font-mono uppercase text-zinc-600">
        <span>SECURITY VERIFIED • NO RETURN AFTER OPENING</span>
        <span>AURACOMMERCE v1.0</span>
      </div>
    </div>
  );
};
