"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { 
  MessageSquare, 
  ThumbsUp, 
  Reply, 
  Search, 
  PlusCircle, 
  MoreVertical,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Reply {
  id: string;
  author: {
    name: string;
    avatar: string;
    isInstructor?: boolean;
  };
  content: string;
  createdAt: string;
  upvotes: number;
}

interface Thread {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  upvotes: number;
  replies: Reply[];
}

const MOCK_THREADS: Thread[] = [
  {
    id: "t1",
    title: "How does the virtual DOM actually work under the hood?",
    content: "I understand that React uses a virtual DOM to minimize actual DOM updates, but what is the exact mechanism? Does it create a full copy of the DOM tree every time state changes?",
    author: {
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    upvotes: 12,
    replies: [
      {
        id: "r1",
        author: {
          name: "Khoa Nguyen",
          avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
          isInstructor: true,
        },
        content: "Great question! React doesn't copy the actual DOM. The virtual DOM is just a lightweight JavaScript object representation of the UI. When state changes, React creates a NEW virtual DOM tree, compares it with the previous virtual DOM tree (a process called 'diffing'), and then calculates the minimum number of operations needed to update the actual DOM.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        upvotes: 25,
      }
    ]
  },
  {
    id: "t2",
    title: "Issue with setting state asynchronously",
    content: "When I call setCounter(counter + 1) twice in the same function, it only increments by 1. Why does this happen and how do I fix it?",
    author: {
      name: "Sarah Lee",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024c",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    upvotes: 5,
    replies: []
  }
];

export function DiscussionForum() {
  const t = useTranslations("Discussion");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);

  const filteredThreads = MOCK_THREADS.filter(thread => 
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    thread.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 pt-6">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder={t("search_placeholder")} 
            className="pl-9 border-brand-border bg-white dark:bg-brand-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          className="bg-brand-amber text-black hover:bg-brand-amber/90 shrink-0"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? t("post_button") : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("new_post")}
            </>
          )}
        </Button>
      </div>

      {/* Create Post Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-brand-amber/30 bg-brand-amber/5 p-4 sm:p-6 mb-4">
              <Input 
                placeholder={t("post_title_placeholder")} 
                className="mb-4 bg-white dark:bg-brand-card font-semibold border-brand-border"
              />
              <Textarea 
                placeholder={t("post_body_placeholder")} 
                className="min-h-[120px] bg-white dark:bg-brand-card border-brand-border resize-y"
              />
              <div className="mt-4 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsCreating(false)}>
                  {t("cancel_button")}
                </Button>
                <Button className="bg-brand-amber text-black hover:bg-brand-amber/90">
                  {t("post_button")}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Threads List */}
      <div className="flex flex-col gap-4">
        {filteredThreads.length === 0 ? (
          <div className="py-12 text-center text-slate-500 flex flex-col items-center">
            <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
            <p>{t("empty")}</p>
          </div>
        ) : (
          filteredThreads.map(thread => (
            <div 
              key={thread.id} 
              className="rounded-xl border border-brand-border bg-white dark:bg-brand-card p-4 sm:p-5 transition-shadow hover:shadow-md"
            >
              {/* Thread Header */}
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 shrink-0 border border-slate-200 dark:border-slate-800 hidden sm:block">
                  <AvatarImage src={thread.author.avatar} />
                  <AvatarFallback>{thread.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-sora font-semibold text-slate-900 dark:text-white text-base sm:text-lg cursor-pointer hover:text-brand-amber transition-colors line-clamp-2"
                        onClick={() => setExpandedThreadId(expandedThreadId === thread.id ? null : thread.id)}
                    >
                      {thread.title}
                    </h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 -mt-1 text-slate-400">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                    <span className="font-medium text-slate-700 dark:text-slate-300 sm:hidden">
                      {thread.author.name}
                    </span>
                    <span className="hidden sm:inline font-medium text-slate-700 dark:text-slate-300">
                      {thread.author.name}
                    </span>
                    <span>•</span>
                    <span>{t("time_ago", { time: formatDistanceToNow(new Date(thread.createdAt)) })}</span>
                  </div>

                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                    {thread.content}
                  </p>

                  <div className="mt-4 flex items-center gap-4 sm:gap-6 border-t border-brand-border/50 pt-3">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-amber transition-colors">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {t("upvotes", { count: thread.upvotes })}
                    </button>
                    <button 
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-amber transition-colors"
                      onClick={() => setExpandedThreadId(expandedThreadId === thread.id ? null : thread.id)}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      {t("replies", { count: thread.replies.length })}
                    </button>
                  </div>
                </div>
              </div>

              {/* Thread Replies */}
              <AnimatePresence>
                {expandedThreadId === thread.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pl-4 sm:pl-14 border-l-2 border-brand-border space-y-4 pt-2">
                      {thread.replies.map(reply => (
                        <div key={reply.id} className="relative">
                          <div className="flex gap-3">
                            <Avatar className="h-8 w-8 shrink-0 border border-slate-200 dark:border-slate-800">
                              <AvatarImage src={reply.author.avatar} />
                              <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-sm text-slate-900 dark:text-white">
                                  {reply.author.name}
                                </span>
                                {reply.author.isInstructor && (
                                  <Badge variant="secondary" className="bg-brand-amber/10 text-brand-amber text-[10px] px-1.5 h-4 flex items-center gap-1">
                                    <ShieldCheck className="h-3 w-3" />
                                    {t("author_badge")}
                                  </Badge>
                                )}
                                <span className="text-[10px] text-slate-500 shrink-0">
                                  {t("time_ago", { time: formatDistanceToNow(new Date(reply.createdAt)) })}
                                </span>
                              </div>
                              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                                {reply.content}
                              </p>
                              <div className="mt-2 flex items-center gap-4">
                                <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-amber transition-colors">
                                  <ThumbsUp className="h-3 w-3" />
                                  {reply.upvotes}
                                </button>
                                <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-amber transition-colors">
                                  <Reply className="h-3 w-3" />
                                  {t("reply_button")}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Reply Input */}
                      <div className="flex gap-3 mt-4 pt-4 border-t border-brand-border/50">
                        <Avatar className="h-8 w-8 shrink-0 hidden sm:block">
                          <AvatarImage src="https://i.pravatar.cc/150?u=me" />
                          <AvatarFallback>ME</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea 
                            placeholder={t("reply_placeholder")} 
                            className="min-h-[80px] text-sm bg-slate-50 dark:bg-black/20 border-brand-border resize-y mb-2"
                          />
                          <div className="flex justify-end">
                            <Button size="sm" className="bg-brand-amber text-black hover:bg-brand-amber/90 h-8">
                              {t("reply_button")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Search and New Post button stack or stretch. Avatar hidden on small screens to save space.
// tablet  (md / lg):       Search bar and button in one row. Avatars displayed.
// desktop (xl / 2xl):      Max-width container, clean spacing. Interactive hover states for expand/collapse.
// Interaction:             Accordion-like thread expansion using Framer Motion. Smooth form appear/disappear.
