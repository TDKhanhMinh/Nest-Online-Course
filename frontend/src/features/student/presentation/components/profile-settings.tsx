"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { changePasswordSchema, ChangePasswordValues, profileSchema, ProfileValues } from "@/features/auth/application/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Bell, Camera, Key, Loader2, Save, Shield, Trash2, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function ProfileSettings() {
  const t = useTranslations("Profile");
  const tValidation = useTranslations("Auth.Validation");
  const [isUpdating, setIsUpdating] = useState(false);

  // Profile Form
  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "Khanh Minh",
      bio: "Learning and building modern web applications.",
    },
  });

  // Password Form
  const passwordForm = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onUpdateProfile = async (data: ProfileValues) => {
    setIsUpdating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Profile updated:", data);
    setIsUpdating(false);
  };

  const onChangePassword = async (data: ChangePasswordValues) => {
    setIsUpdating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Password changed:", data);
    setIsUpdating(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold font-sora text-slate-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {t("description")}
        </p>
      </header>

      <Tabs defaultValue="general" className="w-full space-y-6">
        <TabsList className="bg-brand-bg/50 border-brand-border p-1 h-12 inline-flex">
          <TabsTrigger value="general" className="gap-2 px-4 data-[state=active]:bg-brand-amber data-[state=active]:text-black">
            <User className="h-4 w-4" />
            {t("tabs.general")}
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 px-4 data-[state=active]:bg-brand-amber data-[state=active]:text-black">
            <Shield className="h-4 w-4" />
            {t("tabs.security")}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 px-4 data-[state=active]:bg-brand-amber data-[state=active]:text-black">
            <Bell className="h-4 w-4" />
            {t("tabs.notifications")}
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" >
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Card className="border-brand-border bg-brand-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{t("general.title")}</CardTitle>
                <CardDescription>{t("general.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Avatar Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-2 border-brand-amber">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-brand-amber/10 text-brand-amber text-2xl font-bold">KM</AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-brand-amber hover:bg-brand-amber2 text-black shadow-lg"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className="font-medium text-slate-900 dark:text-white">{t("general.avatar_label")}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">JPG, GIF or PNG. Max size of 800K</p>
                    <div className="flex gap-2 justify-center sm:justify-start">
                      <Button variant="outline" size="sm" className="border-brand-border h-9">
                        {t("general.upload_button")}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-9">
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("general.remove_button")}
                      </Button>
                    </div>
                  </div>
                </div>

                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="fullName"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>{t("general.name_label")}</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-brand-bg/50 border-brand-border h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormItem>
                        <FormLabel>{t("general.email_label")}</FormLabel>
                        <Input value="khanhminh@example.com" disabled className="bg-brand-bg/30 border-brand-border h-11 cursor-not-allowed opacity-70" />
                        <p className="text-[11px] text-slate-500 mt-1 italic">Email cannot be changed directly.</p>
                      </FormItem>
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("general.bio_label")}</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="bg-brand-bg/50 border-brand-border min-h-[120px] resize-none"
                              placeholder="Tell us a bit about yourself..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        className="bg-brand-amber hover:bg-brand-amber2 text-black font-bold h-11 px-8 shadow-lg shadow-brand-amber/20"
                        disabled={isUpdating}
                      >
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        {t("general.save_button")}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" >
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Card className="border-brand-border bg-brand-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{t("security.title")}</CardTitle>
                <CardDescription>{t("security.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="max-w-md space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("security.current_password")}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} className="bg-brand-bg/50 border-brand-border h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("security.new_password")}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} className="bg-brand-bg/50 border-brand-border h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("security.confirm_password")}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} className="bg-brand-bg/50 border-brand-border h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full bg-brand-amber hover:bg-brand-amber2 text-black font-bold h-11 transition-all"
                        disabled={isUpdating}
                      >
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Key className="h-4 w-4 mr-2" />}
                        {t("security.update_button")}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" >
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Card className="border-brand-border bg-brand-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{t("notifications.title")}</CardTitle>
                <CardDescription>{t("notifications.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { title: t("notifications.email_title"), desc: t("notifications.email_desc") },
                  { title: t("notifications.app_title"), desc: t("notifications.app_desc") },
                  { title: t("notifications.learning_title"), desc: t("notifications.learning_desc") },
                  { title: t("notifications.promo_title"), desc: t("notifications.promo_desc") },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-brand-bg/30 border border-brand-border">
                    <div className="space-y-0.5">
                      <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={idx < 2} />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="justify-end">
                <Button className="bg-brand-amber hover:bg-brand-amber2 text-black font-bold h-11 px-8">
                  {t("notifications.save_button")}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
