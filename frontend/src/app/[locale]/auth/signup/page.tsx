"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";

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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <Card className="border-brand-border bg-brand-card/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sora">Tạo tài khoản</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Tham gia cùng 50,000+ học viên trên toàn quốc
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="border-brand-border bg-brand-bg/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-bg hover:text-slate-900 dark:hover:text-white transition-all">
            <FaGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button variant="outline" className="border-brand-border bg-brand-bg/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-bg hover:text-slate-900 dark:hover:text-white transition-all">
            <FaGithub className="mr-2 h-4 w-4" />
            Github
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-brand-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-brand-card px-2 text-slate-500 dark:text-slate-400">Hoặc đăng ký bằng email</span>
          </div>
        </div>

        {/* Signup Form */}
        <motion.form 
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4"
        >
          <motion.div variants={itemVariants} className="grid gap-2">
            <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 text-sm">Họ và tên</Label>
            <Input
              id="name"
              placeholder="Nguyễn Văn A"
              className="bg-brand-bg/50 border-brand-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-brand-amber/50 h-11"
              required
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="grid gap-2">
            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="bg-brand-bg/50 border-brand-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-brand-amber/50 h-11"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-2">
            <Label htmlFor="password" title="password" className="text-slate-700 dark:text-slate-300 text-sm">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-brand-bg/50 border-brand-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-brand-amber/50 h-11 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <CheckCircle2 size={10} className="text-emerald-500" /> Ít nhất 8 ký tự, bao gồm chữ và số
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-2">
            <Button 
              type="submit" 
              className="w-full bg-brand-amber hover:bg-brand-amber2 text-black font-bold h-11 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang khởi tạo...
                </>
              ) : (
                "Đăng ký tài khoản"
              )}
            </Button>
          </motion.div>
        </motion.form>
      </CardContent>
      <CardFooter>
        <p className="text-sm w-full text-center text-slate-600 dark:text-slate-400">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="text-brand-amber font-semibold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
