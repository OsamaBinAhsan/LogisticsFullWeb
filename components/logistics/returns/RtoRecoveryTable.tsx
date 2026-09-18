"use client";

import React, { useState } from "react";
import { type Order } from "@/lib/validations/logistics-order.schema";
import { formatBDT } from "@/lib/utils";
import { useHapticAudio } from "@/lib/hooks/use-haptic-audio";
import {
  PhoneCall,
  CalendarCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

interface RtoRecoveryTableProps {
  orders: Order[];
  onScheduleAttempt: (orderId: string, notes: string) => Promise<void>;
}

export const RtoRecoveryTable: React.FC<RtoRecoveryTableProps> = ({
  orders,
  onScheduleAttempt,
}) => {
  const { playMechanicalClick, playSuccessChime } = useHapticAudio();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rescheduleNotes, setRescheduleNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [callingOrderId, setCallingOrderId] = useState<string | null>(null);

  const failedOrders = orders.filter(
    (o) => o.status === "delivery_failed" || o.status === "rto_risk"
  );

  const handleSimulateCall = (orderId: string, phone: string) => {
    playMechanicalClick();
    setCallingOrderId(orderId);
    setTimeout(() => {
      setCallingOrderId(null);
      alert(`Simulated VOIP call to customer at ${phone}. Call recorded to merchant audit log.`);
    }, 1200);
  };

  const handleConfirmReschedule = async () => {
    if (!selectedOrder) return;
    playMechanicalClick();
    setIsSubmitting(true);

    try {
      await onScheduleAttempt(selectedOrder.id, rescheduleNotes);
      playSuccessChime();
      setSelectedOrder(null);
      setRescheduleNotes("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hardware-panel rounded-xl p-5 border border-obsidian-border space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-obsidian-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="dyno-tape">ACTIVE INTERVENTIONS</span>
            <span className="text-[11px] font-mono text-razor-crimson font-bold">
              {failedOrders.length} CONSIGNMENTS AT RISK
            </span>
          </div>
          <h2 className="text-base font-bold text-white font-mono uppercase mt-1">
            Actionable RTO Rescue & Reschedule Desk
          </h2>
        </div>
        <p className="text-xs font-mono text-zinc-400">
          Act before 4 PM to prevent courier automatic return-to-origin fee.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-obsidian-border bg-obsidian-card/80 text-[11px] uppercase tracking-wider text-zinc-400">
              <th className="py-2.5 px-3">Order & Courier</th>
              <th className="py-2.5 px-3">Customer & Contact</th>
              <th className="py-2.5 px-3">Failure Reason</th>
              <th className="py-2.5 px-3 text-center">Rider Attempts</th>
              <th className="py-2.5 px-3 text-right">COD Value</th>
              <th className="py-2.5 px-3 text-right">Intervention Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-border/50">
            {failedOrders.length > 0 ? (
              failedOrders.map((order) => {
                const isCalling = callingOrderId === order.id;
                const rec = order.returnRecord;

                return (
                  <tr key={order.id} className="hover:bg-obsidian-hover/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{order.id}</div>
                      <div className="text-[10px] text-zinc-500">
                        {order.consignment?.courier.toUpperCase() || "MANUAL"} //{" "}
                        {order.consignment?.trackingCode}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-zinc-200">
                        {order.customer.name}
                      </div>
                      <div className="text-hyper-teal text-[11px]">
                        {order.customer.phone}
                      </div>
                      <div className="text-zinc-500 text-[10px]">
                        {order.customer.address.district}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-razor-crimson font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {rec?.reasonDetail || "Customer Unreachable on Delivery"}
                        </span>
                      </div>
                      {rec?.agentNotes && (
                        <div className="text-[10px] text-zinc-400 italic mt-0.5">
                          Note: {rec.agentNotes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold border border-zinc-700">
                        {rec?.attemptCount || 1} / 3
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-400">
                      {formatBDT(order.codReceivable)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Quick-Call Trigger */}
                        <button
                          onClick={() => handleSimulateCall(order.id, order.customer.phone)}
                          disabled={isCalling}
                          className="px-2.5 py-1 rounded bg-hyper-teal/10 hover:bg-hyper-teal/20 border border-hyper-teal/30 text-hyper-teal text-xs flex items-center gap-1 active:scale-95 transition-all"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>{isCalling ? "Dialing..." : "Quick Call"}</span>
                        </button>

                        {/* Schedule 2nd Delivery Attempt Button */}
                        <button
                          onClick={() => {
                            playMechanicalClick();
                            setSelectedOrder(order);
                            setRescheduleNotes(
                              "Customer confirmed available tomorrow afternoon. Rider please call 30 mins prior."
                            );
                          }}
                          className="px-2.5 py-1 rounded bg-hazard-amber hover:bg-hazard-amber-light text-black font-bold text-xs flex items-center gap-1 active:scale-95 transition-all"
                        >
                          <CalendarCheck className="w-3 h-3" />
                          <span>Schedule 2nd Try</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-500">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                  Zero failed parcels currently on hold. All shipments progressing normally.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reschedule Confirmation Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="hardware-panel max-w-md w-full p-6 rounded-xl border border-hazard-amber/50 space-y-4">
            <div className="flex items-center justify-between border-b border-obsidian-border pb-3">
              <div>
                <span className="dyno-tape">DISPATCH INSTRUCTION</span>
                <h3 className="text-base font-bold text-white font-mono mt-1">
                  Schedule 2nd Delivery Attempt
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-zinc-500 hover:text-white font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono text-zinc-300">
              <div>
                Order: <strong className="text-white">{selectedOrder.id}</strong> (
                {selectedOrder.customer.name})
              </div>
              <div>
                Courier:{" "}
                <strong className="text-hazard-amber uppercase">
                  {selectedOrder.consignment?.courier}
                </strong>{" "}
                - Tracking: {selectedOrder.consignment?.trackingCode}
              </div>

              <div className="pt-2">
                <label className="block text-zinc-400 text-[10px] uppercase font-bold mb-1">
                  Rider Dispatch Notes:
                </label>
                <textarea
                  rows={3}
                  value={rescheduleNotes}
                  onChange={(e) => setRescheduleNotes(e.target.value)}
                  className="w-full bg-carbon border border-obsidian-border rounded p-2 text-white font-mono text-xs focus:border-hazard-amber focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-obsidian-border">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-3 py-1.5 rounded text-xs font-mono text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                disabled={isSubmitting}
                className="px-4 py-2 rounded bg-hazard-amber hover:bg-hazard-amber-light text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-glow-amber active:scale-95 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirm & Transmit to Courier</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
