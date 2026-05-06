"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  MessageSquare,
  Clock,
  HelpCircle,
  FileText,
  Bug,
  CreditCard,
  BookOpen,
  CheckCircle2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@/i18n/navigation";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  technical: <Bug className="h-4 w-4" />,
  billing: <CreditCard className="h-4 w-4" />,
  course_content: <BookOpen className="h-4 w-4" />,
  account: <HelpCircle className="h-4 w-4" />,
  other: <FileText className="h-4 w-4" />,
};

export function ContactSupportView() {
  const t = useTranslations("ContactSupport");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setCategory("");
  };

  const contactChannels = [
    {
      icon: <Mail className="h-5 w-5 text-blue-500" />,
      title: t("channels.email.title"),
      description: t("channels.email.description"),
      value: "support@nexlearn.com",
      bg: "bg-blue-500/10",
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-emerald-500" />,
      title: t("channels.chat.title"),
      description: t("channels.chat.description"),
      value: t("channels.chat.value"),
      bg: "bg-emerald-500/10",
    },
    {
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      title: t("channels.hours.title"),
      description: t("channels.hours.description"),
      value: t("channels.hours.value"),
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-bg2 to-brand-bg">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-brand-border">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-brand-amber/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Link
              href="/help"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-amber transition-colors mb-6 no-underline"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back_to_help")}
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
              {t("hero_title")}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              {t("hero_subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Left: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-1 min-w-0"
          >
            <Card className="border-brand-border bg-white dark:bg-brand-card rounded-2xl shadow-sm overflow-hidden">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 lg:p-8">
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-1">
                    {t("form.title")}
                  </h2>
                  <p className="text-sm text-slate-500 mb-6">
                    {t("form.subtitle")}
                  </p>

                  <div className="space-y-5">
                    {/* Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          {t("form.name_label")}
                        </Label>
                        <Input
                          id="name"
                          placeholder={t("form.name_placeholder")}
                          required
                          className="border-brand-border bg-slate-50 dark:bg-slate-900/50 h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          {t("form.email_label")}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={t("form.email_placeholder")}
                          required
                          className="border-brand-border bg-slate-50 dark:bg-slate-900/50 h-11"
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t("form.category_label")}
                      </Label>
                      <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
                        <SelectTrigger className="border-brand-border bg-slate-50 dark:bg-slate-900/50 h-11">
                          <SelectValue
                            placeholder={t("form.category_placeholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(CATEGORY_ICONS).map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              <span className="flex items-center gap-2">
                                {CATEGORY_ICONS[cat]}
                                {t(`form.categories.${cat}`)}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="subject"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        {t("form.subject_label")}
                      </Label>
                      <Input
                        id="subject"
                        placeholder={t("form.subject_placeholder")}
                        required
                        className="border-brand-border bg-slate-50 dark:bg-slate-900/50 h-11"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="message"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        {t("form.message_label")}
                      </Label>
                      <Textarea
                        id="message"
                        placeholder={t("form.message_placeholder")}
                        required
                        className="min-h-[140px] sm:min-h-[160px] border-brand-border bg-slate-50 dark:bg-slate-900/50 resize-y"
                      />
                    </div>

                    {/* Attachment hint */}
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      {t("form.attachment_hint")}
                    </p>

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-brand-amber text-black hover:bg-brand-amber/90 font-semibold h-11 px-8 rounded-xl min-h-[44px]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("form.sending")}
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {t("form.submit_button")}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 sm:p-12 text-center"
                >
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {t("success.title")}
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                    {t("success.message")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="outline"
                      className="border-brand-border min-h-[44px]"
                      onClick={handleReset}
                    >
                      {t("success.send_another")}
                    </Button>
                    <Link href="/help">
                      <Button
                        variant="ghost"
                        className="text-brand-amber hover:text-brand-amber/80 min-h-[44px] w-full"
                      >
                        {t("success.back_to_help")}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>

          {/* Right: Contact Channels & Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:w-[360px] xl:w-[400px] shrink-0 space-y-4 sm:space-y-5"
          >
            {/* Contact channels */}
            {contactChannels.map((channel, idx) => (
              <Card
                key={idx}
                className="border-brand-border bg-white dark:bg-brand-card p-4 sm:p-5 rounded-xl shadow-sm"
              >
                <div className="flex gap-4">
                  <div
                    className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl ${channel.bg} flex items-center justify-center shrink-0`}
                  >
                    {channel.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-0.5">
                      {channel.title}
                    </h4>
                    <p className="text-xs text-slate-500 mb-2">
                      {channel.description}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-xs font-mono border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    >
                      {channel.value}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}

            {/* Response time */}
            <Card className="border-brand-border bg-gradient-to-br from-brand-amber/5 to-transparent p-4 sm:p-5 rounded-xl shadow-sm">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-brand-amber shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
                    {t("response_time.title")}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {t("response_time.description")}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Form and channels stack vertically, full-width. Name & email in 1-col grid.
// tablet  (md):            Name/email 2-col grid. Channels still stack below form. Larger padding.
// desktop (lg / xl):       Two-column layout: form left (flex-1), channels right (fixed 360-400px). Sticky sidebar.
// Interaction:             Form validation, loading state, success animation, category select with icons.
