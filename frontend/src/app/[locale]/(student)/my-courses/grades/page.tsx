import { GradesView } from "@/features/student/presentation/components/grades-view";

export default function GradesPage() {
  return (
    <div className="container max-w-7xl px-4 py-8 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-sora text-slate-900 dark:text-white">My Grades</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Track your performance across all enrolled courses.</p>
      </div>
      <GradesView />
    </div>
  );
}
