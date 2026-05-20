import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { InstructorHeader } from "@/features/instructor/presentation/components/instructor-header"
import { InstructorSidebar } from "@/features/instructor/presentation/components/instructor-sidebar"

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background/95">
        <InstructorSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-transparent">
          <InstructorHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
