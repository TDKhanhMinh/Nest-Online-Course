"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { 
  UploadCloud, 
  FileText, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileArchive,
  ImageIcon,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MOCK_ASSIGNMENT = {
  title: "Build a React To-Do Application",
  description: "Create a fully functional To-Do application using React hooks (useState, useEffect) and Context API. Your application should allow users to add, edit, delete, and mark tasks as complete. Data should persist in localStorage.",
  dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
  points: 100,
  acceptedTypes: [".pdf", ".zip", ".rar", ".github link"],
  status: "pending" // pending, submitted, graded
};

export function AssignmentSubmission() {
  const t = useTranslations("Assignment");
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(MOCK_ASSIGNMENT.status);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return <ImageIcon className="h-5 w-5 text-blue-500" />;
    if (type.includes("zip") || type.includes("rar") || type.includes("tar")) return <FileArchive className="h-5 w-5 text-amber-500" />;
    return <FileText className="h-5 w-5 text-slate-500" />;
  };

  const handleSubmit = () => {
    if (files.length === 0 && comments.trim() === "") return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus("submitted");
    }, 1500);
  };

  const handleUnsubmit = () => {
    setStatus("pending");
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 w-full flex flex-col lg:flex-row gap-6">
      {/* Left Column: Assignment Details */}
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {MOCK_ASSIGNMENT.title}
          </h2>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="outline" className="border-brand-border bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium py-1">
              {t("points", { points: MOCK_ASSIGNMENT.points })}
            </Badge>
            <div className="flex items-center gap-1.5 text-sm font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full">
              <Clock className="h-4 w-4" />
              <span>{t("due", { date: format(new Date(MOCK_ASSIGNMENT.dueDate), "MMM dd, yyyy 'at' HH:mm") })}</span>
            </div>
          </div>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {MOCK_ASSIGNMENT.description}
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-brand-border">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">{t("requirements_title")}</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>{t("requirement_1")}</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>{t("requirement_2")}</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>{t("requirement_3")}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Column: Submission Area */}
      <div className="lg:w-[400px] shrink-0">
        <Card className="p-5 sm:p-6 border-brand-border bg-white dark:bg-brand-card shadow-sm rounded-2xl sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
              {t("your_work")}
            </h3>
            {status === "submitted" ? (
              <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 border-transparent">
                {t("status_submitted")}
              </Badge>
            ) : status === "graded" ? (
              <Badge className="bg-indigo-500 text-white hover:bg-indigo-600 border-transparent">
                {t("status_graded")}
              </Badge>
            ) : (
              <Badge variant="outline" className="border-slate-300 dark:border-slate-700 text-slate-500">
                {t("status_pending")}
              </Badge>
            )}
          </div>

          <AnimatePresence mode="wait">
            {status === "pending" ? (
              <motion.div
                key="pending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* File Upload Area */}
                <div 
                  className={`
                    relative border-2 border-dashed rounded-xl p-6 text-center transition-colors
                    ${isDragging 
                      ? 'border-brand-amber bg-brand-amber/5' 
                      : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                    }
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    multiple 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileInput}
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-1">
                      <UploadCloud className="h-5 w-5 text-slate-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("drag_drop")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t("supported_files")}: ZIP, PDF, RAR (Max 50MB)
                    </p>
                  </div>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-brand-border">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {getFileIcon(file.type)}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-rose-500 shrink-0"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comments / Link Input */}
                <div className="pt-2">
                  <Textarea 
                    placeholder={t("comments_placeholder")}
                    className="min-h-[100px] text-sm bg-white dark:bg-black/20 border-brand-border resize-none"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full bg-brand-amber text-black hover:bg-brand-amber/90 font-semibold h-11"
                  disabled={files.length === 0 && comments.trim() === "" || isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? t("submitting") : t("submit_button")}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="submitted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {files.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">{t("submitted_files")}</h4>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-brand-border">
                          {getFileIcon(file.type)}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                              {file.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {comments && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">{t("comments_links")}</h4>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-brand-border text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {comments}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-brand-border">
                  <Button 
                    variant="outline"
                    className="w-full text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 h-11"
                    onClick={handleUnsubmit}
                  >
                    {t("unsubmit_button")}
                  </Button>
                  <p className="text-xs text-center text-slate-500 mt-3 flex items-center justify-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    {t("unsubmit_hint")}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Details and Submission areas stack vertically. Full-width buttons.
// tablet  (md):            Stack vertically with more padding.
// lg / desktop:            Two columns (Details left, Submission right fixed width). Right column is sticky.
// Interaction:             Drag-and-drop zone highlights. Framer Motion state switches.
