"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  RefreshCcw,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock Data
const MOCK_QUIZ = {
  id: "q1",
  title: "React Fundamentals Assessment",
  description: "Test your knowledge of React core concepts including components, state, and hooks.",
  timeLimit: 15 * 60, // 15 minutes in seconds
  questions: [
    {
      id: "q1_1",
      text: "What is the primary purpose of the Virtual DOM in React?",
      options: [
        { id: "o1", text: "To replace the actual DOM entirely for better security" },
        { id: "o2", text: "To optimize rendering by minimizing direct actual DOM manipulation" },
        { id: "o3", text: "To allow React to run on the server side" },
        { id: "o4", text: "To store global application state" }
      ],
      correctOptionId: "o2",
      explanation: "React uses a Virtual DOM to batch and optimize DOM updates. It calculates the difference (diffing) and only updates what changed in the real DOM, which is much faster than direct manipulation."
    },
    {
      id: "q1_2",
      text: "Which hook should be used to perform side effects in a function component?",
      options: [
        { id: "o1", text: "useState" },
        { id: "o2", text: "useContext" },
        { id: "o3", text: "useEffect" },
        { id: "o4", text: "useReducer" }
      ],
      correctOptionId: "o3",
      explanation: "useEffect is the hook designed for managing side effects like data fetching, subscriptions, or manually changing the DOM in React components."
    },
    {
      id: "q1_3",
      text: "What happens when you call setState() in React?",
      options: [
        { id: "o1", text: "The state is updated immediately synchronously" },
        { id: "o2", text: "React merges the object into current state and triggers a re-render" },
        { id: "o3", text: "The component unmounts and remounts" },
        { id: "o4", text: "The application reloads" }
      ],
      correctOptionId: "o2",
      explanation: "setState schedules an update to a component's state object. When state changes, the component responds by re-rendering."
    }
  ]
};

type QuizState = 'intro' | 'playing' | 'completed';

