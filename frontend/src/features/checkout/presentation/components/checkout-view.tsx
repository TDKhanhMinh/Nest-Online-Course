"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { ChevronRight, CreditCard, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCartQuery } from "../hooks/use-cart";
import { useCheckoutMutation } from "../hooks/use-orders";
import { paymentApi } from "../../infrastructure/payment.api";
import { toast } from "sonner";
import Image from "next/image";

export function CheckoutView() {
  const t = useTranslations("Checkout");
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInitiating, setIsInitiating] = useState(false);

  const { data: cart, isLoading: cartLoading } = useCartQuery();
  const checkoutMutation = useCheckoutMutation();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const handleCheckout = async () => {
    if (!cart) return;

    try {
      setIsInitiating(true);
      // 1. Create order
      const order = await checkoutMutation.mutateAsync();

      // 2. If free course checkout (totalAmount is 0)
      if (order.totalAmount === 0) {
        setIsSuccess(true);
        setIsInitiating(false);
        return;
      }

      // 3. Initiate payment gateway redirection
      const method = paymentMethod.toUpperCase() as "VNPAY" | "PAYPAL";
      const paymentData = await paymentApi.initiatePayment({
        orderId: order.id,
        paymentMethod: method,
      });

      if (paymentData.paymentUrl) {
        toast.loading("Redirecting to payment gateway...");
        window.location.href = paymentData.paymentUrl;
      } else {
        throw new Error("Failed to retrieve payment gateway URL");
      }
    } catch (err: any) {
      setIsInitiating(false);
      toast.error(err?.response?.data?.message || err.message || "Failed to process checkout");
    }
  };

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

  if (cartLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-brand-amber" />
      </div>
    );
  }

  if (isInitiating) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center min-h-[70vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="mb-8 rounded-full border-4 border-brand-amber border-t-transparent h-16 w-16"
        />
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="mb-4 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t("processing")}
          </h1>
          <p className="text-slate-500 max-w-md text-base font-medium leading-relaxed mx-auto">
            {t("redirecting")}
          </p>
        </motion.div>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const totalAmount = cart?.totalAmount ?? 0;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <h2 className="mb-3 text-3xl font-extrabold text-slate-900 dark:text-white">Your cart is empty</h2>
        <p className="mb-10 text-slate-500 max-w-sm text-lg">Add some courses to your cart before checking out.</p>
        <Button asChild size="lg" className="bg-brand-amber px-10 py-6 text-lg font-bold text-black hover:bg-brand-amber2 rounded-xl">
          <Link href="/courses">Browse Courses</Link>
        </Button>
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
              defaultValue="vnpay" 
              onValueChange={setPaymentMethod}
              className="grid grid-cols-1 gap-4"
            >
              {[
                { 
                  id: "vnpay", 
                  label: "VNPay Sandbox", 
                  desc: "Thanh toán bằng thẻ ATM nội địa, Thẻ quốc tế (Visa/Master) hoặc QR Code qua VNPay", 
                  icon: <div className="h-8 w-16 bg-blue-500 rounded flex items-center justify-center text-[10px] font-black text-white">VNPay</div> 
                },
                { 
                  id: "paypal", 
                  label: "PayPal Sandbox", 
                  desc: "Thanh toán nhanh bằng ví PayPal hoặc thẻ quốc tế quy đổi sang USD", 
                  icon: <div className="h-8 w-16 bg-blue-600 rounded flex items-center justify-center text-[10px] font-bold text-white italic">PayPal</div> 
                }
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
                      <span className="text-xs font-medium text-slate-500 leading-normal max-w-md">{method.desc}</span>
                    </div>
                  </div>
                  <div className="opacity-80 shrink-0">
                     {method.icon}
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </section>

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

                {/* Course items list */}
                <div className="space-y-6 mb-10">
                  {items.map((item) => (
                    <div key={item.courseId} className="flex gap-5 group">
                      <div className="h-16 w-16 bg-brand-bg2 rounded-2xl overflow-hidden shrink-0 border-2 border-brand-border group-hover:border-brand-amber/30 transition-colors relative">
                        {item.thumbnailUrl ? (
                          <Image src={item.thumbnailUrl} alt={item.title} fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full bg-brand-amber/5 flex items-center justify-center">
                            <CreditCard className="h-7 w-7 text-brand-amber/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-sm font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-amber transition-colors">{item.title}</p>
                        <p className="text-xs font-bold text-slate-500 mt-1">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-5 rounded-2xl bg-brand-bg2/30 p-6 border border-brand-border/50">
                   <Separator className="bg-brand-border/50 my-4" />
                   <div className="flex justify-between items-end">
                      <span className="text-lg font-black text-slate-600 dark:text-slate-400">Total</span>
                      <div className="text-right">
                        <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{formatPrice(totalAmount)}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">Guaranteed lowest price</p>
                      </div>
                   </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  disabled={checkoutMutation.isPending || isInitiating}
                  className="w-full mt-10 bg-brand-amber h-16 text-xl font-black text-black hover:bg-brand-amber2 shadow-[0_20px_50px_rgba(245,158,11,0.3)] rounded-2xl transition-all hover:translate-y-[-2px] active:translate-y-[1px] disabled:opacity-50"
                >
                  {checkoutMutation.isPending || isInitiating ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    t("order_summary.complete_button")
                  )}
                </Button>

                <p className="text-[11px] text-center text-slate-500 mt-8 leading-relaxed font-medium">
                  {t("order_summary.terms", { terms: "Terms of Service" })}
                </p>
              </CardContent>
            </Card>
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
