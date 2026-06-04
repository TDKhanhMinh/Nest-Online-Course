"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Eye,
  Loader2,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { StudentOrderDto } from "../../infrastructure/order.api";
import { useOrdersQuery } from "../hooks/use-orders";

export function OrderHistoryView() {
  const t = useTranslations("Orders");
  const { data: orders, isLoading } = useOrdersQuery();
  const [selectedOrder, setSelectedOrder] = useState<StudentOrderDto | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCESS": return <CheckCircle2 className="h-4 w-4" />;
      case "PENDING": return <Clock className="h-4 w-4" />;
      case "FAILED": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCESS": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "PENDING": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "FAILED": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCESS": return t("status.success");
      case "PENDING": return t("status.pending");
      case "FAILED": return t("status.failed");
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-brand-amber" />
      </div>
    );
  }

  const ordersList = orders ?? [];

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      {/* Breadcrumb */}
      <nav className="mb-10 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-amber transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-semibold text-slate-900 dark:text-white">{t("breadcrumb")}</span>
      </nav>

      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-slate-500 text-lg font-medium">Manage your purchases and download invoices.</p>
        </div>
      </div>

      <Card className="overflow-hidden border-brand-border bg-brand-bg/40 backdrop-blur-xl shadow-2xl rounded-[2rem]">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-brand-bg2/50">
                <TableRow className="border-brand-border hover:bg-transparent">
                  <TableHead className="py-6 px-8 font-black uppercase tracking-widest text-[11px] text-slate-500">{t("table.id")}</TableHead>
                  <TableHead className="py-6 px-8 font-black uppercase tracking-widest text-[11px] text-slate-500">{t("table.date")}</TableHead>
                  <TableHead className="py-6 px-8 font-black uppercase tracking-widest text-[11px] text-slate-500">{t("table.items") || "Items"}</TableHead>
                  <TableHead className="py-6 px-8 font-black uppercase tracking-widest text-[11px] text-slate-500 text-right">{t("table.total")}</TableHead>
                  <TableHead className="py-6 px-8 font-black uppercase tracking-widest text-[11px] text-slate-500 text-center">{t("table.status")}</TableHead>
                  <TableHead className="py-6 px-8 font-black uppercase tracking-widest text-[11px] text-slate-500 text-center">{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersList.length > 0 ? (
                  ordersList.map((order, idx) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group border-brand-border hover:bg-brand-amber/[0.02] transition-colors"
                    >
                      <TableCell className="py-8 px-8 font-mono text-sm font-bold text-slate-900 dark:text-white">
                        {order.id.slice(0, 12)}...
                      </TableCell>
                      <TableCell className="py-8 px-8 text-sm font-medium text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="py-8 px-8 max-w-[300px]">
                        <div className="flex flex-col gap-1">
                          {order.items.map((item, i) => (
                            <span key={i} className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1">
                              {item.courseTitle}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="py-8 px-8 text-right font-black text-slate-900 dark:text-white">
                        {formatPrice(order.totalAmount)}
                      </TableCell>
                      <TableCell className="py-8 px-8">
                        <div className="flex justify-center">
                          <Badge className={`px-4 py-1.5 rounded-full border-2 font-black uppercase tracking-wider text-[10px] flex items-center gap-1.5 shadow-sm ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-8 px-8">
                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 font-bold hover:bg-brand-amber/10 hover:text-brand-amber text-slate-600 dark:text-slate-400 gap-1.5 border border-brand-border rounded-xl"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                            {t("view_invoice")}
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center">
                        <ShoppingBag className="h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-slate-500 font-bold">{t("empty")}</p>
                        <Button asChild variant="link" className="text-brand-amber font-black mt-2">
                          <Link href="/courses">Browse Courses</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Helper Footer */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
        <p className="text-sm font-medium text-slate-500">
          Showing <span className="font-bold text-slate-900 dark:text-white">{ordersList.length}</span> transactions
        </p>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={selectedOrder !== null} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg bg-brand-bg2 border border-brand-border rounded-2xl p-6">
          {selectedOrder && (
            <>
              <DialogHeader className="border-b border-brand-border pb-4 mb-4">
                <DialogTitle className="text-xl font-bold font-sora text-slate-900 dark:text-white flex items-center gap-2">
                  Order Details
                  <span className="text-xs font-mono text-slate-500">#{selectedOrder.id.slice(0, 12)}</span>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Transaction date: {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status & Total */}
                <div className="flex justify-between items-center bg-brand-bg/50 p-4 rounded-xl border border-brand-border">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status</span>
                    <Badge className={`w-fit px-3 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1.5 ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      {getStatusLabel(selectedOrder.status)}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Amount</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>

                {/* Items list */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Purchased Courses</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {selectedOrder.items.map((item) => (
                      <div key={item.courseId} className="flex gap-4 items-center bg-brand-bg3/30 p-3 rounded-xl border border-brand-border/50">
                        <div className="h-12 w-12 bg-brand-bg2 rounded-lg border border-brand-border overflow-hidden shrink-0 relative flex items-center justify-center">
                          {item.courseThumbnail ? (
                            <Image src={item.courseThumbnail} alt={item.courseTitle} fill className="object-cover" />
                          ) : (
                            <CreditCard className="h-5 w-5 text-brand-amber/30" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                            {item.courseTitle}
                          </p>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white shrink-0">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6 pt-4 border-t border-brand-border/50">
                <Button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-brand-amber text-black hover:bg-brand-amber2 font-bold px-6 rounded-xl animate-in fade-in zoom-in duration-100"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* --- Hybrid Responsive Summary ---
          mobile  (default / sm): Table becomes scrollable horizontally, badges and text sizes adjusted for small screens.
          tablet  (md / lg): Filter and Search move to top right, table columns expand.
          desktop (xl / 2xl): Full table width, high-fidelity badges, and hover actions (opacity-0 to 100).
          Interaction: Hover effects on rows, action buttons with tooltips (implied), and clear status indicators.
      */}
    </div>
  );
}
