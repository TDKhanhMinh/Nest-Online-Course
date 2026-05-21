"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit,
  Eye,
  Hash,
  ListFilter,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  X
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  DifficultyLevel,
  QuestionType,
  type QuestionOptionDTO
} from "../../infrastructure/instructor-question.api";
import {
  useCreateQuestion,
  useDeleteQuestion,
  useInstructorQuestions,
  useUpdateQuestion,
} from "../hooks/use-instructor-questions";

const InstructorQuestionBankView = () => {
  const t = useTranslations("QuestionBank");

  // Filtering & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Query hook to fetch dynamic list
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useInstructorQuestions({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    // type filter handled in query or locally
  });
  console.log(data);
  // Mutations
  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();

  // Active question state for Dialogs
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewingQuestion, setPreviewingQuestion] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  console.log("editingQuestion", editingQuestion)
  console.log("previewingQuestion", previewingQuestion)
  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formType, setFormType] = useState<QuestionType>(QuestionType.SINGLE_CHOICE);
  const [formDifficulty, setFormDifficulty] = useState<DifficultyLevel>(DifficultyLevel.MEDIUM);
  const [formTags, setFormTags] = useState("");
  const [formOptions, setFormOptions] = useState<QuestionOptionDTO[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Automatically sync form when editing changes
  useEffect(() => {
    if (editingQuestion) {
      setFormTitle(editingQuestion.props?.title || "");
      setFormContent(editingQuestion.props?.content || "");
      setFormType(editingQuestion.props?.type || QuestionType.SINGLE_CHOICE);
      setFormDifficulty(editingQuestion.props?.difficulty || DifficultyLevel.MEDIUM);
      setFormTags(editingQuestion.props?.tags?.join(", ") || "");
      setFormOptions(
        (editingQuestion.props?.options || []).map((opt: any) => ({
          content: opt.props?.content || "",
          isCorrect: opt.props?.isCorrect || false,
          explanation: opt.props?.explanation || "",
        }))
      );
    } else {
      setFormTitle("");
      setFormContent("");
      setFormType(QuestionType.SINGLE_CHOICE);
      setFormDifficulty(DifficultyLevel.MEDIUM);
      setFormTags("");
      setFormOptions([
        { content: "", isCorrect: true, explanation: "" },
        { content: "", isCorrect: false, explanation: "" },
      ]);
    }
  }, [editingQuestion, isAddEditOpen]);

  // Adjust options automatically when changing to TRUE_FALSE
  useEffect(() => {
    if (formType === QuestionType.TRUE_FALSE) {
      // Force True/False options
      setFormOptions([
        { content: "True", isCorrect: true, explanation: "" },
        { content: "False", isCorrect: false, explanation: "" }
      ]);
    } else if (formOptions.length === 2 && formOptions[0].content === "True" && formOptions[1].content === "False") {
      // Reset back to blank options when toggling off True/False
      setFormOptions([
        { content: "", isCorrect: true, explanation: "" },
        { content: "", isCorrect: false, explanation: "" }
      ]);
    }
  }, [formType]);

  // Trigger search on debounce or page adjustments
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType]);

  // Realtime options validation
  useEffect(() => {
    const errors: string[] = [];
    if (!formTitle.trim()) {
      errors.push(t("validation.title_required"));
    }
    if (!formContent.trim()) {
      errors.push(t("validation.content_required"));
    }
    if (formOptions.length < 2) {
      errors.push(t("validation.min_options"));
    }
    if (formType === QuestionType.TRUE_FALSE && formOptions.length > 2) {
      errors.push(t("validation.max_options_true_false"));
    }

    const hasEmptyOption = formOptions.some(opt => !opt.content.trim());
    if (hasEmptyOption) {
      errors.push(t("validation.option_content_required"));
    }

    const correctCount = formOptions.filter(opt => opt.isCorrect).length;
    if ((formType === QuestionType.SINGLE_CHOICE || formType === QuestionType.TRUE_FALSE) && correctCount !== 1) {
      errors.push(t("validation.single_correct_required"));
    } else if (formType === QuestionType.MULTIPLE_CHOICE && correctCount < 1) {
      errors.push(t("validation.multiple_correct_required"));
    }

    setValidationErrors(errors);
  }, [formTitle, formContent, formType, formOptions]);

  // Icon selector based on type
  const getTypeIcon = (type: QuestionType) => {
    switch (type) {
      case QuestionType.SINGLE_CHOICE:
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case QuestionType.MULTIPLE_CHOICE:
        return <CheckSquare className="h-4 w-4 text-blue-500" />;
      case QuestionType.TRUE_FALSE:
        return <Hash className="h-4 w-4 text-purple-500" />;
    }
  };

  // Option actions
  const handleAddOption = () => {
    if (formType === QuestionType.TRUE_FALSE) return;
    setFormOptions([...formOptions, { content: "", isCorrect: false, explanation: "" }]);
  };

  const handleRemoveOption = (index: number) => {
    if (formType === QuestionType.TRUE_FALSE) return;
    setFormOptions(formOptions.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, field: keyof QuestionOptionDTO, value: any) => {
    const updated = [...formOptions];
    if (field === "isCorrect") {
      if (formType === QuestionType.SINGLE_CHOICE || formType === QuestionType.TRUE_FALSE) {
        // Toggle only this one as correct, clear all others
        updated.forEach((opt, i) => {
          opt.isCorrect = i === index ? value : false;
        });
      } else {
        updated[index].isCorrect = value;
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setFormOptions(updated);
  };

  // Handle Form Submit (Save / Edit)
  const handleSaveQuestion = async () => {
    if (validationErrors.length > 0) return;

    const tagsArray = formTags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const payload = {
      title: formTitle,
      content: formContent,
      type: formType,
      difficulty: formDifficulty,
      options: formOptions.map(opt => ({
        content: opt.content,
        isCorrect: opt.isCorrect,
        explanation: opt.explanation || null,
      })),
      tags: tagsArray,
    };

    try {
      if (editingQuestion) {
        await updateMutation.mutateAsync({
          id: editingQuestion._id?.value || editingQuestion.id,
          data: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsAddEditOpen(false);
      setEditingQuestion(null);
    } catch (err) {
      // Handled globally
    }
  };

  // Duplicate handler
  const handleDuplicate = async (question: any) => {
    const payload = {
      title: `${question.props?.title || ""} (Copy)`,
      content: question.props?.content || "",
      type: question.props?.type || QuestionType.SINGLE_CHOICE,
      difficulty: question.props?.difficulty || DifficultyLevel.MEDIUM,
      options: (question.props?.options || []).map((opt: any) => ({
        content: opt.props?.content || "",
        isCorrect: opt.props?.isCorrect || false,
        explanation: opt.props?.explanation || null,
      })),
      tags: question.props?.tags || [],
    };
    try {
      await createMutation.mutateAsync(payload);
    } catch (err) {
      // Handled globally
    }
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirmId);
      setDeleteConfirmId(null);
    } catch (err) {
      // Handled globally
    }
  };

  // Filter items locally to apply Type filter immediately if API result contains mixed types
  const questionsList = data?.data || [];
  const filteredQuestions = questionsList.filter((q: any) => {
    return selectedType === "all" || q?.props?.type === selectedType;
  });
  console.log("filteredQuestions", filteredQuestions);

  const totalPages = data?.pagination?.pageCount || 1;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("all_questions")}</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => {
          setEditingQuestion(null);
          setIsAddEditOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          {t("add_question")}
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="border-none shadow-sm bg-muted/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                className="pl-9 bg-background border-none shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={(val) => setSelectedType(val ?? "all")}>
                <SelectTrigger className="w-[200px] bg-background border-none shadow-sm">
                  <SelectValue placeholder={t("all_types")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all_types")}</SelectItem>
                  <SelectItem value={QuestionType.SINGLE_CHOICE}>{t("types.SINGLE_CHOICE")}</SelectItem>
                  <SelectItem value={QuestionType.MULTIPLE_CHOICE}>{t("types.MULTIPLE_CHOICE")}</SelectItem>
                  <SelectItem value={QuestionType.TRUE_FALSE}>{t("types.TRUE_FALSE")}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="bg-background border-none shadow-sm" onClick={() => refetch()}>
                <ListFilter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List & Table */}
      <div className="rounded-xl border bg-background overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px] w-full">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[40%]">{t("table.question")}</TableHead>
                <TableHead className="w-[20%]">{t("table.type")}</TableHead>
                <TableHead className="w-[20%]">{t("table.tags")}</TableHead>
                <TableHead className="w-[10%]">{t("table.difficulty")}</TableHead>
                <TableHead className="w-[10%] text-right">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-destructive">
                    <AlertCircle className="h-10 w-10 mx-auto mb-2" />
                    <p className="font-semibold">{t("error")}</p>
                  </TableCell>
                </TableRow>
              ) : filteredQuestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">{t("empty.title")}</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mt-1">{t("empty.description")}</p>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredQuestions.map((q: any) => (
                    <TableRow
                      key={q._id?.value || q.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 p-1 rounded bg-muted">
                            {getTypeIcon(q?.props?.type)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-slate-100">{q?.props?.title}</div>
                            <span className="line-clamp-2 leading-relaxed text-sm text-slate-500 font-normal">{q?.props?.content}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize font-normal whitespace-nowrap">
                          {t(`types.${q?.props?.type}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {q?.props?.tags && q?.props?.tags.length > 0 ? (
                            q?.props?.tags.map((tag: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-[11px] bg-slate-50">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            q?.props?.difficulty === DifficultyLevel.EASY ? "success" :
                              q?.props?.difficulty === DifficultyLevel.MEDIUM ? "warning" : "destructive"
                          }
                          className="capitalize px-2.5 py-0.5 text-xs font-semibold"
                        >
                          {t(`difficulty.${q?.props?.difficulty}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-black dark:text-white">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          } />
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setPreviewingQuestion(q);
                              setIsPreviewOpen(true);
                            }}>
                              <Eye className="h-4 w-4 mr-2" /> {t("preview")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setEditingQuestion(q);
                              setIsAddEditOpen(true);
                            }}>
                              <Edit className="h-4 w-4 mr-2" /> {t("edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(q)}>
                              <Copy className="h-4 w-4 mr-2" /> {t("duplicate")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteConfirmId(q._id?.value || q.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> {t("delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {data?.pagination && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-muted/10">
            <span className="text-sm text-slate-500">
              {t("pagination.showing", {
                from: (currentPage - 1) * itemsPerPage + 1,
                to: Math.min(currentPage * itemsPerPage, data.pagination.itemCount),
                total: data.pagination.itemCount,
              })}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!data.pagination.hasPreviousPage}
                className="h-8 px-3"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t("pagination.previous")}
              </Button>
              <div className="text-sm font-medium px-2">
                {t("pagination.page")} {currentPage} {t("pagination.of")} {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={!data.pagination.hasNextPage}
                className="h-8 px-3"
              >
                {t("pagination.next")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Question Dialog */}
      <Dialog open={isAddEditOpen} onOpenChange={setIsAddEditOpen}>
        <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto custom-scrollbar p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingQuestion ? t("add_modal.edit_title") : t("add_modal.title")}
            </DialogTitle>
            <DialogDescription>
              Provide precise attributes, description, and list of options for the quiz creators to consume.
            </DialogDescription>
          </DialogHeader>

          {/* Form Content */}
          <div className="space-y-6 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="form-title" className="text-sm font-semibold">{t("add_modal.question_title")} <span className="text-destructive">*</span></Label>
              <Input
                id="form-title"
                placeholder={t("add_modal.question_title_placeholder")}
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="border-slate-300 focus-visible:ring-emerald-500"
              />
            </div>

            {/* Question Content */}
            <div className="grid gap-2">
              <Label htmlFor="form-content" className="text-sm font-semibold">{t("add_modal.question_content")} <span className="text-destructive">*</span></Label>
              <Textarea
                id="form-content"
                rows={3}
                placeholder={t("add_modal.question_content_placeholder")}
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="border-slate-300 focus-visible:ring-emerald-500"
              />
            </div>

            {/* Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="form-type" className="text-sm font-semibold">{t("add_modal.type")}</Label>
                <Select value={formType} onValueChange={(val) => setFormType(val as QuestionType)}>
                  <SelectTrigger id="form-type" className="border-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={QuestionType.SINGLE_CHOICE}>{t("types.SINGLE_CHOICE")}</SelectItem>
                    <SelectItem value={QuestionType.MULTIPLE_CHOICE}>{t("types.MULTIPLE_CHOICE")}</SelectItem>
                    <SelectItem value={QuestionType.TRUE_FALSE}>{t("types.TRUE_FALSE")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="form-difficulty" className="text-sm font-semibold">{t("add_modal.difficulty")}</Label>
                <Select value={formDifficulty} onValueChange={(val) => setFormDifficulty(val as DifficultyLevel)}>
                  <SelectTrigger id="form-difficulty" className="border-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DifficultyLevel.EASY}>{t("difficulty.EASY")}</SelectItem>
                    <SelectItem value={DifficultyLevel.MEDIUM}>{t("difficulty.MEDIUM")}</SelectItem>
                    <SelectItem value={DifficultyLevel.HARD}>{t("difficulty.HARD")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="grid gap-2">
              <Label htmlFor="form-tags" className="text-sm font-semibold">{t("add_modal.tags")}</Label>
              <Input
                id="form-tags"
                placeholder={t("add_modal.tags_placeholder")}
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                className="border-slate-300 focus-visible:ring-emerald-500"
              />
            </div>

            {/* Dynamic Options Section */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-bold text-slate-800 dark:text-slate-100">{t("add_modal.options_title")}</Label>
                {formType !== QuestionType.TRUE_FALSE && (
                  <Button type="button" variant="outline" size="sm" onClick={handleAddOption} className="h-8 text-xs border-dashed border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    <Plus className="h-3 w-3 mr-1" />
                    {t("add_modal.add_option")}
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {formOptions.map((option, idx) => (
                  <div key={idx} className="flex flex-col gap-2 p-3 border rounded-lg bg-slate-50/50">
                    <div className="flex items-start gap-3">
                      {/* Checkbox for correctness */}
                      <div className="flex items-center space-x-2 mt-2 shrink-0">
                        <Checkbox
                          id={`correct-${idx}`}
                          checked={option.isCorrect}
                          onCheckedChange={(checked) => handleOptionChange(idx, "isCorrect", !!checked)}
                          className="border-slate-400 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <Label htmlFor={`correct-${idx}`} className="text-xs font-semibold cursor-pointer text-slate-600 whitespace-nowrap">
                          {t("add_modal.correct_answer")}
                        </Label>
                      </div>

                      {/* Content Input */}
                      <Input
                        placeholder={t("add_modal.option_placeholder")}
                        value={option.content}
                        onChange={(e) => handleOptionChange(idx, "content", e.target.value)}
                        disabled={formType === QuestionType.TRUE_FALSE}
                        className="flex-1 bg-white border-slate-300 h-9 text-sm"
                      />

                      {/* Remove Button */}
                      {formType !== QuestionType.TRUE_FALSE && formOptions.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveOption(idx)}
                          className="text-slate-400 hover:text-red-500 h-9 w-9"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Optional Explanation */}
                    <div className="pl-6">
                      <Input
                        placeholder={t("add_modal.explanation_placeholder")}
                        value={option.explanation || ""}
                        onChange={(e) => handleOptionChange(idx, "explanation", e.target.value)}
                        className="bg-white border-slate-200 h-8 text-xs text-slate-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation Feedback Banner */}
            {validationErrors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Validation Errors</span>
                </div>
                <ul className="list-disc pl-5 text-xs space-y-0.5">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setIsAddEditOpen(false)}>
              {t("add_modal.cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleSaveQuestion}
              disabled={validationErrors.length > 0 || createMutation.isPending || updateMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6"
            >
              {createMutation.isPending || updateMutation.isPending ? t("add_modal.saving") : t("add_modal.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[600px] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Eye className="h-5 w-5 text-slate-600" />
              {t("preview")}
            </DialogTitle>
          </DialogHeader>
          {previewingQuestion && (
            <div className="space-y-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{previewingQuestion?.props?.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">{previewingQuestion?.props?.content}</p>
              </div>

              <div className="flex gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Difficulty</span>
                  <Badge className="mt-1 font-semibold uppercase">{previewingQuestion?.props?.difficulty}</Badge>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Type</span>
                  <Badge variant="outline" className="mt-1 font-semibold uppercase border-slate-300">{previewingQuestion?.props?.type}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700 block">Options & Key</Label>
                {previewingQuestion?.props?.options?.map((option: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border flex flex-col gap-1 transition-all ${option?.props?.isCorrect
                      ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                      : "bg-white border-slate-200 text-slate-700"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs shrink-0 w-6 h-6 rounded-full flex items-center justify-center border bg-muted">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm font-medium">{option?.props?.content}</span>
                      {option?.props?.isCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 ml-auto" />
                      )}
                    </div>
                    {option?.props?.explanation && (
                      <p className="text-xs italic pl-8 text-slate-500 mt-1">
                        Explanation: {option?.props?.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)} className="w-full sm:w-auto">
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <ConfirmDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
        title={
          <span className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            {t("confirm_delete.title")}
          </span>
        }
        description={t("confirm_delete.description")}
        cancelText={t("confirm_delete.cancel")}
        confirmText={t("confirm_delete.confirm")}
        confirmVariant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default InstructorQuestionBankView;
