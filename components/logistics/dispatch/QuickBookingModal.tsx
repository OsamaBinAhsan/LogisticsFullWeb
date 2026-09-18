"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { drawerSpring } from "@/lib/motion";
import { useHapticAudio } from "@/lib/hooks/use-haptic-audio";
import {
  type Order,
  type CourierName,
  type RecipientZone,
} from "@/lib/validations/logistics-order.schema";
import { formatBDT, cleanPhoneNumber } from "@/lib/utils";
import { mockCourierService } from "@/lib/services/couriers/mock-courier.service";
import {
  X,
  Send,
  Loader2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Flame,
} from "lucide-react";

interface QuickBookingModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete: (orderId: string, updatedOrder: Order) => void;
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({
  order,
  isOpen,
  onClose,
  onBookingComplete,
}) => {
  const { playMechanicalClick, playLaserBeep, playSuccessChime } = useHapticAudio();

  const [selectedCourier, setSelectedCourier] = useState<CourierName>("steadfast");
  const [zone, setZone] = useState<RecipientZone>("dhaka_inside");
  const [weightKg, setWeightKg] = useState<number>(0.8);
  const [codAmount, setCodAmount] = useState<number>(0);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(60);
  const [recipientPhone, setRecipientPhone] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<{
    consignmentId: string;
    trackingCode: string;
    trackingUrl: string;
    charge: number;
  } | null>(null);

  // Initialize form state from order
  useEffect(() => {
    if (order) {
      setSelectedCourier(order.consignment?.courier || "steadfast");
      setZone(order.customer.address.zone);
      setWeightKg(order.totalWeightKg || 0.8);
      setCodAmount(order.codReceivable);
      setRecipientPhone(cleanPhoneNumber(order.customer.phone));
      setRecipientAddress(order.customer.address.street);
      setBookingSuccess(null);
    }
  }, [order]);

  // Recalculate delivery fee in real-time when courier, zone, or weight changes
  useEffect(() => {
    async function updateFee() {
      const adapter = mockCourierService.getAdapter(selectedCourier);
      const charge = await adapter.calculateDeliveryCharge(zone, weightKg);
      setDeliveryCharge(charge);
    }
    updateFee();
  }, [selectedCourier, zone, weightKg]);

  if (!isOpen || !order) return null;

  const handleCourierSelect = (c: CourierName) => {
    playMechanicalClick();
    setSelectedCourier(c);
  };

  const handleBook = async () => {
    playMechanicalClick();
    setIsSubmitting(true);

    try {
      const adapter = mockCourierService.getAdapter(selectedCourier);
      const res = await adapter.bookConsignment({
        orderId: order.id,
        courier: selectedCourier,
        recipientName: order.customer.name,
        recipientPhone,
        recipientAddress,
        recipientDistrict: order.customer.address.district,
        recipientZone: zone,
        codAmount,
        weightKg,
        itemDescription: order.items.map((it) => it.name).join(", "),
      });

      playSuccessChime();
      playLaserBeep();

      const updatedOrder: Order = {
        ...order,
        status: "awaiting_pickup",
        consignment: {
          consignmentId: res.consignmentId,
          trackingCode: res.trackingCode,
          courier: selectedCourier,
          bookedAt: new Date().toISOString(),
          deliveryCharge: res.deliveryCharge,
          codAmount,
          status: "awaiting_pickup",
          hubRoutingCode: res.hubCode,
          trackingUrl: res.trackingUrl,
        },
      };

      setBookingSuccess({
        consignmentId: res.consignmentId,
        trackingCode: res.trackingCode,
        trackingUrl: res.trackingUrl,
        charge: res.deliveryCharge,
      });

      onBookingComplete(order.id, updatedOrder);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm">
        {/* Backdrop dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={drawerSpring}
          className="relative w-full max-w-xl h-full bg-obsidian border-l border-obsidian-border shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-obsidian-border flex items-center justify-between bg-obsidian-card/70 sticky top-0 z-10 backdrop-blur">
            <div>
              <div className="flex items-center gap-2">
                <span className="dyno-tape">COURIER DISPATCH TERMINAL</span>
                <span className="font-mono text-xs text-zinc-400">
                  {order.id}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-1 flex items-center gap-2">
                Book Parcel Consignment
                {order.isHighRiskArea && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-razor-crimson/20 text-razor-crimson border border-razor-crimson/40">
                    <AlertTriangle className="w-3 h-3" />
                    High RTO Area
                  </span>
                )}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-obsidian-hover text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 space-y-5 flex-1">
            {bookingSuccess ? (
              <div className="p-5 rounded-lg border border-hyper-teal/40 bg-hyper-teal/10 space-y-4">
                <div className="flex items-center gap-2 text-hyper-teal">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="font-mono font-bold text-base">
                    Consignment Manifested & Ready!
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-obsidian-card p-3 rounded border border-obsidian-border">
                    <span className="text-zinc-500 block text-[10px] uppercase">
                      Tracking Code
                    </span>
                    <span className="text-white font-bold text-sm">
                      {bookingSuccess.trackingCode}
                    </span>
                  </div>
                  <div className="bg-obsidian-card p-3 rounded border border-obsidian-border">
                    <span className="text-zinc-500 block text-[10px] uppercase">
                      Courier Engine
                    </span>
                    <span className="text-hazard-amber font-bold text-sm uppercase">
                      {selectedCourier}
                    </span>
                  </div>
                  <div className="bg-obsidian-card p-3 rounded border border-obsidian-border">
                    <span className="text-zinc-500 block text-[10px] uppercase">
                      Delivery Charge
                    </span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {formatBDT(bookingSuccess.charge)}
                    </span>
                  </div>
                  <div className="bg-obsidian-card p-3 rounded border border-obsidian-border">
                    <span className="text-zinc-500 block text-[10px] uppercase">
                      COD To Collect
                    </span>
                    <span className="text-white font-bold text-sm">
                      {formatBDT(codAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <a
                    href={bookingSuccess.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 rounded bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border text-xs font-mono text-center text-zinc-300 flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Live Courier URL
                  </a>
                  <button
                    onClick={onClose}
                    className="flex-1 py-2 rounded bg-hazard-amber hover:bg-hazard-amber-light text-black font-mono font-bold text-xs"
                  >
                    Done & Return
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Select Courier Engine Deck */}
                <div>
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-semibold">
                    1. Select Pluggable Courier Gateway
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: "steadfast", name: "Steadfast", tag: "Fast B2C" },
                      { id: "pathao", name: "Pathao", tag: "Express Hub" },
                      { id: "redx", name: "RedX", tag: "64 Districts" },
                    ].map((c) => {
                      const isSelected = selectedCourier === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleCourierSelect(c.id as CourierName)}
                          className={`p-3 rounded-lg border text-left transition-all relative ${
                            isSelected
                              ? "bg-hazard-amber/10 border-hazard-amber text-white shadow-glow-amber"
                              : "bg-obsidian-card hover:bg-obsidian-hover border-obsidian-border text-zinc-400"
                          }`}
                        >
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-hazard-amber absolute top-2 right-2" />
                          )}
                          <div className="font-mono font-bold text-xs uppercase text-zinc-200">
                            {c.name}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                            {c.tag}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Recipient Destination Zone */}
                <div>
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-semibold">
                    2. Delivery Zone & Hub Routing
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "dhaka_inside", label: "Inside Dhaka" },
                      { id: "dhaka_sub", label: "Sub-Dhaka / Suburban" },
                      { id: "outside_dhaka", label: "Outside Dhaka" },
                    ].map((z) => (
                      <button
                        key={z.id}
                        type="button"
                        onClick={() => {
                          playMechanicalClick();
                          setZone(z.id as RecipientZone);
                        }}
                        className={`py-2 px-2.5 rounded text-xs font-mono border transition-all text-center ${
                          zone === z.id
                            ? "bg-hyper-teal/15 border-hyper-teal text-hyper-teal font-bold"
                            : "bg-obsidian-card border-obsidian-border text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {z.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Details & Sanitized Phone */}
                <div className="space-y-3 bg-obsidian-card/50 p-3.5 rounded-lg border border-obsidian-border">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-1 border-b border-obsidian-border">
                    <span className="flex items-center gap-1 text-zinc-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Verified Recipient Telemetry
                    </span>
                    <span className="text-[11px] text-emerald-400">
                      Trust: {order.customer.trustScore}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-zinc-500 text-[10px] block">
                        Customer Name
                      </span>
                      <input
                        type="text"
                        defaultValue={order.customer.name}
                        className="w-full bg-carbon border border-obsidian-border rounded px-2.5 py-1.5 text-white font-mono focus:border-hazard-amber focus:outline-none text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">
                        Clean Phone (No Spaces/Prefix)
                      </span>
                      <input
                        type="text"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(cleanPhoneNumber(e.target.value))}
                        className="w-full bg-carbon border border-obsidian-border rounded px-2.5 py-1.5 text-white font-mono focus:border-hazard-amber focus:outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-zinc-500 text-[10px] block font-mono">
                      Delivery Address
                    </span>
                    <input
                      type="text"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="w-full bg-carbon border border-obsidian-border rounded px-2.5 py-1.5 text-white font-mono focus:border-hazard-amber focus:outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Weight and COD Matrix */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-obsidian-card p-3 rounded-lg border border-obsidian-border">
                    <span className="text-zinc-400 text-xs font-mono block mb-1">
                      Parcel Weight (Kg)
                    </span>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0.5)}
                      className="w-full bg-carbon border border-obsidian-border rounded px-2.5 py-1.5 text-white font-mono focus:border-hazard-amber focus:outline-none text-sm font-bold"
                    />
                  </div>

                  <div className="bg-obsidian-card p-3 rounded-lg border border-obsidian-border">
                    <span className="text-zinc-400 text-xs font-mono block mb-1">
                      COD To Collect (BDT)
                    </span>
                    <input
                      type="number"
                      value={codAmount}
                      onChange={(e) => setCodAmount(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-carbon border border-obsidian-border rounded px-2.5 py-1.5 text-emerald-400 font-mono focus:border-hazard-amber focus:outline-none text-sm font-bold"
                    />
                  </div>
                </div>

                {/* Real-time Rate Matrix Box */}
                <div className="p-3 rounded-lg bg-carbon border border-obsidian-border flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-hazard-amber" />
                    <div>
                      <div className="text-xs text-zinc-300 font-bold">
                        Estimated Delivery Charge:
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Based on {weightKg}kg to {zone.replace("_", " ")}
                      </div>
                    </div>
                  </div>
                  <div className="text-base font-bold text-hazard-amber font-mono">
                    {formatBDT(deliveryCharge)}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer Actions */}
          {!bookingSuccess && (
            <div className="p-5 border-t border-obsidian-border bg-obsidian-card/90 flex items-center justify-between sticky bottom-0 z-10 backdrop-blur">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded text-xs font-mono text-zinc-400 hover:text-white hover:bg-obsidian-hover border border-transparent transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleBook}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-lg bg-hazard-amber hover:bg-hazard-amber-light text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-amber active:scale-[0.97] transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    Manifesting Parcel...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Book & Generate Tracking
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
