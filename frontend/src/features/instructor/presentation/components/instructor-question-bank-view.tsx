"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  CheckSquare,
  Copy,
  Edit,
  Eye,
  Hash,
  ListFilter,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Type
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

// Types
type QuestionType = "mcq" | "essay" | "true_false" | "matching";

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  category: string;
  lastUsed?: string;
  difficulty: "easy" | "medium" | "hard";
}

const InstructorQuestionBankView = () => {
  const t = useTranslations("QuestionBank");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [questions] = useState<Question[]>([
    { id: "q1", text: "What is the primary purpose of React Hooks?", type: "mcq", category: "React Fundamentals", difficulty: "medium" },
    { id: "q2", text: "Explain the difference between Virtual DOM and Shadow DOM.", type: "essay", category: "Web Standards", difficulty: "hard" },
    { id: "q3", text: "React components must always start with a capital letter.", type: "true_false", category: "JSX", difficulty: "easy" },
    { id: "q4", text: "Which hook is used for side effects?", type: "mcq", category: "Hooks", difficulty: "medium" },
    { id: "q5", text: "How do you optimize a large list in React?", type: "essay", category: "Performance", difficulty: "hard" },
  ]);

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || q.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: QuestionType) => {
    switch (type) {
      case "mcq": return <CheckSquare className="h-4 w-4 text-blue-500" />;
      case "essay": return <Type className="h-4 w-4 text-orange-500" />;
      case "true_false": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "matching": return <Hash className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("all_questions")}</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger >
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              {t("add_question")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{t("add_modal.title")}</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new question to your bank.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="question-text">{t("add_modal.question_text")}</Label>
                <Textarea id="question-text" placeholder="e.g., What is React?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">{t("add_modal.type")}</Label>
                  <Select defaultValue="mcq">
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">{t("types.mcq")}</SelectItem>
                      <SelectItem value="essay">{t("types.essay")}</SelectItem>
                      <SelectItem value="true_false">{t("types.true_false")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="difficulty">{t("add_modal.difficulty")}</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">{t("difficulty.easy")}</SelectItem>
                      <SelectItem value="medium">{t("difficulty.medium")}</SelectItem>
                      <SelectItem value="hard">{t("difficulty.hard")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">{t("add_modal.category")}</Label>
                <Input id="category" placeholder="e.g., Fundamentals" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                {t("add_modal.cancel")}
              </Button>
              <Button type="submit" onClick={() => setIsAddModalOpen(false)}>
                {t("add_modal.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
              <Select value={selectedType} onValueChange={(val) => setSelectedType(val || "all")}>
                <SelectTrigger className="w-[180px] bg-background border-none shadow-sm">
                  <SelectValue placeholder={t("all_types")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all_types")}</SelectItem>
                  <SelectItem value="mcq">{t("types.mcq")}</SelectItem>
                  <SelectItem value="essay">{t("types.essay")}</SelectItem>
                  <SelectItem value="true_false">{t("types.true_false")}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="bg-background border-none shadow-sm">
                <ListFilter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border bg-background overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[45%]">{t("table.question")}</TableHead>
                <TableHead>{t("table.type")}</TableHead>
                <TableHead>{t("table.category")}</TableHead>
                <TableHead>{t("table.difficulty")}</TableHead>
                <TableHead className="text-right">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredQuestions.map((q) => (
                  <TableRow
                    key={q.id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1 rounded bg-muted">
                          {getTypeIcon(q.type)}
                        </div>
                        <span className="line-clamp-2 leading-relaxed">{q.text}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize font-normal">
                        {t(`types.${q.type}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">{q.category}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          q.difficulty === "easy" ? "success" :
                            q.difficulty === "medium" ? "warning" : "destructive"
                        }
                        className="capitalize px-2 py-0"
                      >
                        {t(`difficulty.${q.difficulty}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger >
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" /> {t("preview")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" /> {t("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" /> {t("duplicate")}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" /> {t("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">{t("empty.title")}</h3>
            <p className="text-muted-foreground">{t("empty.description")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorQuestionBankView;
