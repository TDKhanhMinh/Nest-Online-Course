"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryDialog } from "@/features/admin/presentation/components/category-management/category-dialog"
import { CategoryTable } from "@/features/admin/presentation/components/category-management/category-table"
import { Category } from "@/features/category/domain/category.types"
import { useAllCategories } from "@/features/category/presentation/hooks/use-categories"
import { Layers, Plus, RefreshCw, Search } from "lucide-react"
import { useState } from "react"

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const { data: categories, isLoading, refetch, isRefetching } = useAllCategories()

  const filteredCategories = categories?.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  ) || []

  const handleAdd = () => {
    setSelectedCategory(null)
    setDialogOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground mt-1">Manage and organize your course categories.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="border-white/10 hover:bg-white/5"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex items-center relative max-w-md w-full group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 focus-visible:ring-primary/20 focus-visible:bg-white/10 transition-all"
        />
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl bg-white/5" />
          ))}
        </div>
      ) : (
        <CategoryTable
          categories={filteredCategories}
          onEdit={handleEdit}
        />
      )}

      {/* Dialogs */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
      />
    </div>
  )
}
