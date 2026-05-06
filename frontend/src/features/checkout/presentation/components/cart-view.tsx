"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { ChevronRight, ShoppingBag, Trash2, Heart, Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";

const MOCK_CART_ITEMS = [
  {
    id: "1",
    title: "React & Next.js 14 — Complete from Zero to Hero",
    author: "Khoa Nguyen",
    price: 49.99,
    originalPrice: 89.99,
    image: "/images/react-thumbnail.png",
    rating: 4.8,
    reviews: 1250,
  },
  {
    id: "2",
    title: "LLM Engineering & Prompt Engineering in Practice",
    author: "Tuan Tran",
    price: 39.99,
    originalPrice: 74.99,
    image: "/images/ai-thumbnail.png",
    rating: 4.9,
    reviews: 850,
  },
];

export function CartView() {
  const t = useTranslations("Cart");
  
  const subtotal = MOCK_CART_ITEMS.reduce((acc, item) => acc + item.originalPrice, 0);
  const total = MOCK_CART_ITEMS.reduce((acc, item) => acc + item.price, 0);
  const discount = subtotal - total;

  if (MOCK_CART_ITEMS.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 rounded-full bg-brand-bg2 p-8 border border-brand-border"
        >
          <ShoppingBag className="h-16 w-16 text-slate-400" />
        </motion.div>
        <h2 className="mb-3 text-3xl font-extrabold text-slate-900 dark:text-white">{t("empty.title")}</h2>
        <p className="mb-10 text-slate-500 max-w-sm text-lg">{t("empty.description")}</p>
        <Button asChild size="lg" className="bg-brand-amber px-10 py-6 text-lg font-bold text-black hover:bg-brand-amber2 rounded-xl shadow-xl shadow-brand-amber/20 transition-all hover:scale-105 active:scale-95">
          <Link href="/courses">{t("empty.button")}</Link>
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
        <span className="font-semibold text-slate-900 dark:text-white">{t("breadcrumb")}</span>
      </nav>

      <h1 className="mb-12 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
        {t("title")}
      </h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-brand-border">
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {t("items_count", { count: MOCK_CART_ITEMS.length })}
            </p>
          </div>
          
          <div className="space-y-4">
            {MOCK_CART_ITEMS.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group relative overflow-hidden border-brand-border bg-brand-bg/40 backdrop-blur-md hover:border-brand-amber/40 transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Thumbnail */}
                      <div className="relative aspect-video w-full sm:w-56 shrink-0 overflow-hidden sm:rounded-l-xl">
                        <Image 
                          src={item.image} 
                          alt={item.title} 
                          fill 
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <Link href={`/courses/${item.id}`} className="no-underline">
                              <h3 className="text-xl font-bold leading-tight text-slate-900 dark:text-white group-hover:text-brand-amber transition-colors line-clamp-2">
                                {item.title}
                              </h3>
                            </Link>
                            <div className="text-right shrink-0">
                              <p className="text-2xl font-black text-slate-900 dark:text-white">${item.price}</p>
                              {item.originalPrice > item.price && (
                                <p className="text-sm text-slate-400 line-through decoration-red-500/50">${item.originalPrice}</p>
                              )}
                            </div>
                          </div>
                          <p className="text-sm font-medium text-slate-500 mt-2">By <span className="text-slate-700 dark:text-slate-300">{item.author}</span></p>
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex items-center bg-brand-amber/10 px-2 py-0.5 rounded text-xs font-bold text-brand-amber">
                              {item.rating}★
                            </div>
                            <span className="text-xs text-slate-400">({item.reviews} reviews)</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 mt-6">
                          <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
                            {t("remove")}
                          </button>
                          <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-brand-amber transition-colors">
                            <Heart className="h-4 w-4" />
                            {t("move_to_wishlist")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-8">
            <Card className="relative overflow-hidden border-brand-border bg-brand-bg/60 backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-amber to-amber-600" />
              <CardContent className="p-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
                  {t("summary.title")}
                </h2>

                <div className="space-y-5">
                  <div className="flex justify-between items-center text-slate-500 font-medium">
                    <span>{t("summary.original_price")}</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-500 font-bold bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
                    <span className="flex items-center gap-2"><Tag className="h-4 w-4" /> {t("summary.discounts")}</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-brand-border/50 my-6" />
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-slate-600 dark:text-slate-400">{t("summary.total")}</span>
                    <div className="text-right">
                      <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">${total.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Inclusive of all taxes</p>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full mt-10 bg-brand-amber h-16 text-xl font-black text-black hover:bg-brand-amber2 shadow-2xl shadow-brand-amber/30 rounded-2xl transition-all hover:translate-y-[-2px] active:translate-y-[1px]">
                  <Link href="/checkout">{t("summary.checkout_button")}</Link>
                </Button>
                
                <div className="mt-8 flex items-center justify-center gap-3 text-slate-400">
                  <div className="h-px flex-1 bg-brand-border" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout</span>
                  <div className="h-px flex-1 bg-brand-border" />
                </div>
                
                <p className="text-[10px] text-center text-slate-500 mt-4 leading-relaxed italic">
                  30-Day Money-Back Guarantee. No questions asked.
                </p>
              </CardContent>
            </Card>

            {/* Coupon Code */}
            <Card className="border-brand-border bg-brand-bg/40 backdrop-blur-md border-dashed border-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-brand-amber/20 p-2 rounded-lg">
                    <Tag className="h-5 w-5 text-brand-amber" />
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">
                    Have a coupon?
                  </h3>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder={t("summary.coupon_placeholder")} 
                    className="h-12 border-brand-border bg-brand-bg/50 focus-visible:ring-brand-amber font-medium rounded-xl"
                  />
                  <Button variant="outline" className="h-12 border-2 border-brand-amber text-brand-amber font-black hover:bg-brand-amber hover:text-black rounded-xl transition-all">
                    {t("summary.coupon_apply")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* --- Hybrid Responsive Summary ---
          mobile  (default / sm): Single column stack, full-width images, cards take full width.
          tablet  (md / lg): Two column grid starts at LG, summary becomes sticky on the right.
          desktop (xl / 2xl): Extra whitespace, enhanced hover effects, and premium typography.
          Interaction: Tap targets for remove/wishlist buttons are spaced, hover states on cards.
      */}
    </div>
  );
}
