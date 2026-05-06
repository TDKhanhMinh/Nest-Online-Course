"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { forgotPasswordSchema, ForgotPasswordValues } from "@/features/auth/application/auth.schemas";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function ForgotPasswordPage() {
  const t = useTranslations("ForgotPassword");
  const tValidation = useTranslations("Auth.Validation");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsPending(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmittedEmail(data.email);
    setIsSuccess(true);
    setIsPending(false);
  };

  if (isSuccess) {
    return (
      <Card className="border-brand-border bg-brand-card/50 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center pt-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center mb-4"
          >
            <div className="bg-green-500/20 p-3 rounded-full">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
          </motion.div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sora">
            {t("success_title")}
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
            {t("success_message", { email: submittedEmail })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pb-8">
          <Button
            variant="outline"
            className="w-full border-brand-border bg-brand-bg/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-bg hover:text-slate-900 dark:hover:text-white transition-all h-11"
            onClick={() => setIsSuccess(false)}
          >
            {t("resend_button")}
          </Button>
          <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm text-brand-amber hover:underline mt-2">
            <ArrowLeft className="h-4 w-4" />
            {t("back_to_login")}
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-brand-border bg-brand-card/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sora">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <motion.form
            onSubmit={form.handleSubmit(onSubmit)}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <motion.div variants={itemVariants}>
                  <FormItem className="grid gap-1 space-y-0">
                    <FormLabel className="text-slate-700 dark:text-slate-300 text-sm">
                      {t("email_label")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder={t("email_placeholder")}
                          {...field}
                          className="bg-brand-bg/50 border-brand-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-brand-amber/50 h-11 pl-10"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      </div>
                    </FormControl>
                    <FormMessage>
                      {fieldState.error?.message && tValidation(fieldState.error.message as any, {
                        field: t("email_label") || "Email",
                        max: 255
                      })}
                    </FormMessage>
                  </FormItem>
                </motion.div>
              )}
            />

            <motion.div variants={itemVariants} className="mt-2">
              <Button
                type="submit"
                className="w-full bg-brand-amber hover:bg-brand-amber2 text-black font-bold h-11 transition-all shadow-lg shadow-brand-amber/20"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {useTranslations("Auth.login")("processing")}
                  </>
                ) : (
                  t("send_button")
                )}
              </Button>
            </motion.div>
          </motion.form>
        </Form>
      </CardContent>
      <CardFooter>
        <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-amber transition-colors mx-auto">
          <ArrowLeft className="h-4 w-4" />
          {t("back_to_login")}
        </Link>
      </CardFooter>
    </Card>
  );
}
