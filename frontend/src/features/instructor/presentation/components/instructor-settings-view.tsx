"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
   Bell,
   Camera,
   CreditCard,
   Globe,
   Loader2,
   Plus,
   Save,
   Shield,
   User
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa6";
import * as z from "zod";
import { useInstructorProfile, useUpdateInstructorProfile } from "../hooks/use-instructor-profile";

const profileSchema = z.object({
   headline: z.string().min(2, "Headline must be at least 2 characters"),
   biography: z.string().min(10, "Biography must be at least 10 characters"),
   website: z.string().url().optional().or(z.literal("")),
   linkedin: z.string().url().optional().or(z.literal("")),
   twitter: z.string().url().optional().or(z.literal("")),
   youtube: z.string().url().optional().or(z.literal("")),
   expertise: z.array(z.string()).default([]),
});

type ProfileFormInput = z.input<typeof profileSchema>;
type ProfileFormValues = z.output<typeof profileSchema>;

export const InstructorSettingsView = () => {
   const t = useTranslations("InstructorSettings");
   const profileT = useTranslations("Profile");
   const [activeTab, setActiveTab] = useState("profile");
   const [newSkill, setNewSkill] = useState("");

   const { data: profile, isLoading } = useInstructorProfile();
   const { mutate: updateProfile, isPending: isUpdating } = useUpdateInstructorProfile();

   const form = useForm<ProfileFormInput, any, ProfileFormValues>({
      resolver: zodResolver(profileSchema),
      defaultValues: {
         headline: "",
         biography: "",
         website: "",
         linkedin: "",
         twitter: "",
         youtube: "",
         expertise: [],
      },
   });

   useEffect(() => {
      if (profile) {
         form.reset({
            headline: profile.headline || "",
            biography: profile.biography || "",
            website: profile.website || "",
            linkedin: profile.linkedin || "",
            twitter: profile.twitter || "",
            youtube: profile.youtube || "",
            expertise: profile.expertise || [],
         });
      }
   }, [profile, form]);

   const handleAddSkill = () => {
      if (!newSkill.trim()) return;
      const currentSkills = form.getValues("expertise") || [];
      if (!currentSkills.includes(newSkill.trim())) {
         form.setValue("expertise", [...currentSkills, newSkill.trim()], { shouldDirty: true });
      }
      setNewSkill("");
   };

   const handleRemoveSkill = (skillToRemove: string) => {
      const currentSkills = form.getValues("expertise") || [];
      form.setValue("expertise", currentSkills.filter(s => s !== skillToRemove), { shouldDirty: true });
   };

   const onSubmit = (values: ProfileFormValues) => {
      updateProfile(values);
   };

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-brand-amber" />
         </div>
      );
   }

   return (
      <div className="max-w-6xl mx-auto space-y-8">
         <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-sora">
               {t("title")}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
               {profileT("description")}
            </p>
         </div>

         <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-brand-card/50 border border-brand-border p-1 h-auto flex-wrap sm:flex-nowrap overflow-x-auto justify-start">
               <TabsTrigger value="profile" className="flex items-center gap-2 px-6 py-2.5 data-[state=active]:bg-brand-amber data-[state=active]:text-black rounded-lg transition-all">
                  <User size={16} />
                  {t("tabs.profile")}
               </TabsTrigger>
               <TabsTrigger value="account" className="flex items-center gap-2 px-6 py-2.5 data-[state=active]:bg-brand-amber data-[state=active]:text-black rounded-lg transition-all">
                  <Shield size={16} />
                  {t("tabs.account")}
               </TabsTrigger>
               <TabsTrigger value="payout" className="flex items-center gap-2 px-6 py-2.5 data-[state=active]:bg-brand-amber data-[state=active]:text-black rounded-lg transition-all">
                  <CreditCard size={16} />
                  {t("tabs.payout")}
               </TabsTrigger>
               <TabsTrigger value="notifications" className="flex items-center gap-2 px-6 py-2.5 data-[state=active]:bg-brand-amber data-[state=active]:text-black rounded-lg transition-all">
                  <Bell size={16} />
                  {t("tabs.notifications")}
               </TabsTrigger>
            </TabsList>

            <motion.div
               key={activeTab}
               initial={{ opacity: 0, x: 10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.3 }}
            >
               {/* Profile Tab */}
               <TabsContent value="profile" className="space-y-6 mt-0">
                  <Form {...form}>
                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                           {/* Profile Preview / Photo */}
                           <Card className="border-brand-border bg-brand-card/50 h-fit sticky top-24">
                              <CardHeader className="text-center">
                                 <div className="relative inline-block mx-auto">
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-brand-amber to-brand-amber2 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                                       <span className="text-4xl font-bold text-black">
                                          {profile?.headline?.charAt(0) || "I"}
                                       </span>
                                    </div>
                                    <Button type="button" size="icon" className="absolute -bottom-2 -right-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 border-2 border-white dark:border-slate-800 h-10 w-10">
                                       <Camera size={16} />
                                    </Button>
                                 </div>
                                 <CardTitle className="mt-4">{profile?.headline || "Instructor"}</CardTitle>
                                 <CardDescription>{profile?.totalStudents || 0} Students</CardDescription>
                                 <div className="flex flex-wrap justify-center gap-2 mt-4">
                                    <Badge variant="outline" className="bg-brand-amber/10 border-brand-amber/20 text-brand-amber">Expert</Badge>
                                 </div>
                              </CardHeader>
                              <CardFooter className="flex flex-col gap-2">
                                 <Button type="button" variant="outline" className="w-full border-brand-border h-11">
                                    {profileT("general.upload_button")}
                                 </Button>
                                 <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest mt-2">Max Size: 2MB</p>
                              </CardFooter>
                           </Card>

                           {/* Profile Form */}
                           <div className="lg:col-span-2 space-y-6">
                              <Card className="border-brand-border bg-brand-card/50">
                                 <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                       <User size={20} className="text-brand-amber" />
                                       {profileT("general.title")}
                                    </CardTitle>
                                    <CardDescription>{profileT("general.description")}</CardDescription>
                                 </CardHeader>
                                 <CardContent className="space-y-6">
                                    <FormField
                                       control={form.control}
                                       name="headline"
                                       render={({ field }) => (
                                          <FormItem>
                                             <FormLabel>{t("profile.headline")}</FormLabel>
                                             <FormControl>
                                                <Input placeholder="e.g. Senior Software Engineer" className="bg-brand-bg/50 border-brand-border h-11" {...field} />
                                             </FormControl>
                                             <FormMessage />
                                          </FormItem>
                                       )}
                                    />

                                    <FormField
                                       control={form.control}
                                       name="biography"
                                       render={({ field }) => (
                                          <FormItem>
                                             <FormLabel>{t("profile.biography")}</FormLabel>
                                             <FormControl>
                                                <Textarea placeholder="Tell us about yourself..." className="bg-brand-bg/50 border-brand-border min-h-[150px] resize-none" {...field} />
                                             </FormControl>
                                             <FormMessage />
                                          </FormItem>
                                       )}
                                    />

                                    <div className="space-y-2">
                                       <Label>{t("profile.expertise")}</Label>
                                       <div className="flex flex-wrap gap-2 p-3 bg-brand-bg/30 rounded-xl border border-brand-border">
                                          {form.watch("expertise")?.map(skill => (
                                             <Badge key={skill} className="bg-slate-900 text-white dark:bg-white dark:text-black py-2 px-4 flex items-center gap-2 text-sm">
                                                {skill}
                                                <button
                                                   type="button"
                                                   onClick={() => handleRemoveSkill(skill)}
                                                   className="hover:text-brand-amber transition-colors p-1 -mr-2"
                                                   aria-label={`Remove ${skill}`}
                                                >
                                                   <Plus size={16} className="rotate-45" />
                                                </button>
                                             </Badge>
                                          ))}
                                          <div className="flex items-center gap-2">
                                             <Input
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyDown={(e) => {
                                                   if (e.key === 'Enter') {
                                                      e.preventDefault();
                                                      handleAddSkill();
                                                   }
                                                }}
                                                placeholder="Add skill..."
                                                className="h-11 w-40 bg-transparent border-dashed border-brand-amber/30 text-sm focus-visible:ring-brand-amber"
                                             />
                                             <Button
                                                type="button"
                                                onClick={handleAddSkill}
                                                variant="ghost"
                                                className="h-11 w-11 p-0 font-bold text-brand-amber hover:bg-brand-amber/10 rounded-xl"
                                             >
                                                <Plus size={20} />
                                             </Button>
                                          </div>
                                       </div>
                                    </div>
                                 </CardContent>
                              </Card>

                              <Card className="border-brand-border bg-brand-card/50">
                                 <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                       <Globe size={20} className="text-brand-amber" />
                                       {t("profile.social_links")}
                                    </CardTitle>
                                 </CardHeader>
                                 <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       <FormField
                                          control={form.control}
                                          name="website"
                                          render={({ field }) => (
                                             <FormItem>
                                                <FormLabel className="flex items-center gap-2"><Globe size={16} /> {t("profile.website")}</FormLabel>
                                                <FormControl>
                                                   <Input placeholder="https://yourwebsite.com" className="bg-brand-bg/50 border-brand-border h-10" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                             </FormItem>
                                          )}
                                       />
                                       <FormField
                                          control={form.control}
                                          name="linkedin"
                                          render={({ field }) => (
                                             <FormItem>
                                                <FormLabel className="flex items-center gap-2"><FaLinkedin /> {t("profile.linkedin")}</FormLabel>
                                                <FormControl>
                                                   <Input placeholder="https://linkedin.com/in/..." className="bg-brand-bg/50 border-brand-border h-10" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                             </FormItem>
                                          )}
                                       />
                                       <FormField
                                          control={form.control}
                                          name="twitter"
                                          render={({ field }) => (
                                             <FormItem>
                                                <FormLabel className="flex items-center gap-2"><FaTwitter /> {t("profile.twitter")}</FormLabel>
                                                <FormControl>
                                                   <Input placeholder="https://twitter.com/..." className="bg-brand-bg/50 border-brand-border h-10" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                             </FormItem>
                                          )}
                                       />
                                       <FormField
                                          control={form.control}
                                          name="youtube"
                                          render={({ field }) => (
                                             <FormItem>
                                                <FormLabel className="flex items-center gap-2"><FaYoutube /> {t("profile.youtube")}</FormLabel>
                                                <FormControl>
                                                   <Input placeholder="https://youtube.com/c/..." className="bg-brand-bg/50 border-brand-border h-10" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                             </FormItem>
                                          )}
                                       />
                                    </div>
                                 </CardContent>
                                 <CardFooter className="border-t border-brand-border pt-6 bg-slate-50/50 dark:bg-white/5 flex justify-end">
                                    <Button type="submit" disabled={isUpdating} className="bg-brand-amber hover:bg-brand-amber2 text-black font-bold h-11 px-8 shadow-lg shadow-brand-amber/20">
                                       {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                       {t("profile.save")}
                                    </Button>
                                 </CardFooter>
                              </Card>
                           </div>
                        </div>
                     </form>
                  </Form>
               </TabsContent>

               {/* Account Tab */}
               <TabsContent value="account" className="max-w-2xl mt-0">
                  <Card className="border-brand-border bg-brand-card/50">
                     <CardHeader>
                        <CardTitle>{profileT("security.title")}</CardTitle>
                        <CardDescription>{profileT("security.description")}</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <Label htmlFor="currentPass">{profileT("security.current_password")}</Label>
                           <Input id="currentPass" type="password" className="bg-brand-bg/50 border-brand-border h-11" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label htmlFor="newPass">{profileT("security.new_password")}</Label>
                              <Input id="newPass" type="password" className="bg-brand-bg/50 border-brand-border h-11" />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="confirmPass">{profileT("security.confirm_password")}</Label>
                              <Input id="confirmPass" type="password" className="bg-brand-bg/50 border-brand-border h-11" />
                           </div>
                        </div>
                     </CardContent>
                     <CardFooter className="justify-end">
                        <Button className="bg-brand-amber hover:bg-brand-amber2 text-black font-bold h-11 px-8">
                           {profileT("security.update_button")}
                        </Button>
                     </CardFooter>
                  </Card>
               </TabsContent>

               {/* Payout Tab */}
               <TabsContent value="payout" className="max-w-3xl mt-0 space-y-6">
                  <Card className="border-brand-border bg-brand-card/50 overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-6 opacity-10">
                        <CreditCard size={120} />
                     </div>
                     <CardHeader>
                        <CardTitle>{t("payout.title")}</CardTitle>
                        <CardDescription>{t("payout.description")}</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="p-4 rounded-xl border-2 border-brand-amber bg-brand-amber/5 relative">
                              <div className="flex items-center justify-between mb-2">
                                 <h4 className="font-bold flex items-center gap-2"><CreditCard size={18} /> {t("payout.bank_transfer")}</h4>
                                 <Badge className="bg-brand-amber text-black text-[10px]">Active</Badge>
                              </div>
                              <p className="text-xs text-slate-500">**** **** **** 1234</p>
                              <p className="text-xs text-slate-500">Vietcombank</p>
                              <Button variant="ghost" size="sm" className="absolute bottom-2 right-2 text-brand-amber hover:bg-brand-amber/10 h-7 text-[10px]">Edit</Button>
                           </div>
                           <div className="p-4 rounded-xl border border-brand-border hover:border-brand-amber transition-colors group cursor-pointer flex flex-col justify-center items-center gap-2 h-full min-h-[100px]">
                              <Plus className="text-slate-400 group-hover:text-brand-amber transition-colors" />
                              <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white">{t("payout.setup")}</span>
                           </div>
                        </div>

                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-4">
                           <div className="mt-1 p-2 bg-blue-500/10 rounded-lg text-blue-600">
                              <Shield size={20} />
                           </div>
                           <div>
                              <h5 className="text-sm font-bold text-blue-700">Security Note</h5>
                              <p className="text-xs text-blue-600/80 mt-1 leading-relaxed">
                                 For your protection, payout method changes require email verification and have a 48-hour holding period before they take effect.
                              </p>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>

               {/* Notifications Tab */}
               <TabsContent value="notifications" className="max-w-2xl mt-0">
                  <Card className="border-brand-border bg-brand-card/50">
                     <CardHeader>
                        <CardTitle>{profileT("notifications.title")}</CardTitle>
                        <CardDescription>{profileT("notifications.description")}</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-6">
                        <div className="space-y-4">
                           <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Teaching Alerts</h4>
                           <div className="flex items-center justify-between p-4 bg-brand-bg/30 rounded-xl border border-brand-border">
                              <div className="space-y-0.5">
                                 <Label className="text-base">New Enrollments</Label>
                                 <p className="text-xs text-slate-500">Get notified when a new student joins your course.</p>
                              </div>
                              <Switch defaultChecked />
                           </div>
                           <div className="flex items-center justify-between p-4 bg-brand-bg/30 rounded-xl border border-brand-border">
                              <div className="space-y-0.5">
                                 <Label className="text-base">Q&A Updates</Label>
                                 <p className="text-xs text-slate-500">Get notified when a student asks a question.</p>
                              </div>
                              <Switch defaultChecked />
                           </div>
                           <div className="flex items-center justify-between p-4 bg-brand-bg/30 rounded-xl border border-brand-border">
                              <div className="space-y-0.5">
                                 <Label className="text-base">Course Reviews</Label>
                                 <p className="text-xs text-slate-500">Stay updated with student feedback and ratings.</p>
                              </div>
                              <Switch defaultChecked />
                           </div>
                        </div>
                     </CardContent>
                     <CardFooter className="justify-end border-t border-brand-border pt-6 mt-6">
                        <Button className="bg-brand-amber hover:bg-brand-amber2 text-black font-bold h-11 px-8">
                           {profileT("notifications.save_button")}
                        </Button>
                     </CardFooter>
                  </Card>
               </TabsContent>
            </motion.div>
         </Tabs>
      </div>
   );
};
