"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { ChevronRight, CreditCard, Lock, ShieldCheck, Wallet, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function CheckoutView() {
  const t = useTranslations("Checkout");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isSuccess, setIsSuccess] = useState(false);

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center min-h-[70vh]">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="mb-8 rounded-full bg-emerald-500/10 p-10 border-4 border-emerald-500/20 shadow-2xl shadow-emerald-500/10"
        >
          <CheckCircle2 className="h-24 w-24 text-emerald-500" strokeWidth={2.5} />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="mb-4 text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t("success.title")}
          </h1>
          <p className="mb-12 text-slate-500 max-w-lg text-lg font-medium mx-auto leading-relaxed">
            {t("success.message", { email: "student@example.com" })}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-brand-amber h-16 px-10 text-lg font-black text-black hover:bg-brand-amber2 rounded-2xl shadow-2xl shadow-brand-amber/20 transition-all hover:scale-105">
              <Link href="/my-courses">{t("success.button")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 px-10 text-lg font-black rounded-2xl border-2 border-brand-border hover:bg-brand-bg2 transition-all">
              <Link href="/orders">View Receipt</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-10 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-amber transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/cart" className="hover:text-brand-amber transition-colors">Cart</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-semibold text-slate-900 dark:text-white">{t("breadcrumb")}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Side: Payment Info */}
        <div className="lg:col-span-7 space-y-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {t("title")}
          </h1>

          {/* Payment Method Selection */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-brand-amber/20 p-2.5 rounded-xl text-brand-amber">
                <CreditCard className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t("payment_method.title")}
              </h2>
            </div>

            <RadioGroup 
              defaultValue="card" 
              onValueChange={setPaymentMethod}
              className="grid grid-cols-1 gap-4"
            >
              {[
                { id: "card", label: t("payment_method.credit_card"), desc: "Secure encryption with 256-bit SSL", icon: <CreditCard className="h-5 w-5" /> },
                { id: "momo", label: t("payment_method.momo"), desc: "Scan QR code to pay instantly", icon: <div className="h-5 w-5 bg-pink-600 rounded flex items-center justify-center text-[8px] font-bold text-white">M</div> },
                { id: "paypal", label: t("payment_method.paypal"), desc: "Pay with your PayPal balance", icon: <div className="h-5 w-8 bg-blue-600 rounded flex items-center justify-center text-[7px] font-bold text-white italic">PP</div> }
              ].map((method) => (
                <Label
                  key={method.id}
                  htmlFor={method.id}
                  className={`flex items-center justify-between rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 ${
                    paymentMethod === method.id 
                      ? "border-brand-amber bg-brand-amber/5 shadow-lg shadow-brand-amber/5" 
                      : "border-brand-border bg-brand-bg2/50 hover:bg-brand-bg3 hover:border-brand-border/80"
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <RadioGroupItem value={method.id} id={method.id} className="border-brand-amber text-brand-amber h-5 w-5" />
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-lg text-slate-900 dark:text-white">{method.label}</span>
                      <span className="text-xs font-medium text-slate-500">{method.desc}</span>
                    </div>
                  </div>
                  <div className="opacity-80 scale-110">
                     {method.icon}
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </section>

          {/* Credit Card Form (Visible only if card selected) */}
          <AnimatePresence mode="wait">
            {paymentMethod === "card" && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 rounded-3xl border border-brand-border bg-brand-bg/40 p-8 backdrop-blur-sm shadow-xl"
              >
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="card-name" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Name on Card</Label>
                    <Input id="card-name" placeholder="JOHN DOE" className="h-14 border-2 border-brand-border bg-brand-bg/50 focus-visible:ring-brand-amber rounded-2xl font-bold px-5" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="card-number" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Card Number</Label>
                    <div className="relative">
                      <Input id="card-number" placeholder="0000 0000 0000 0000" className="h-14 pl-14 border-2 border-brand-border bg-brand-bg/50 focus-visible:ring-brand-amber rounded-2xl font-mono text-lg font-bold tracking-widest" />
                      <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-3">
                      <Label htmlFor="expiry" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM / YY" className="h-14 border-2 border-brand-border bg-brand-bg/50 focus-visible:ring-brand-amber rounded-2xl font-bold px-5 text-center" />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="cvv" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">CVV / CVC</Label>
                      <div className="relative">
                        <Input id="cvv" placeholder="123" className="h-14 pl-14 border-2 border-brand-border bg-brand-bg/50 focus-visible:ring-brand-amber rounded-2xl font-bold text-center" />
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Additional Info */}
          <div className="flex items-start gap-5 rounded-3xl bg-brand-amber/5 p-8 border-2 border-brand-amber/10 shadow-inner">
            <div className="bg-brand-amber/20 p-3 rounded-2xl text-brand-amber shadow-lg shadow-brand-amber/10">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Enterprise-Grade Security</h3>
              <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed max-w-md">
                Your payment info is encrypted with 256-bit AES. We comply with PCI-DSS standards to ensure your data remains 100% private.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-28">
            <Card className="relative overflow-hidden border-brand-border bg-brand-bg/60 backdrop-blur-xl shadow-2xl rounded-[2rem]">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-amber via-brand-amber/80 to-amber-600" />
              <CardContent className="p-10">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-10 tracking-tight flex items-center gap-3">
                  {t("order_summary.title")}
                  <span className="h-2 w-2 rounded-full bg-brand-amber animate-pulse" />
                </h2>

                {/* Simplified list for summary */}
                <div className="space-y-6 mb-10">
                   {[
                     { name: "React & Next.js 14 — Zero to Hero", price: 49.99 },
                     { name: "LLM Engineering in Practice", price: 39.99 }
                   ].map((item, idx) => (
                     <div key={idx} className="flex gap-5 group">
                       <div className="h-16 w-16 bg-brand-bg2 rounded-2xl overflow-hidden shrink-0 border-2 border-brand-border group-hover:border-brand-amber/30 transition-colors">
                          <div className="h-full w-full bg-brand-amber/5 flex items-center justify-center">
                             <CreditCard className="h-7 w-7 text-brand-amber/30" />
                          </div>
                       </div>
                       <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="text-sm font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-amber transition-colors">{item.name}</p>
                          <p className="text-xs font-bold text-slate-500 mt-1">${item.price}</p>
                       </div>
                     </div>
                   ))}
                </div>

                <div className="space-y-5 rounded-2xl bg-brand-bg2/30 p-6 border border-brand-border/50">
                   <div className="flex justify-between text-sm font-medium">
                      <span className="text-slate-500">Original Price</span>
                      <span className="text-slate-900 dark:text-white font-bold">$164.98</span>
                   </div>
                   <div className="flex justify-between text-sm font-bold">
                      <span className="text-emerald-500">Discount Applied</span>
                      <span className="text-emerald-500">-$75.00</span>
                   </div>
                   <Separator className="bg-brand-border/50 my-4" />
                   <div className="flex justify-between items-end">
                      <span className="text-lg font-black text-slate-600 dark:text-slate-400">Total</span>
                      <div className="text-right">
                        <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">$89.98</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">Guaranteed lowest price</p>
                      </div>
                   </div>
                </div>

                <Button 
                  onClick={() => setIsSuccess(true)}
                  className="w-full mt-10 bg-brand-amber h-16 text-xl font-black text-black hover:bg-brand-amber2 shadow-[0_20px_50px_rgba(245,158,11,0.3)] rounded-2xl transition-all hover:translate-y-[-2px] active:translate-y-[1px]"
                >
                  {t("order_summary.complete_button")}
                </Button>

                <p className="text-[11px] text-center text-slate-500 mt-8 leading-relaxed font-medium">
                  {t("order_summary.terms", { terms: "Terms of Service" })}
                </p>
              </CardContent>
            </Card>
            
            <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale">
               <div className="h-8 w-12 bg-slate-400 rounded-md" />
               <div className="h-8 w-12 bg-slate-400 rounded-md" />
               <div className="h-8 w-12 bg-slate-400 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* --- Hybrid Responsive Summary ---
          mobile  (default / sm): Single column stack, radio buttons are full width, summary moves below.
          tablet  (md / lg): Starts showing 2 columns at LG, sticky summary on right.
          desktop (xl / 2xl): Larger spacing, enhanced focus states, and decorative elements.
          Interaction: Large touch targets (64px+) for payment selection, clear focus-visible rings.
      */}
    </div>
  );
}
