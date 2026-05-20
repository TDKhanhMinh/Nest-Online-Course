"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Category } from "@/features/category/domain/category.types"
import { useAllCategories, useCategoryMutations } from "@/features/category/presentation/hooks/use-categories"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  parentId: z.string().nullable().optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryDialogProps {
  category?: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryDialog({ category, open, onOpenChange }: CategoryDialogProps) {
  const isEdit = !!category
  const { createCategory, updateCategory, isPending } = useCategoryMutations()

  const { data: categories } = useAllCategories()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      parentId: null,
    },
  })

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        parentId: category.parentId || null,
      })
    } else {
      form.reset({
        name: "",
        slug: "",
        parentId: null,
      })
    }
  }, [category, form, open])

  const onSubmit = async (values: CategoryFormValues) => {
    const data = {
      ...values,
      parentId: values.parentId === "none" ? null : values.parentId
    }

    if (isEdit && category) {
      await updateCategory.mutateAsync({ id: category.id, data })
    } else {
      await createCategory.mutateAsync(data)
    }
    onOpenChange(false)
  }

  // Auto-generate slug from name if not edit
  const nameValue = form.watch("name")
  useEffect(() => {
    if (!isEdit && nameValue) {
      const slug = nameValue
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "")
      form.setValue("slug", slug)
    }
  }, [nameValue, isEdit, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass border-white/20">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details of this category."
              : "Create a new category to organize your courses."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Web Development" {...field} className="bg-white/5 border-white/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. web-development" {...field} className="bg-white/5 border-white/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? "none"}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select a parent category (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="glass border-white/20">
                      <SelectItem value="none">None (Root)</SelectItem>
                      {categories?.filter(c => c.id !== category?.id).map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
