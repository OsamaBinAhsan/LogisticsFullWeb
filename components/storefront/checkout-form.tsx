"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/context/cart-context";
import { CurrencyFormatter } from "@/components/shared/currency-formatter";
import {
  CreditCardIcon,
  HandCoinsIcon,
  SmartphoneIcon,
  Loader2,
  Lock,
} from "lucide-react";

interface CheckoutFormProps {
  onSubmit?: (data: any) => Promise<void> | void;
  isSubmitting?: boolean;
  showSummary?: boolean;
}

export function CheckoutForm({
  onSubmit,
  isSubmitting: externalSubmitting = false,
  showSummary = false,
}: CheckoutFormProps = {}) {
  const { items, subtotal } = useCart();

  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    district: "Dhaka",
    notes: "",
    paymentMethod: "cod",
    trxId: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [internalSubmitting, setInternalSubmitting] = React.useState(false);

  const isSubmitting = externalSubmitting || internalSubmitting;

  const dhakaInside = ["Dhaka"];
  const dhakaSub = ["Savar", "Gazipur", "Narayanganj"];
  const districts = [
    "Dhaka",
    "Savar",
    "Gazipur",
    "Narayanganj",
    "Chittagong",
    "Sylhet",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Rangpur",
    "Mymensingh",
    "Comilla",
  ];

  const getShippingFee = () => {
    if (!formData.district) return 0;
    if (dhakaInside.includes(formData.district)) return 60;
    if (dhakaSub.includes(formData.district)) return 100;
    return 130;
  };

  const shippingFee = getShippingFee();
  const total = subtotal + shippingFee;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim() || formData.phone.length < 10)
      newErrors.phone = "Valid 11-digit phone number is required";
    if (!formData.street.trim())
      newErrors.street = "Detailed delivery address is required";
    if (!formData.district) newErrors.district = "Please select a district";
    if (
      ["bkash", "nagad"].includes(formData.paymentMethod) &&
      !formData.trxId.trim()
    ) {
      newErrors.trxId = "bKash / Nagad Transaction ID is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (onSubmit) {
      await onSubmit(formData);
    } else {
      setInternalSubmitting(true);
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: formData,
            items,
            total,
            shipping: shippingFee,
          }),
        });
        const result = await res.json();
        if (result.success) {
          alert("Order placed successfully! Invoice: " + result.invoiceNumber);
        } else {
          alert(result.error || "Failed to place order");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setInternalSubmitting(false);
      }
    }
  };

  return (
    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Contact Information */}
      <Card className="bg-[#0E121B]/90 border border-[#1E293B]/70 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#14B8A6] text-black flex items-center justify-center text-xs">
              1
            </span>
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-xs font-mono text-zinc-300">
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Shakib Al Hasan"
              className={`mt-1 bg-[#06080A] border-[#1E293B] text-white focus:border-[#14B8A6] ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1 font-mono">{errors.name}</p>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="text-xs font-mono text-zinc-300">
                Phone Number (11 digits) *
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="017XXXXXXXX"
                value={formData.phone}
                onChange={handleChange}
                className={`mt-1 bg-[#06080A] border-[#1E293B] text-white focus:border-[#14B8A6] ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1 font-mono">
                  {errors.phone}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="text-xs font-mono text-zinc-300">
                Email Address (Optional)
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@domain.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 bg-[#06080A] border-[#1E293B] text-white focus:border-[#14B8A6]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Delivery Address */}
      <Card className="bg-[#0E121B]/90 border border-[#1E293B]/70 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#14B8A6] text-black flex items-center justify-center text-xs">
              2
            </span>
            Delivery Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="district" className="text-xs font-mono text-zinc-300">
              District / Zone *
            </Label>
            <Select
              value={formData.district}
              onValueChange={(val) =>
                setFormData({ ...formData, district: val })
              }
            >
              <SelectTrigger
                className={`mt-1 bg-[#06080A] border-[#1E293B] text-white ${
                  errors.district ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select a district" />
              </SelectTrigger>
              <SelectContent className="bg-[#0E121B] border-[#1E293B] text-white">
                {districts.map((d) => (
                  <SelectItem key={d} value={d} className="focus:bg-[#1E293B]">
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.district && (
              <p className="text-red-400 text-xs mt-1 font-mono">
                {errors.district}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="street" className="text-xs font-mono text-zinc-300">
              Street Address / Area *
            </Label>
            <Input
              id="street"
              name="street"
              placeholder="House/Apartment #, Road #, Sector / Area"
              value={formData.street}
              onChange={handleChange}
              className={`mt-1 bg-[#06080A] border-[#1E293B] text-white focus:border-[#14B8A6] ${
                errors.street ? "border-red-500" : ""
              }`}
            />
            {errors.street && (
              <p className="text-red-400 text-xs mt-1 font-mono">
                {errors.street}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Payment Method */}
      <Card className="bg-[#0E121B]/90 border border-[#1E293B]/70 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#14B8A6] text-black flex items-center justify-center text-xs">
              3
            </span>
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "cod", label: "Cash on Delivery", icon: HandCoinsIcon },
              { id: "bkash", label: "bKash Direct", icon: SmartphoneIcon },
              { id: "nagad", label: "Nagad Wallet", icon: SmartphoneIcon },
              { id: "card", label: "Debit/Credit Card", icon: CreditCardIcon },
            ].map((method) => {
              const isSelected = formData.paymentMethod === method.id;
              const Icon = method.icon;

              return (
                <div
                  key={method.id}
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: method.id })
                  }
                  className={`p-3 rounded-lg border text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                    isSelected
                      ? "border-[#14B8A6] bg-[#14B8A6]/10 text-white shadow-[0_0_12px_rgba(20,184,166,0.2)]"
                      : "border-[#1E293B]/70 bg-[#06080A] text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isSelected ? "text-[#14B8A6]" : "text-zinc-400"
                    }`}
                  />
                  <span className="text-xs font-mono font-semibold">
                    {method.label}
                  </span>
                </div>
              );
            })}
          </div>

          {["bkash", "nagad"].includes(formData.paymentMethod) && (
            <div className="p-4 rounded-lg bg-[#06080A] border border-amber-500/30 space-y-2 font-mono text-xs">
              <div className="text-amber-400 font-bold uppercase">
                Send Money Instructions:
              </div>
              <p className="text-zinc-300">
                Please send <strong>৳{total}</strong> to Merchant Account:{" "}
                <span className="text-[#14B8A6] font-bold">01700-000000</span> (Personal/Merchant).
              </p>
              <div>
                <Label htmlFor="trxId" className="text-xs text-zinc-400">
                  Transaction ID (TrxID) *
                </Label>
                <Input
                  id="trxId"
                  name="trxId"
                  placeholder="e.g. 9J8A7K6B"
                  value={formData.trxId}
                  onChange={handleChange}
                  className={`mt-1 bg-black text-white ${
                    errors.trxId ? "border-red-500" : "border-[#1E293B]"
                  }`}
                />
                {errors.trxId && (
                  <p className="text-red-400 text-xs mt-1">{errors.trxId}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 4: Notes */}
      <Card className="bg-[#0E121B]/90 border border-[#1E293B]/70 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#14B8A6] text-black flex items-center justify-center text-xs">
              4
            </span>
            Order Notes (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            name="notes"
            rows={2}
            placeholder="Special delivery instructions, gate code, preferred delivery time..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full rounded-md border border-[#1E293B] bg-[#06080A] px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#14B8A6]"
          />
        </CardContent>
      </Card>

      {/* Place Order CTA Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 text-base font-mono font-bold uppercase tracking-wider bg-[#14B8A6] hover:bg-[#2DD4BF] text-black shadow-[0_0_20px_rgba(20,184,166,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing Order...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>Confirm & Place Order</span>
          </>
        )}
      </Button>
    </form>
  );
}
