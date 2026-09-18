'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  CreditCard,
  Truck,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/motion';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('AuraCommerce Logistics OS');
  const [storeEmail, setStoreEmail] = useState('dispatch@auracommerce.io');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState(0);
  const [hubAddress, setHubAddress] = useState('Terminal 4 Cargo Bay, JFK International Airport, Jamaica, NY 11430');
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
      className="p-8 max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-2xl font-bold text-on-surface tracking-tight">
              System & Store Settings
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container">
              AuraOS v4.8
            </span>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant mt-1">
            Configure global store identity, regional tax rates, and warehouse dispatch hubs
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-xs transition-all shadow-md active:scale-95"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
          {isSaved ? 'Settings Saved!' : 'Save Changes'}
        </button>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Profile */}
        <motion.div
          variants={fadeUp}
          className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-surface-container">
            <Store className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-bold uppercase text-on-surface tracking-wider">
              Store Profile & Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-on-surface-variant block font-bold">Store Public Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-on-surface-variant block font-bold">Support Email</label>
              <input
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Currency & Financial Configuration */}
        <motion.div
          variants={fadeUp}
          className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-surface-container">
            <CreditCard className="w-4 h-4 text-secondary" />
            <h2 className="text-xs font-bold uppercase text-on-surface tracking-wider">
              Regional Currency & Fiscal Policy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-on-surface-variant block font-bold">Operating Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="JPY">JPY (¥) - Japanese Yen</option>
                <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-on-surface-variant block font-bold">VAT / Sales Tax (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Default Fulfillment Warehouse Hub */}
        <motion.div
          variants={fadeUp}
          className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-surface-container">
            <Truck className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-bold uppercase text-on-surface tracking-wider">
              Primary Dispatch Hub & Return Depot
            </h2>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="text-on-surface-variant block font-bold">
              Return-To-Origin (RTO) Hub Address
            </label>
            <input
              type="text"
              value={hubAddress}
              onChange={(e) => setHubAddress(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <p className="text-[11px] text-outline mt-1">
              This address is embedded on all automated 4×6 thermal manifests as the verified return node.
            </p>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
}
