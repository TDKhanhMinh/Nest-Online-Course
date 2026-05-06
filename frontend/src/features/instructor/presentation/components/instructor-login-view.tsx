"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Loader2, GraduationCap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useLogin } from "@/features/auth/presentation/hooks/use-auth-hooks";
import { loginSchema, LoginValues } from "@/features/auth/application/auth.schemas";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const InstructorLoginView = () => {
  const t = useTranslations("InstructorAuth.login");
  const authT = useTranslations("Auth.login");
  const commonT = useTranslations("Auth.signup");
  const tValidation = useTranslations("Auth.Validation");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginValues) => {
    login(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-amber/10 text-brand-amber mb-4 border border-brand-amber/20">
          <GraduationCap size={40} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-sora">
          {t("title")}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          {t("description")}
        </p>
      </motion.div>

      <Card className="w-full max-w-md border-brand-border bg-brand-card/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Accent glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-amber/10 rounded-full blur-3xl" />
        
        <CardHeader className="relative">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
            {authT("title")}
          </CardTitle>
          <CardDescription>
            {authT("description")}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative">
          <Form {...form}>
            <motion.form
              onSubmit={form.handleSubmit(onSubmit)}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <motion.div variants={itemVariants}>
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300">
                        {authT("email_label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={authT("email_placeholder")}
                          {...field}
                          className="bg-brand-bg/50 border-brand-border h-11"
                        />
                      </FormControl>
                      <FormMessage>
                        {fieldState.error?.message && tValidation(fieldState.error.message as any, { 
                          field: authT("email_label") || "Email",
                          max: 255
                        })}
                      </FormMessage>
                    </FormItem>
                  </motion.div>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <motion.div variants={itemVariants}>
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-slate-700 dark:text-slate-300">
                          {authT("password_label")}
                        </FormLabel>
                        <Link href="/auth/forgot-password" title={authT("forgot_password")} className="text-xs text-brand-amber hover:underline">
                          {authT("forgot_password")}
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="bg-brand-bg/50 border-brand-border h-11 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage>
                        {fieldState.error?.message && tValidation(fieldState.error.message as any, { 
                          field: authT("password_label") || "Password",
                          max: 100
                        })}
                      </FormMessage>
                    </FormItem>
                  </motion.div>
                )}
              />

              <motion.div variants={itemVariants} className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-brand-amber hover:bg-brand-amber2 text-black font-bold h-11 transition-all shadow-lg shadow-brand-amber/20"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {authT("processing")}
                    </>
                  ) : (
                    t("button")
                  )}
                </Button>
              </motion.div>
            </motion.form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t border-brand-border pt-6 mt-2 bg-slate-50/50 dark:bg-white/5">
          <p className="text-sm text-center text-slate-600 dark:text-slate-400">
            {t("no_account")}{" "}
            <Link href="/auth/register-instructor" className="text-brand-amber font-semibold hover:underline">
              {t("register_link")}
            </Link>
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400">
             <span className="h-px flex-1 bg-brand-border" />
             <span>{commonT("or")}</span>
             <span className="h-px flex-1 bg-brand-border" />
          </div>
          <Link href="/auth/login" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-amber transition-colors">
            {authT("title")} (Student)
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
