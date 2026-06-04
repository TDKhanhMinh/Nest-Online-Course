"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, RefreshCw, ShoppingCart, BookOpen } from "lucide-react";
import { paymentApi } from "../../infrastructure/payment.api";
import { useQueryClient } from "@tanstack/react-query";
import { cartKeys } from "../hooks/use-cart";
import { orderKeys } from "../hooks/use-orders";
import { enrollmentKeys } from "@/features/student/presentation/hooks/use-enrollments";

export function CheckoutResultView() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const processed = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("Processing your payment...");
  const [orderId, setOrderId] = useState<string | null>(null);

  const token = searchParams.get("token"); // PayPal order ID
  const vnpResponseCode = searchParams.get("vnp_ResponseCode");
  const vnpOrderId = searchParams.get("orderId");

  useEffect(() => {
    // Avoid double capture on React 18 StrictMode double mount
    if (processed.current) return;
    processed.current = true;

    const handlePaymentResult = async () => {
      // 1. PayPal Flow
      if (token) {
        try {
          setStatus("loading");
          setMessage("Capturing your PayPal order...");

          const captureRes = await paymentApi.capturePayPal({ paypalOrderId: token });

          if (captureRes.status === "COMPLETED") {
            setOrderId(captureRes.orderId);
            setStatus("success");
            setMessage("Thank you! Your payment has been successfully processed.");
            
            // Invalidate caches to refresh cart, orders, and enrollments
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
            queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
          } else {
            setStatus("failed");
            setMessage(`PayPal payment was not completed. Status: ${captureRes.status}`);
          }
        } catch (err: any) {
          setStatus("failed");
          setMessage(err?.response?.data?.message || err.message || "Failed to capture PayPal transaction");
        }
      } 
      // 2. VNPay Flow
      else if (vnpResponseCode) {
        try {
          setStatus("loading");
          setMessage("Verifying your VNPay payment status...");

          if (vnpResponseCode === "00") {
            if (vnpOrderId) {
              setOrderId(vnpOrderId);
              // Poll or double-check order status from backend
              const orderStatus = await paymentApi.getPaymentStatus(vnpOrderId);
              if (orderStatus.orderStatus === "SUCCESS") {
                setStatus("success");
                setMessage("Thank you! Your VNPay payment has been successfully verified.");
              } else {
                // Sometime VNPay IPN is slightly delayed, show success anyway as responseCode is 00
                setStatus("success");
                setMessage("Your VNPay payment is being confirmed. Please check your courses in a few moments.");
              }
            } else {
              setStatus("success");
              setMessage("Thank you! Your VNPay payment has been successfully processed.");
            }

            // Invalidate caches
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
            queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
          } else {
            setStatus("failed");
            setMessage(`VNPay transaction failed. Error code: ${vnpResponseCode}`);
          }
        } catch (err: any) {
          setStatus("failed");
          setMessage(err?.response?.data?.message || err.message || "Failed to verify VNPay transaction");
        }
      } 
      // 3. No parameter error
      else {
        setStatus("failed");
        setMessage("No transaction details found in the response URL.");
      }
    };

    handlePaymentResult();
  }, [token, vnpResponseCode, vnpOrderId, queryClient]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center min-h-[70vh]">
        <Loader2 className="h-16 w-16 animate-spin text-brand-amber mb-6" strokeWidth={2.5} />
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Just a moment</h2>
        <p className="text-slate-500 font-medium max-w-sm">{message}</p>
      </div>
    );
  }

  if (status === "success") {
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
          className="space-y-6"
        >
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Payment Successful!
          </h1>
          <p className="text-slate-500 max-w-lg text-lg font-medium mx-auto leading-relaxed">
            {message}
          </p>
          {orderId && (
            <p className="text-xs font-bold text-slate-400">
              Order ID: <span className="font-mono text-slate-600 dark:text-slate-300">{orderId}</span>
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild size="lg" className="bg-brand-amber h-16 px-10 text-lg font-black text-black hover:bg-brand-amber2 rounded-2xl shadow-2xl shadow-brand-amber/20 transition-all hover:scale-105">
              <Link href="/my-courses" className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Go to My Courses
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 px-10 text-lg font-black rounded-2xl border-2 border-brand-border hover:bg-brand-bg2 transition-all">
              <Link href="/orders">View Orders</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center min-h-[70vh]">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="mb-8 rounded-full bg-rose-500/10 p-10 border-4 border-rose-500/20 shadow-2xl shadow-rose-500/10"
      >
        <XCircle className="h-24 w-24 text-rose-500" strokeWidth={2.5} />
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Payment Failed
        </h1>
        <p className="text-slate-500 max-w-lg text-lg font-medium mx-auto leading-relaxed">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button asChild size="lg" className="bg-brand-amber h-16 px-10 text-lg font-black text-black hover:bg-brand-amber2 rounded-2xl shadow-2xl shadow-brand-amber/20 transition-all hover:scale-105">
            <Link href="/checkout" className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Try Again
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-16 px-10 text-lg font-black rounded-2xl border-2 border-brand-border hover:bg-brand-bg2 transition-all">
            <Link href="/cart" className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Back to Cart
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
