"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ExternalLink,
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const MOCK_ORDERS = [
  {
    id: "ORD-99283-X1",
    date: "2024-05-01",
    total: 89.98,
    status: "success",
    items: ["React & Next.js 14", "LLM Engineering"]
  },
  {
    id: "ORD-99120-A2",
    date: "2024-04-15",
    total: 45.00,
    status: "success",
    items: ["Advanced Tailwind CSS"]
  },
  {
    id: "ORD-98850-B7",
    date: "2024-03-22",
    total: 29.99,
    status: "failed",
    items: ["Python for Data Science"]
  },
  {
    id: "ORD-98701-C3",
    date: "2024-02-10",
    total: 55.50,
    status: "refunded",
    items: ["Cybersecurity Fundamentals"]
  }
];

export function OrderHistoryView() {
  const t = useTranslations("Orders");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle2 className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "failed": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "failed": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "refunded": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search orders..." 
              className="h-14 pl-12 pr-6 border-brand-border bg-brand-bg/40 focus-visible:ring-brand-amber rounded-2xl w-full sm:w-72 font-medium"
            />
          </div>
          <Button variant="outline" className="h-14 px-6 border-brand-border bg-brand-bg/40 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-bg2 transition-all">
            <Filter className="h-5 w-5" />
            Filter
          </Button>
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
                  <TableHead className="py-6 px-8 font-black uppercase tracking-widest text-[11px] text-slate-500 text-right">{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_ORDERS.length > 0 ? (
                  MOCK_ORDERS.map((order, idx) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group border-brand-border hover:bg-brand-amber/[0.02] transition-colors"
                    >
                      <TableCell className="py-8 px-8 font-mono text-sm font-bold text-slate-900 dark:text-white">
                        {order.id}
                      </TableCell>
                      <TableCell className="py-8 px-8 text-sm font-medium text-slate-500">
                        {new Date(order.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="py-8 px-8 max-w-[240px]">
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, i) => (
                            <span key={i} className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1">
                              {item}{i < order.items.length - 1 ? "," : ""}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="py-8 px-8 text-right font-black text-slate-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="py-8 px-8">
                        <div className="flex justify-center">
                          <Badge className={`px-4 py-1.5 rounded-full border-2 font-black uppercase tracking-wider text-[10px] flex items-center gap-1.5 shadow-sm ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {t(`status.${order.status}`)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-8 px-8 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl hover:bg-brand-amber/10 hover:text-brand-amber">
                            <Download className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl hover:bg-brand-amber/10 hover:text-brand-amber">
                            <ExternalLink className="h-5 w-5" />
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
           Showing <span className="font-bold text-slate-900 dark:text-white">1 - {MOCK_ORDERS.length}</span> of <span className="font-bold text-slate-900 dark:text-white">{MOCK_ORDERS.length}</span> transactions
         </p>
         <div className="flex gap-2">
            <Button disabled variant="outline" className="rounded-xl font-bold">Previous</Button>
            <Button disabled variant="outline" className="rounded-xl font-bold">Next</Button>
         </div>
      </div>

      {/* --- Hybrid Responsive Summary ---
          mobile  (default / sm): Table becomes scrollable horizontally, badges and text sizes adjusted for small screens.
          tablet  (md / lg): Filter and Search move to top right, table columns expand.
          desktop (xl / 2xl): Full table width, high-fidelity badges, and hover actions (opacity-0 to 100).
          Interaction: Hover effects on rows, action buttons with tooltips (implied), and clear status indicators.
      */}
    </div>
  );
}
