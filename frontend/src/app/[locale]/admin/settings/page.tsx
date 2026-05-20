import { Metadata } from "next"
import { SettingsForm } from "@/features/admin/presentation/components/settings-management/settings-form"
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb"
import { Settings } from "lucide-react"

export const metadata: Metadata = {
  title: "System Settings | Admin Dashboard",
  description: "Manage platform-wide configurations and system status.",
}

export default function AdminSettingsPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1 text-primary">
                <Settings className="w-4 h-4" />
                Settings
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-5xl">
        <SettingsForm />
      </div>
    </div>
  )
}