export function QuizPlayer() {
  const t = useTranslations("Quiz");
  
  const [quizState, setQuizState] = useState<QuizState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(MOCK_QUIZ.timeLimit);
  
  const question = MOCK_QUIZ.questions[currentQuestionIndex];
  const totalQuestions = MOCK_QUIZ.questions.length;
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizState === 'playing' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizState, timeRemaining]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setQuizState('playing');
  };

  const handleSelectAnswer = (optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [question.id]: optionId
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setQuizState('completed');
  };

  const handleRetry = () => {
    setQuizState('intro');
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeRemaining(MOCK_QUIZ.timeLimit);
  };

  const calculateScore = () => {
    let correct = 0;
    MOCK_QUIZ.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correct++;
      }
    });
    return {
      correct,
      total: totalQuestions,
      percentage: Math.round((correct / totalQuestions) * 100)
    };
  };

  // Render Intro View
  if (quizState === 'intro') {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <Card className="p-8 text-center border-brand-border bg-white dark:bg-brand-card shadow-sm rounded-2xl">
          <div className="mx-auto w-16 h-16 bg-brand-amber/10 rounded-full flex items-center justify-center mb-6">
            <Trophy className="h-8 w-8 text-brand-amber" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {MOCK_QUIZ.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">
            {MOCK_QUIZ.description}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8 text-sm font-medium text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-slate-400" />
              <span>{t("questions_count", { count: totalQuestions })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-400" />
              <span>{t("time_limit", { time: MOCK_QUIZ.timeLimit / 60 })}</span>
            </div>
          </div>
          
          <Button 
            onClick={handleStart}
            size="lg"
            className="w-full sm:w-auto min-w-[200px] bg-brand-amber text-black hover:bg-brand-amber/90 text-base h-12 rounded-xl"
          >
            {t("start_button")}
          </Button>
        </Card>
      </div>
    );
  }

  // Render Results View
  if (quizState === 'completed') {
    const score = calculateScore();
    const isPassed = score.percentage >= 80;

    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <Card className="p-6 sm:p-10 text-center border-brand-border bg-white dark:bg-brand-card shadow-sm rounded-2xl mb-8">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isPassed ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
            {isPassed ? (
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            ) : (
              <XCircle className="h-10 w-10 text-rose-500" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {isPassed ? t("passed_title") : t("failed_title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            {t("score_summary", { score: score.correct, total: score.total })}
          </p>
          
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-amber mb-1">{score.percentage}%</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{t("final_score")}</div>
            </div>
            <div className="w-px h-12 bg-brand-border"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">80%</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{t("passing_score")}</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={handleRetry}
              variant="outline"
              className="w-full sm:w-auto min-w-[160px] h-12 rounded-xl border-brand-border"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              {t("retry_button")}
            </Button>
            <Button 
              className="w-full sm:w-auto min-w-[160px] h-12 rounded-xl bg-brand-amber text-black hover:bg-brand-amber/90"
            >
              {t("continue_button")}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Review Answers */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t("review_answers")}</h3>
        <div className="space-y-6">
          {MOCK_QUIZ.questions.map((q, i) => {
            const userAnswer = selectedAnswers[q.id];
            const isCorrect = userAnswer === q.correctOptionId;
            
            return (
              <Card key={q.id} className="p-5 sm:p-6 border-brand-border bg-white dark:bg-brand-card rounded-2xl overflow-hidden relative">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg">
                    <span className="text-slate-400 mr-2">{i + 1}.</span>
                    {q.text}
                  </h4>
                  {isCorrect ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-rose-500 shrink-0" />
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  {q.options.map(opt => {
                    let optionStyles = "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400";
                    
                    if (opt.id === q.correctOptionId) {
                      optionStyles = "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium";
                    } else if (opt.id === userAnswer && !isCorrect) {
                      optionStyles = "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-medium";
                    }
                    
                    return (
                      <div key={opt.id} className={`p-3 rounded-lg border text-sm ${optionStyles}`}>
                        {opt.text}
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 p-4 rounded-xl bg-brand-amber/5 border border-brand-amber/20">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-brand-amber mr-2">{t("explanation")}</span>
                    {q.explanation}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Render Playing View
  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto py-6 px-4 sm:px-6 w-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white hidden sm:block">
            {MOCK_QUIZ.title}
          </h2>
          <Badge variant="outline" className="border-brand-border text-slate-600 dark:text-slate-400 px-3 py-1 text-xs">
            {t("question_indicator", { current: currentQuestionIndex + 1, total: totalQuestions })}
          </Badge>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${timeRemaining < 60 ? 'bg-rose-500/10 border-rose-500/30 text-rose-600' : 'bg-slate-100 dark:bg-slate-800 border-brand-border text-slate-700 dark:text-slate-300'}`}>
          <Clock className="h-4 w-4" />
          <span className="font-mono font-medium text-sm">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-1.5 mb-8 bg-slate-100 dark:bg-slate-800 [&>div]:bg-brand-amber" />

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex-1"
        >
          <Card className="p-6 sm:p-10 border-brand-border bg-white dark:bg-brand-card shadow-sm rounded-2xl h-full">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-8 leading-snug">
              {question.text}
            </h3>

            <RadioGroup 
              value={selectedAnswers[question.id] || ""}
              onValueChange={handleSelectAnswer}
              className="space-y-4"
            >
              {question.options.map((option) => {
                const isSelected = selectedAnswers[question.id] === option.id;
                
                return (
                  <div key={option.id}>
                    <RadioGroupItem 
                      value={option.id} 
                      id={`option-${option.id}`} 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor={`option-${option.id}`}
                      className={`
                        flex items-center p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                        ${isSelected 
                          ? 'border-brand-amber bg-brand-amber/5 shadow-sm' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-brand-amber/50 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                        }
                      `}
                    >
                      <div className={`
                        flex items-center justify-center w-6 h-6 rounded-full border-2 mr-4 shrink-0 transition-colors
                        ${isSelected 
                          ? 'border-brand-amber bg-brand-amber' 
                          : 'border-slate-300 dark:border-slate-700'
                        }
                      `}>
                        {isSelected && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                      </div>
                      <span className={`text-base font-medium ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {option.text}
                      </span>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-border">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="text-slate-600 dark:text-slate-400"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t("previous_button")}
        </Button>

        {isLastQuestion ? (
          <Button 
            onClick={handleComplete}
            disabled={!selectedAnswers[question.id]}
            className="bg-brand-amber text-black hover:bg-brand-amber/90 px-8 rounded-xl"
          >
            {t("submit_button")}
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            disabled={!selectedAnswers[question.id]}
            className="bg-brand-amber text-black hover:bg-brand-amber/90 px-8 rounded-xl"
          >
            {t("next_button")}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Questions and options stack vertically. Clean radio cards. Navigation buttons stretch or stack if necessary.
// tablet  (md / lg):       Max width enforced. Navigation side-by-side. 
// desktop (xl / 2xl):      Generous padding, clean shadow, hover effects on options.
// Interaction:             Animated question transitions. Active state styling on selected answers.
