import {
  CheckCircle2,
  CheckSquare,
  Hash,
} from "lucide-react";

import {
  DifficultyLevel,
  QuestionType,
  type CreateQuestionDTO,
  type QuestionOptionNodeDTO,
  type QuestionOptionDTO,
  type UniqueIdDTO,
} from "../../../infrastructure/instructor-question.api";
import type {
  QuestionBankFormState,
  QuestionBankQuestionNode,
} from "./question-bank.types";

type ValidationTranslate = (key: string) => string;
type QuestionNodeId = QuestionBankQuestionNode | QuestionBankQuestionNode["_id"];

export const createDefaultQuestionOptions = (): QuestionOptionDTO[] => [
  { content: "", isCorrect: true, explanation: "" },
  { content: "", isCorrect: false, explanation: "" },
];

export const createTrueFalseOptions = (): QuestionOptionDTO[] => [
  { content: "True", isCorrect: true, explanation: "" },
  { content: "False", isCorrect: false, explanation: "" },
];

export const createInitialQuestionFormState = (): QuestionBankFormState => ({
  title: "",
  content: "",
  type: QuestionType.SINGLE_CHOICE,
  difficulty: DifficultyLevel.MEDIUM,
  tags: "",
  options: createDefaultQuestionOptions(),
});

const getUniqueIdValue = (id?: UniqueIdDTO | string | null) => {
  if (!id) return "";
  return typeof id === "string" ? id : id.value;
};

export const getQuestionNodeId = (question: QuestionNodeId) => {
  if (typeof question === "string") return question;
  if ("value" in question) return question.value;
  return getUniqueIdValue(question._id);
};

export const getQuestionOptionProps = (option: QuestionOptionNodeDTO) =>
  option.props;

export const mapQuestionNodeToFormState = (
  question: QuestionBankQuestionNode,
): QuestionBankFormState => ({
  title: question.props.title || "",
  content: question.props.content || "",
  type: question.props.type || QuestionType.SINGLE_CHOICE,
  difficulty: question.props.difficulty || DifficultyLevel.MEDIUM,
  tags: question.props.tags?.join(", ") || "",
  options:
    question.props.options?.map((option) => {
      const optionProps = getQuestionOptionProps(option);

      return {
        id: getUniqueIdValue(optionProps.id),
        content: optionProps.content || "",
        isCorrect: optionProps.isCorrect || false,
        explanation: optionProps.explanation || "",
      };
    }) || createDefaultQuestionOptions(),
});

export const buildQuestionPayload = (
  formState: QuestionBankFormState,
): CreateQuestionDTO => ({
  title: formState.title,
  content: formState.content,
  type: formState.type,
  difficulty: formState.difficulty,
  options: formState.options.map((option) => ({
    content: option.content,
    isCorrect: option.isCorrect,
    explanation: option.explanation || null,
  })),
  tags: formState.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0),
});

export const validateQuestionForm = (
  formState: QuestionBankFormState,
  t: ValidationTranslate,
) => {
  const errors: string[] = [];

  if (!formState.title.trim()) {
    errors.push(t("validation.title_required"));
  }

  if (!formState.content.trim()) {
    errors.push(t("validation.content_required"));
  }

  if (formState.options.length < 2) {
    errors.push(t("validation.min_options"));
  }

  if (
    formState.type === QuestionType.TRUE_FALSE &&
    formState.options.length > 2
  ) {
    errors.push(t("validation.max_options_true_false"));
  }

  if (formState.options.some((option) => !option.content.trim())) {
    errors.push(t("validation.option_content_required"));
  }

  const correctCount = formState.options.filter((option) => option.isCorrect)
    .length;

  if (
    (formState.type === QuestionType.SINGLE_CHOICE ||
      formState.type === QuestionType.TRUE_FALSE) &&
    correctCount !== 1
  ) {
    errors.push(t("validation.single_correct_required"));
  }

  if (
    formState.type === QuestionType.MULTIPLE_CHOICE &&
    correctCount < 1
  ) {
    errors.push(t("validation.multiple_correct_required"));
  }

  return errors;
};

export const getQuestionTypeIcon = (type?: QuestionType) => {
  switch (type) {
    case QuestionType.SINGLE_CHOICE:
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case QuestionType.MULTIPLE_CHOICE:
      return <CheckSquare className="h-4 w-4 text-blue-500" />;
    case QuestionType.TRUE_FALSE:
      return <Hash className="h-4 w-4 text-purple-500" />;
    default:
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  }
};
