"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Loader2, Globe } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useRegisterInstructor } from "@/features/auth/presentation/hooks/use-auth-hooks";
import { FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa6";
import { registerInstructorSchema, RegisterInstructorValues } from "@/features/auth/application/auth.schemas";

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
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export default function RegisterInstructorPage() {
  const t = useTranslations("Auth.register_instructor");
  const commonT = useTranslations("Auth.signup");
  const tValidation = useTranslations("Auth.Validation");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: register, isPending } = useRegisterInstructor();

  const form = useForm<RegisterInstructorValues>({
    resolver: zodResolver(registerInstructorSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      headline: "",
      biography: "",
      website: "",
      twitter: "",
      linkedin: "",
      youtube: "",
    },
  });

  const onSubmit = (data: RegisterInstructorValues) => {
    register(data);
  };

  return (
    <Card className="border-brand-border bg-brand-card/50 backdrop-blur-xl shadow-2xl max-w-3xl mx-auto">
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
            className="grid gap-6 p-4"
          >
            {/* Basic Info Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field, fieldState }) => (
                  <motion.div variants={itemVariants}>
                    <FormItem className="grid gap-1 space-y-0">
                      <FormLabel className="text-slate-700 dark:text-slate-300 text-sm">
                        {commonT("name_label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={commonT("name_placeholder")}
                          {...field}
                          className="bg-brand-bg/50 border-brand-border text-slate-900 dark:text-white h-11"
                        />
                      </FormControl>
                      <FormMessage>
                        {fieldState.error?.message && tValidation(fieldState.error.message as any, { 
                          field: commonT("name_label") || "Full Name", 
                          min: 2,
                          max: 100
                        })}
                      </FormMessage>
                    </FormItem>
                  </motion.div>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <motion.div variants={itemVariants}>
                    <FormItem className="grid gap-1 space-y-0">
                      <FormLabel className="text-slate-700 dark:text-slate-300 text-sm">
                        {commonT("email_label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={commonT("email_placeholder")}
                          {...field}
                          className="bg-brand-bg/50 border-brand-border text-slate-900 dark:text-white h-11"
                        />
                      </FormControl>
                      <FormMessage>
                        {fieldState.error?.message && tValidation(fieldState.error.message as any, { 
                          field: commonT("email_label") || "Email",
                          max: 255
                        })}
                      </FormMessage>
                    </FormItem>
                  </motion.div>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <motion.div variants={itemVariants}>
                  <FormItem className="grid gap-1 space-y-0">
                    <FormLabel className="text-slate-700 dark:text-slate-300 text-sm">
                      {commonT("password_label")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={commonT("password_placeholder")}
                          {...field}
                          className="bg-brand-bg/50 border-brand-border text-slate-900 dark:text-white h-11 pr-10"
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
                        field: commonT("password_label") || "Password", 
                        min: 8,
                        max: 100
                      })}
                    </FormMessage>
                  </FormItem>
                </motion.div>
              )}
            />

            {/* Instructor Specific Info */}
            <FormField
              control={form.control}
              name="headline"
              render={({ field, fieldState }) => (
                <motion.div variants={itemVariants}>
                  <FormItem className="grid gap-1 space-y-0">
                    <FormLabel className="text-slate-700 dark:text-slate-300 text-sm">
                      {t("headline_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("headline_placeholder")}
                        {...field}
                        className="bg-brand-bg/50 border-brand-border text-slate-900 dark:text-white h-11"
                      />
                    </FormControl>
                    <FormMessage>
                      {fieldState.error?.message && tValidation(fieldState.error.message as any, { 
                        field: t("headline_label") || "Headline", 
                        min: 10,
                        max: 120 
                      })}
                    </FormMessage>
                  </FormItem>
                </motion.div>
              )}
            />

            <FormField
              control={form.control}
              name="biography"
              render={({ field, fieldState }) => (
                <motion.div variants={itemVariants}>
                  <FormItem className="grid gap-1 space-y-0">
                    <FormLabel className="text-slate-700 dark:text-slate-300 text-sm">
                      {t("biography_label")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("biography_placeholder")}
                        {...field}
                        className="bg-brand-bg/50 border-brand-border text-slate-900 dark:text-white min-h-[120px] resize-none"
                      />
                    </FormControl>
                    <FormMessage>
                      {fieldState.error?.message && tValidation(fieldState.error.message as any, { 
                        field: t("biography_label") || "Biography", 
                        min: 50,
                        max: 2000 
                      })}
                    </FormMessage>
                  </FormItem>
                </motion.div>
              )}
            />

            {/* Social Links Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="website"
                render={({ field, fieldState }) => (
                  <motion.div variants={itemVariants}>
                    <FormItem className="grid gap-1 space-y-0">
                    <FormLabel className="text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2">
                      <Globe size={14} /> {t("website_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("website_placeholder")}
                        {...field}
                        className="bg-brand-bg/50 border-brand-border text-slate-900 dark:text-white h-10"
                      />
                    </FormControl>
                    <FormMessage>
                      {fieldState.error?.message && tValidation(fieldState.error.message as any, { 
                        field: t("website_label") || "Website",
                        max: 255 
                      })}
                    </FormMessage>
                  </FormItem>
                  </motion.div>
                )}
              />
              <FormField
                control={form.control}
                name="twitter"
                render={({ field, fieldState }) => (
                  <motion.div variants={itemVariants}>
                    <FormItem className="grid gap-1 space-y-0">
                    <FormLabel className="text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2">
                      <FaTwitter size={14} /> {t("twitter_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("twitter_placeholder")}
                        {...field}
                        className="bg-brand-bg/50 border-brand-border text-slate-900 dark:text-white h-10"
                      />
                    </FormControl>
                    <FormMessage>
                      {fieldState.error?.message && tValidation(fieldState.error.message as any, { 
                        field: t("twitter_label") || "Twitter",
                        max: 255 
                      })}
                    </FormMessage>
                  </FormItem>
                  </motion.div>
                )}
              />
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field, fieldState }) => (
                  <motion.div variants={itemVariants}>
                    <FormItem className="grid gap-1 space-y-0">
                    <FormLabel className="text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2">
                      <FaLinkedin size={14} /> {t("linkedin_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("linkedin_placeholder")}
                        {...field}
                        className="bg-brand-bg/50 border-brand-border text-slate-900 dark:text-white h-10"
                      />
                    </FormControl>
                    <FormMessage>
                      {fieldState.error?.message && tValidation(fieldState.error.message as any, { 
                        field: t("linkedin_label"),
                        max: 255 
                      })}
                    </FormMessage>
                  </FormItem>
                  </motion.div>
                )}
              />
              <FormField
                control={form.control}
                name="youtube"
                render={({ field, fieldState }) => (
                  <motion.div variants={itemVariants}>
                    <FormItem className="grid gap-1 space-y-0">
                    <FormLabel className="text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2">
                      <FaYoutube size={14} /> {t("youtube_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("youtube_placeholder")}
                        {...field}
                        className="bg-brand-bg/50 border-brand-border text-slate-900 dark:text-white h-10"
                      />
                    </FormControl>
                    <FormMessage>
                      {fieldState.error?.message && tValidation(fieldState.error.message as any, { 
                        field: t("youtube_label"),
                        max: 255 
                      })}
                    </FormMessage>
                  </FormItem>
                  </motion.div>
                )}
              />
            </div>

            <motion.div variants={itemVariants} className="mt-4">
              <Button
                type="submit"
                className="w-full bg-brand-amber hover:bg-brand-amber2 text-black font-bold h-12 transition-all shadow-lg shadow-brand-amber/20"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {commonT("initializing")}
                  </>
                ) : (
                  t("register_button")
                )}
              </Button>
            </motion.div>
          </motion.form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-sm w-full text-center text-slate-600 dark:text-slate-400">
          {commonT("have_account")}{" "}
          <Link href="/auth/login" className="text-brand-amber font-semibold hover:underline">
            {commonT("login_link")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

