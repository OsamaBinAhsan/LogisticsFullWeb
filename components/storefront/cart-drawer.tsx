"use client";

import * as React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/context/cart-context";
import { CurrencyFormatter } from "@/components/shared/currency-formatter";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, updateQuantity, removeItem, subtotal } = useCart();
  const [couponCode, setCouponCode] = React.useState("");
  const router = useRouter();

  const FREE_SHIPPING_THRESHOLD = 2000;
  const progressPercentage = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  const handleCheckout = () => {
    closeDrawer();
    router.push("/checkout");
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()} direction="right">
      <DrawerContent className="fixed inset-y-0 right-0 left-auto w-full sm:w-[400px] mt-0 rounded-none h-full flex flex-col bg-[#06080A] border-l border-[#1E293B]/70 z-[100] outline-none">
        <DrawerHeader className="border-b border-[#1E293B]/70 p-4 flex justify-between items-center bg-[#0E121B]/50">
          <DrawerTitle className="text-xl flex items-center gap-2">
            <ShoppingBagIcon className="w-5 h-5 text-[#14B8A6]" />
            Your Cart ({items.length})
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-100">
              <XIcon className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        {/* Free Shipping Progress */}
        <div className="p-4 bg-[#0E121B] border-b border-[#1E293B]/70">
          <div className="flex justify-between text-sm mb-2 text-slate-300">
            {remainingForFreeShipping > 0 ? (
              <span>Add <CurrencyFormatter amount={remainingForFreeShipping} className="text-[#14B8A6] font-bold" /> more for Free Shipping!</span>
            ) : (
              <span className="text-[#10B981] font-bold flex items-center gap-1">🎉 You&apos;ve unlocked free shipping!</span>
            )}
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <ShoppingBagIcon className="w-16 h-16 opacity-20" />
              <p>Your cart is empty.</p>
              <Button variant="outline" onClick={closeDrawer} className="text-[#14B8A6] border-[#14B8A6]/50">
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item) => {
                  const itemId = (item as any).product?.id || item.productId || item.id;
                  const itemName = (item as any).product?.name || item.name;
                  const itemImg = (item as any).product?.image || item.image || '/images/placeholder.jpg';
                  const itemPrice = (item as any).product?.price || item.price;
                  const itemVarLabel = item.variantName || (item.size || item.color ? [item.size, item.color].filter(Boolean).join(' / ') : item.variantId);

                  return (
                    <motion.div
                      key={`${itemId}-${item.variantId}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0, scale: 0.9 }}
                      className="flex gap-4 p-3 bg-[#0E121B]/50 rounded-lg border border-[#1E293B]/70"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={itemImg} alt={itemName} className="w-20 h-20 object-cover rounded-md bg-[#06080A]" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">{itemName}</h4>
                            <button onClick={() => removeItem(itemId, item.variantId)} className="text-slate-500 hover:text-red-500">
                              <XIcon className="w-4 h-4" />
                            </button>
                          </div>
                          {itemVarLabel && <p className="text-xs text-slate-400 mt-0.5">{itemVarLabel}</p>}
                        </div>
                        
                        <div className="flex justify-between items-end mt-2">
                          <div className="flex items-center gap-2 border border-[#1E293B]/70 rounded-md bg-[#06080A]">
                            <button onClick={() => updateQuantity(itemId, item.variantId, item.quantity - 1)} className="p-1 text-slate-400 hover:text-white" disabled={item.quantity <= 1}>
                              <MinusIcon className="w-3 h-3" />
                            </button>
                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(itemId, item.variantId, item.quantity + 1)} className="p-1 text-slate-400 hover:text-white">
                              <PlusIcon className="w-3 h-3" />
                            </button>
                          </div>
                          <CurrencyFormatter amount={itemPrice * item.quantity} className="font-mono text-sm font-semibold text-[#14B8A6]" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-[#1E293B]/70 bg-[#0E121B]">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="bg-[#06080A]"
              />
              <Button variant="secondary" onClick={() => {}}>Apply</Button>
            </div>
            
            <div className="space-y-1.5 text-sm mb-4">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <CurrencyFormatter amount={subtotal} />
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-[#1E293B]/70 mt-2">
                <span>Total</span>
                <CurrencyFormatter amount={subtotal} />
              </div>
            </div>

            <Button className="w-full text-lg h-12" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
            <button className="w-full mt-3 text-sm text-slate-400 hover:text-white transition-colors" onClick={closeDrawer}>
              Continue Shopping
            </button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
