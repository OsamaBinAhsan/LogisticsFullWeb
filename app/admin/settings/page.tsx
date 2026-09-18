'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  Key,
  Save,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/motion';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('AuraCommerce Premium');
  const [storeEmail, setStoreEmail] = useState('support@auracommerce.io');
  const [currency, setCurrency] = useState('BDT');
  const [taxRate, setTaxRate] = useState(0);
  const [hubAddress, setHubAddress] = useState('House 12, Road 4, Tejgaon I/A, Dhaka 1208');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-display">
            System & Store Settings
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Configure global store identity, regional tax rates, and warehouse hubs
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#14B8A6] hover:bg-[#2DD4BF] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_16px_rgba(20,184,166,0.3)] active:scale-95"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-black" /> : <Save className="w-4 h-4" />}
          {isSaved ? 'Settings Saved!' : 'Save Changes'}
        </button>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Profile */}
        <motion.div
          variants={fadeUp}
          className="p-6 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70 space-y-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E293B]/70">
            <Store className="w-4 h-4 text-[#14B8A6]" />
            <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wider">
              Store Profile & Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-400 block font-semibold">Store Public Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-[#06080A] border border-[#1E293B]/70 rounded-lg px-3 py-2 text-white focus:border-[#14B8A6] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 block font-semibold">Support Email</label>
              <input
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className="w-full bg-[#06080A] border border-[#1E293B]/70 rounded-lg px-3 py-2 text-white focus:border-[#14B8A6] focus:outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Currency & Financial Configuration */}
        <motion.div
          variants={fadeUp}
          className="p-6 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70 space-y-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E293B]/70">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wider">
              Regional Currency & Fiscal Policy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-400 block font-semibold">Operating Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#06080A] border border-[#1E293B]/70 rounded-lg px-3 py-2 text-white focus:border-[#14B8A6] focus:outline-none"
              >
                <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                <option value="USD">USD ($) - US Dollar</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 block font-semibold">VAT / Sales Tax (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full bg-[#06080A] border border-[#1E293B]/70 rounded-lg px-3 py-2 text-white focus:border-[#14B8A6] focus:outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Default Fulfillment Warehouse Hub */}
        <motion.div
          variants={fadeUp}
          className="p-6 rounded-xl bg-[#0E121B]/90 border border-[#1E293B]/70 space-y-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E293B]/70">
            <Truck className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wider">
              Primary Dispatch Hub & Return Depot
            </h2>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <label className="text-zinc-400 block font-semibold">
              Return-To-Origin (RTO) Hub Address
            </label>
            <input
              type="text"
              value={hubAddress}
              onChange={(e) => setHubAddress(e.target.value)}
              className="w-full bg-[#06080A] border border-[#1E293B]/70 rounded-lg px-3 py-2 text-white focus:border-[#14B8A6] focus:outline-none"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              This address is printed on all thermal 4x6 labels as the return destination for failed doorstep deliveries.
            </p>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
}
