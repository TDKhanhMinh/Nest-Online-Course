"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
   Bell,
   Camera,
   CreditCard,
   Globe,
   Plus,
   Save,
   Shield,
   User
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa6";

const containerVariants = {
   hidden: { opacity: 0, y: 20 },
   visible: {
      opacity: 1,
      y: 0,
      transition: {
         duration: 0.4,
         staggerChildren: 0.1,
      },
   },
};

const itemVariants = {
   hidden: { opacity: 0, x: -10 },
   visible: { opacity: 1, x: 0 },
};

export const InstructorSettingsView = () => {
   const t = useTranslations("InstructorSettings");
   const profileT = useTranslations("Profile");
   const [activeTab, setActiveTab] = useState("profile");

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
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {/* Profile Preview / Photo */}
                     <Card className="border-brand-border bg-brand-card/50 h-fit sticky top-24">
                        <CardHeader className="text-center">
                           <div className="relative inline-block mx-auto">
                              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-brand-amber to-brand-amber2 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                                 <span className="text-4xl font-bold text-black">I</span>
                              </div>
                              <Button size="icon" className="absolute -bottom-2 -right-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 border-2 border-white dark:border-slate-800 h-10 w-10">
                                 <Camera size={16} />
                              </Button>
                           </div>
                           <CardTitle className="mt-4">Instructor Name</CardTitle>
                           <CardDescription>Senior Software Engineer</CardDescription>
                           <div className="flex flex-wrap justify-center gap-2 mt-4">
                              <Badge variant="outline" className="bg-brand-amber/10 border-brand-amber/20 text-brand-amber">Expert</Badge>
                              <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-500">5 Courses</Badge>
                           </div>
                        </CardHeader>
                        <CardFooter className="flex flex-col gap-2">
                           <Button variant="outline" className="w-full border-brand-border h-11">
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
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label htmlFor="fullName">{profileT("general.name_label")}</Label>
                                    <Input id="fullName" placeholder="John Doe" className="bg-brand-bg/50 border-brand-border h-11" />
                                 </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="headline">{t("profile.headline")}</Label>
                                    <Input id="headline" placeholder="e.g. Senior Software Engineer" className="bg-brand-bg/50 border-brand-border h-11" />
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="biography">{t("profile.biography")}</Label>
                                 <Textarea id="biography" placeholder="Tell us about yourself..." className="bg-brand-bg/50 border-brand-border min-h-[150px] resize-none" />
                              </div>

                              <div className="space-y-2">
                                 <Label>{t("profile.expertise")}</Label>
                                 <div className="flex flex-wrap gap-2 p-3 bg-brand-bg/30 rounded-xl border border-brand-border">
                                    {["React", "Next.js", "Node.js", "AWS"].map(skill => (
                                       <Badge key={skill} className="bg-slate-900 text-white dark:bg-white dark:text-black py-1.5 px-3">
                                          {skill}
                                          <button className="ml-2 hover:text-brand-amber transition-colors">×</button>
                                       </Badge>
                                    ))}
                                    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-brand-amber border border-dashed border-brand-amber/30 rounded-full">
                                       <Plus size={12} className="mr-1" /> ADD SKILL
                                    </Button>
                                 </div>
                              </div>
                           </CardContent>
                        </Card>

                        <Card className="border-brand-border bg-brand-card/50">
                           <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                 <Globe size={20} className="text-brand-amber" />
                                 Social Links
                              </CardTitle>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><FaLinkedin /> LinkedIn</Label>
                                    <Input placeholder="https://linkedin.com/in/..." className="bg-brand-bg/50 border-brand-border h-10" />
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><FaTwitter /> Twitter</Label>
                                    <Input placeholder="https://twitter.com/..." className="bg-brand-bg/50 border-brand-border h-10" />
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><FaYoutube /> YouTube</Label>
                                    <Input placeholder="https://youtube.com/c/..." className="bg-brand-bg/50 border-brand-border h-10" />
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><FaGithub /> GitHub</Label>
                                    <Input placeholder="https://github.com/..." className="bg-brand-bg/50 border-brand-border h-10" />
                                 </div>
                              </div>
                           </CardContent>
                           <CardFooter className="border-t border-brand-border pt-6 bg-slate-50/50 dark:bg-white/5 flex justify-end">
                              <Button className="bg-brand-amber hover:bg-brand-amber2 text-black font-bold h-11 px-8 shadow-lg shadow-brand-amber/20">
                                 <Save className="mr-2 h-4 w-4" />
                                 {t("profile.save")}
                              </Button>
                           </CardFooter>
                        </Card>
                     </div>
                  </div>
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
