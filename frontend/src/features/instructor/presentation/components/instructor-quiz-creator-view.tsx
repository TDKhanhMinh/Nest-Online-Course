"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import {
  Settings,
  ListChecks,
  Eye,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Search,
  CheckCircle2,
  Clock,
  Trophy,
  RotateCcw,
  Layout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface SelectedQuestion {
  id: string;
  text: string;
  type: string;
  points: number;
}

const InstructorQuizCreatorView = () => {
  const t = useTranslations("QuizCreator");
  const [activeTab, setActiveTab] = useState("settings");

  const [selectedQuestions, setSelectedQuestions] = useState<SelectedQuestion[]>([
    { id: "q1", text: "What is React?", type: "mcq", points: 1 },
    { id: "q2", text: "Explain useEffect hook.", type: "essay", points: 5 },
  ]);

  const removeQuestion = (id: string) => {
    setSelectedQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updatePoints = (id: string, points: number) => {
    setSelectedQuestions(prev => prev.map(q => q.id === id ? { ...q, points } : q));
  };

  const totalPoints = selectedQuestions.reduce((acc, q) => acc + q.points, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t("settings_desc")}</p>
        </motion.div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Eye className="h-4 w-4 mr-2" />
            {t("preview")}
          </Button>
          <Button className="flex-1 sm:flex-none bg-brand-amber hover:bg-brand-amber2 text-black font-semibold">
            <Save className="h-4 w-4 mr-2" />
            {t("save_quiz")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="flex w-fit sm:w-full lg:w-[450px] bg-brand-card/50 border border-brand-border">
            <TabsTrigger value="settings" className="flex-1 flex items-center gap-2 whitespace-nowrap px-4 py-2">
              <Settings className="h-4 w-4" />
              <span>{t("settings")}</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex-1 flex items-center gap-2 whitespace-nowrap px-4 py-2">
              <ListChecks className="h-4 w-4" />
              <span>{t("select_questions")}</span>
            </TabsTrigger>
            <TabsTrigger value="review" className="flex-1 flex items-center gap-2 whitespace-nowrap px-4 py-2">
              <Layout className="h-4 w-4" />
              <span>{t("review")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="settings" className="outline-none">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-brand-border bg-brand-card/50">
              <CardHeader>
                <CardTitle className="text-xl">{t("settings")}</CardTitle>
                <CardDescription>{t("settings_desc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="text-sm font-medium">{t("title_label")}</Label>
                    <Input id="title" placeholder={t("title_placeholder")} className="bg-brand-bg/50 border-brand-border" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category" className="text-sm font-medium">{t("category_label")}</Label>
                    <Input id="category" placeholder={t("category_placeholder")} className="bg-brand-bg/50 border-brand-border" />
                  </div>
                </div>

                <Separator className="bg-brand-border" />

                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-brand-amber">
                      <Clock className="h-4 w-4" />
                      <Label className="font-semibold">{t("time_limit")}</Label>
                    </div>
                    <Input type="number" defaultValue="30" className="bg-brand-bg/50 border-brand-border" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-brand-amber">
                      <Trophy className="h-4 w-4" />
                      <Label className="font-semibold">{t("passing_score")}</Label>
                    </div>
                    <Input type="number" defaultValue="70" className="bg-brand-bg/50 border-brand-border" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-brand-amber">
                      <RotateCcw className="h-4 w-4" />
                      <Label className="font-semibold">{t("max_attempts")}</Label>
                    </div>
                    <Input type="number" defaultValue="1" className="bg-brand-bg/50 border-brand-border" />
                  </div>
                </div>

                <Separator className="bg-brand-border" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">{t("randomize")}</Label>
                      <p className="text-sm text-muted-foreground">{t("randomize_desc")}</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">{t("show_answers")}</Label>
                      <p className="text-sm text-muted-foreground">{t("show_answers_desc")}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="questions" className="outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-brand-border bg-brand-card/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{t("select_questions")}</CardTitle>
                  <CardDescription>{t("selected_count", { count: selectedQuestions.length })}</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="border-brand-border hover:bg-brand-amber hover:text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("add_new")}
                </Button>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <Reorder.Group
                  axis="y"
                  values={selectedQuestions}
                  onReorder={setSelectedQuestions}
                  className="space-y-4"
                >
                  <AnimatePresence mode="popLayout">
                    {selectedQuestions.map((q, index) => (
                      <Reorder.Item
                        key={q.id}
                        value={q}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-brand-border bg-brand-bg/50 group"
                      >
                        <div className="mt-1 cursor-grab active:cursor-grabbing">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] uppercase border-brand-border text-brand-amber">{q.type}</Badge>
                            <span className="text-xs sm:text-sm font-medium">Question {index + 1}</span>
                          </div>
                          <p className="text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">{q.text}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4">
                          <div className="text-right">
                            <Label className="text-[10px] text-muted-foreground uppercase">Points</Label>
                            <Input
                              type="number"
                              className="h-8 w-14 sm:w-16 text-center bg-brand-bg border-brand-border"
                              value={q.points}
                              onChange={(e) => updatePoints(q.id, parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => removeQuestion(q.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Reorder.Item>
                    ))}
                  </AnimatePresence>
                </Reorder.Group>

                {selectedQuestions.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 border-2 border-dashed border-brand-border rounded-xl"
                  >
                    <p className="text-muted-foreground">No questions selected yet.</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <Card className="h-fit border-brand-border bg-brand-card/50">
              <CardHeader>
                <CardTitle className="text-lg">{t("from_bank")}</CardTitle>
                <CardDescription>{t("bank_desc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder={t("search_bank")} className="pl-8 h-9 text-sm bg-brand-bg/50 border-brand-border" />
                </div>
                <div className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-3 rounded-md border border-brand-border text-xs flex items-center gap-3 hover:bg-brand-amber/5 transition-colors cursor-pointer group">
                      <Checkbox id={`q-bank-${i}`} className="border-brand-border data-[state=checked]:bg-brand-amber data-[state=checked]:text-black" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-clamp-1 group-hover:text-brand-amber transition-colors">Bank Question #{i}</p>
                        <p className="text-muted-foreground mt-0.5 uppercase text-[9px]">MCQ • 2 points</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-brand-amber hover:bg-brand-amber2 text-black font-semibold" size="sm">
                  {t("add_selected")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="review" className="outline-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-brand-border bg-brand-card/50">
              <CardHeader>
                <CardTitle className="text-xl">{t("overview")}</CardTitle>
                <CardDescription>{t("overview_desc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-brand-amber/10 border border-brand-amber/20 space-y-1">
                    <p className="text-2xl font-bold text-brand-amber">{selectedQuestions.length}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Questions</p>
                  </div>
                  <div className="p-4 rounded-xl bg-brand-amber/10 border border-brand-amber/20 space-y-1">
                    <p className="text-2xl font-bold text-brand-amber">{totalPoints}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Points</p>
                  </div>
                  <div className="p-4 rounded-xl bg-brand-amber/10 border border-brand-amber/20 space-y-1">
                    <p className="text-2xl font-bold text-brand-amber">30</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Minutes</p>
                  </div>
                  <div className="p-4 rounded-xl bg-brand-amber/10 border border-brand-amber/20 space-y-1">
                    <p className="text-2xl font-bold text-brand-amber">70%</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Pass Score</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {t("validation_summary")}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      </div>
                      All questions have point values assigned.
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      </div>
                      Passing score is within valid range.
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      </div>
                      Quiz title is provided.
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl bg-brand-amber/5 border border-brand-amber/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="font-bold">Ready to publish?</p>
                    <p className="text-sm text-muted-foreground">Once saved, this quiz will be available in your course curriculum.</p>
                  </div>
                  <Button size="lg" className="w-full sm:w-auto bg-brand-amber hover:bg-brand-amber2 text-black font-bold px-12">
                    {t("save_quiz")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstructorQuizCreatorView;
          </motion.div >
        </TabsContent >
      </Tabs >
    </div >
  );
};

export default InstructorQuizCreatorView;
