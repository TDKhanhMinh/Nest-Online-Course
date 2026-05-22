"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  QuestionType,
  type QuestionOptionDTO,
} from "../../infrastructure/instructor-question.api";
import {
  useCreateQuestion,
  useDeleteQuestion,
  useInstructorQuestions,
  useUpdateQuestion,
} from "../hooks/use-instructor-questions";
import { QuestionBankFilters } from "./question-bank/question-bank-filters";
import { QuestionBankFormDialog } from "./question-bank/question-bank-form-dialog";
import { QuestionBankHeader } from "./question-bank/question-bank-header";
import { QuestionBankPagination } from "./question-bank/question-bank-pagination";
import { QuestionBankPreviewDialog } from "./question-bank/question-bank-preview-dialog";
import { QuestionBankTable } from "./question-bank/question-bank-table";
import type {
  QuestionBankFormState,
  QuestionBankQuestionNode,
} from "./question-bank/question-bank.types";
import {
  buildQuestionPayload,
  createDefaultQuestionOptions,
  createInitialQuestionFormState,
  createTrueFalseOptions,
  getQuestionNodeId,
  mapQuestionNodeToFormState,
  validateQuestionForm,
} from "./question-bank/question-bank.utils";

const InstructorQuestionBankView = () => {
  const t = useTranslations("QuestionBank");

  // Filtering & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Query hook to fetch dynamic list
  const { data, isLoading, isError, refetch } = useInstructorQuestions({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    // type filter handled in query or locally
  });
  // Mutations
  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();

  // Active question state for Dialogs
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<QuestionBankQuestionNode | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewingQuestion, setPreviewingQuestion] =
    useState<QuestionBankQuestionNode | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formState, setFormState] = useState<QuestionBankFormState>(
    createInitialQuestionFormState(),
  );
  const validationErrors = validateQuestionForm(formState, t);

  // Option actions
  const handleAddOption = () => {
    if (formState.type === QuestionType.TRUE_FALSE) return;
    setFormState((previous) => ({
      ...previous,
      options: [
        ...previous.options,
        { content: "", isCorrect: false, explanation: "" },
      ],
    }));
  };

  const handleRemoveOption = (index: number) => {
    if (formState.type === QuestionType.TRUE_FALSE) return;
    setFormState((previous) => ({
      ...previous,
      options: previous.options.filter(
        (_, optionIndex) => optionIndex !== index,
      ),
    }));
  };

  const handleOptionChange = (
    index: number,
    field: keyof QuestionOptionDTO,
    value: boolean | string,
  ) => {
    setFormState((previous) => {
      const updatedOptions = [...previous.options];

      if (field === "isCorrect") {
        if (
          previous.type === QuestionType.SINGLE_CHOICE ||
          previous.type === QuestionType.TRUE_FALSE
        ) {
          updatedOptions.forEach((option, optionIndex) => {
            option.isCorrect = optionIndex === index ? Boolean(value) : false;
          });
        } else {
          updatedOptions[index] = {
            ...updatedOptions[index],
            isCorrect: Boolean(value),
          };
        }
      } else {
        updatedOptions[index] = {
          ...updatedOptions[index],
          [field]: value,
        };
      }

      return {
        ...previous,
        options: updatedOptions,
      };
    });
  };

  const handleTypeChange = (type: QuestionType) => {
    setFormState((previous) => {
      if (type === QuestionType.TRUE_FALSE) {
        return {
          ...previous,
          type,
          options: createTrueFalseOptions(),
        };
      }

      const shouldResetTrueFalseOptions =
        previous.options.length === 2 &&
        previous.options[0].content === "True" &&
        previous.options[1].content === "False";

      return {
        ...previous,
        type,
        options: shouldResetTrueFalseOptions
          ? createDefaultQuestionOptions()
          : previous.options,
      };
    });
  };

  const openCreateDialog = () => {
    setEditingQuestion(null);
    setFormState(createInitialQuestionFormState());
    setIsAddEditOpen(true);
  };

  const openEditDialog = (question: QuestionBankQuestionNode) => {
    setEditingQuestion(question);
    setFormState(mapQuestionNodeToFormState(question));
    setIsAddEditOpen(true);
  };

  // Handle Form Submit (Save / Edit)
  const handleSaveQuestion = async () => {
    if (validationErrors.length > 0) return;
    const payload = buildQuestionPayload(formState);

    try {
      if (editingQuestion) {
        await updateMutation.mutateAsync({
          id: getQuestionNodeId(editingQuestion),
          data: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsAddEditOpen(false);
      setEditingQuestion(null);
    } catch {
      // Handled globally
    }
  };

  // Duplicate handler
  const handleDuplicate = async (question: QuestionBankQuestionNode) => {
    const payload = buildQuestionPayload({
      ...mapQuestionNodeToFormState(question),
      title: `${question.props.title || ""} (Copy)`,
    });

    try {
      await createMutation.mutateAsync(payload);
    } catch {
      // Handled globally
    }
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirmId);
      setDeleteConfirmId(null);
    } catch {
      // Handled globally
    }
  };

  // Filter items locally to apply Type filter immediately if API result contains mixed types
  const questionsList = (data?.data || []) as QuestionBankQuestionNode[];
  const filteredQuestions = questionsList.filter((question) => {
    return selectedType === "all" || question.props.type === selectedType;
  });

  const totalPages = data?.pagination?.pageCount || 1;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <QuestionBankHeader onAddQuestion={openCreateDialog} />

      <QuestionBankFilters
        searchQuery={searchQuery}
        selectedType={selectedType}
        onSearchQueryChange={(value) => {
          setSearchQuery(value);
          setCurrentPage(1);
        }}
        onSelectedTypeChange={(value) => {
          setSelectedType(value);
          setCurrentPage(1);
        }}
        onRefresh={refetch}
      />

      <div className="rounded-xl border bg-background overflow-hidden shadow-sm">
        <QuestionBankTable
          questions={filteredQuestions}
          isLoading={isLoading}
          isError={isError}
          onPreview={(question) => {
            setPreviewingQuestion(question);
            setIsPreviewOpen(true);
          }}
          onEdit={openEditDialog}
          onDuplicate={handleDuplicate}
          onDelete={setDeleteConfirmId}
        />

        {data?.pagination && totalPages > 1 && (
          <QuestionBankPagination
            pagination={data.pagination}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <QuestionBankFormDialog
        open={isAddEditOpen}
        editingQuestion={editingQuestion}
        formState={formState}
        validationErrors={validationErrors}
        isSaving={createMutation.isPending || updateMutation.isPending}
        onOpenChange={setIsAddEditOpen}
        onTitleChange={(value) =>
          setFormState((previous) => ({ ...previous, title: value }))
        }
        onContentChange={(value) =>
          setFormState((previous) => ({ ...previous, content: value }))
        }
        onTypeChange={handleTypeChange}
        onDifficultyChange={(value) =>
          setFormState((previous) => ({ ...previous, difficulty: value }))
        }
        onTagsChange={(value) =>
          setFormState((previous) => ({ ...previous, tags: value }))
        }
        onAddOption={handleAddOption}
        onRemoveOption={handleRemoveOption}
        onOptionChange={handleOptionChange}
        onSave={handleSaveQuestion}
      />

      <QuestionBankPreviewDialog
        open={isPreviewOpen}
        question={previewingQuestion}
        onOpenChange={setIsPreviewOpen}
      />

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
