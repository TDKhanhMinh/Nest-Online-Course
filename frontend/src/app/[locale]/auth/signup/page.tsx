"use client";
 
 import { useState } from "react";
 import { motion } from "framer-motion";
 import { useForm } from "react-hook-form";
 import { zodResolver } from "@hookform/resolvers/zod";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
 import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
 import { FaGoogle, FaGithub } from "react-icons/fa6";
 import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
 import { Link } from "@/i18n/navigation";
 import { useTranslations } from "next-intl";
 
 import { useRegister } from "@/features/auth/presentation/hooks/use-auth-hooks";
 import { signupSchema, SignupValues } from "@/features/auth/application/auth.schemas";
 
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
 
 export default function SignupPage() {
   const t = useTranslations("Auth.signup");
   const tValidation = useTranslations("Auth.Validation");
   const [showPassword, setShowPassword] = useState(false);
 
   const { mutate: register, isPending } = useRegister();
 
   const form = useForm<SignupValues>({
     resolver: zodResolver(signupSchema),
     defaultValues: {
       fullName: "",
       email: "",
       password: "",
     },
   });
 
   const onSubmit = (data: SignupValues) => {
     register(data);
   };
 
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
       <CardContent className="grid gap-5">
         {/* Social Logins */}
         <div className="grid grid-cols-2 gap-4">
           <Button variant="outline" className="border-brand-border bg-brand-bg/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-bg hover:text-slate-900 dark:hover:text-white transition-all">
             <FaGoogle className="mr-2 h-4 w-4" />
             {t("google_signup")}
           </Button>
           <Button variant="outline" className="border-brand-border bg-brand-bg/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-bg hover:text-slate-900 dark:hover:text-white transition-all">
             <FaGithub className="mr-2 h-4 w-4" />
             {t("github_signup")}
           </Button>
         </div>
 
         <div className="relative">
           <div className="absolute inset-0 flex items-center">
             <span className="w-full border-t border-brand-border" />
           </div>
           <div className="relative flex justify-center text-xs uppercase">
             <span className="bg-brand-card px-2 text-slate-500 dark:text-slate-400">
               {t("or_signup_with")}
             </span>
           </div>
         </div>
 
         {/* Signup Form */}
         <Form {...form}>
           <motion.form
             onSubmit={form.handleSubmit(onSubmit)}
             variants={containerVariants}
             initial="hidden"
             animate="visible"
             className="grid gap-4 p-4"
           >
             <FormField
               control={form.control}
               name="fullName"
               render={({ field, fieldState }) => (
                 <motion.div variants={itemVariants}>
                   <FormItem className="grid gap-1 space-y-0">
                     <FormLabel className="text-slate-700 dark:text-slate-300 text-sm">
                       {t("name_label")}
                     </FormLabel>
                     <FormControl>
                       <Input
                         placeholder={t("name_placeholder")}
                         {...field}
                         className="bg-brand-bg/50 border-brand-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-brand-amber/50 h-11"
                       />
                     </FormControl>
                     <FormMessage>
                       {fieldState.error?.message && tValidation(fieldState.error.message as any, { 
                         field: t("name_label") || "Full Name", 
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
                       {t("email_label")}
                     </FormLabel>
                     <FormControl>
                       <Input
                         type="email"
                         placeholder={t("email_placeholder")}
                         {...field}
                         className="bg-brand-bg/50 border-brand-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-brand-amber/50 h-11"
                       />
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
 
             <FormField
               control={form.control}
               name="password"
               render={({ field, fieldState }) => (
                 <motion.div variants={itemVariants}>
                   <FormItem className="grid gap-1 space-y-0">
                     <FormLabel className="text-slate-700 dark:text-slate-300 text-sm">
                       {t("password_label")}
                     </FormLabel>
                     <FormControl>
                       <div className="relative">
                         <Input
                           type={showPassword ? "text" : "password"}
                           placeholder={t("password_placeholder")}
                           {...field}
                           className="bg-brand-bg/50 border-brand-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-brand-amber/50 h-11 pr-10"
                         />
                         <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                         >
                           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                         </button>
                       </div>
                     </FormControl>
                     <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                       <CheckCircle2 size={10} className="text-emerald-500" /> {t("password_hint")}
                     </p>
                     <FormMessage>
                       {fieldState.error?.message && tValidation(fieldState.error.message as any, { 
                         field: t("password_label") || "Password", 
                         min: 8,
                         max: 100
                       })}
                     </FormMessage>
                   </FormItem>
                 </motion.div>
               )}
             />
 
             <motion.div variants={itemVariants} className="mt-2">
               <Button
                 type="submit"
                 className="w-full bg-brand-amber hover:bg-brand-amber2 text-black font-bold h-11 transition-all"
                 disabled={isPending}
               >
                 {isPending ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     {t("initializing")}
                   </>
                 ) : (
                   t("signup_button")
                 )}
               </Button>
             </motion.div>
           </motion.form>
         </Form>
       </CardContent>
       <CardFooter className="flex flex-col gap-4">
         <p className="text-sm w-full text-center text-slate-600 dark:text-slate-400">
           {t("have_account")}{" "}
           <Link href="/auth/login" className="text-brand-amber font-semibold hover:underline">
             {t("login_link")}
           </Link>
         </p>
         <div className="relative w-full">
           <div className="absolute inset-0 flex items-center">
             <span className="w-full border-t border-brand-border" />
           </div>
           <div className="relative flex justify-center text-[10px] uppercase">
             <span className="bg-brand-card px-2 text-slate-500">{t("or")}</span>
           </div>
         </div>
         <Link
           href="/auth/register-instructor"
           className="text-sm text-slate-500 hover:text-brand-amber transition-colors text-center w-full"
         >
           {t("become_instructor")}
         </Link>
       </CardFooter>
     </Card>
   );
 }

