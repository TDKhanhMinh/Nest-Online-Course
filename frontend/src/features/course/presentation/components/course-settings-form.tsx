"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, Loader2, Save } from "lucide-react";
import { useEffect, useRef, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAllCategories } from "@/features/category/presentation/hooks/use-categories";
import { Course, CourseLevel } from "../../domain/course.types";
import { useUploadCourseThumbnail } from "../hooks/use-course-upload";
import { useUpdateCourse } from "../hooks/use-course-mutations";

const courseSettingsSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  // shortDescription: z.string().min(10, "Short description must be at least 10 characters").max(200),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce
    .number({
      message: "Price must be a number",
    })
    .min(0),

  level: z.nativeEnum(CourseLevel),
  categoryId: z.string().min(1, "Please select a category"),
  language: z.string().min(1, "Please enter course language"),
  thumbnailUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type CourseSettingsInput = z.input<typeof courseSettingsSchema>;
type CourseSettingsValues = z.output<typeof courseSettingsSchema>;

interface CourseSettingsFormProps {
  course: Course;
}

export function CourseSettingsForm({ course }: CourseSettingsFormProps) {
  const { mutate: updateCourse, isPending } = useUpdateCourse();
  const uploadThumbnailMutation = useUploadCourseThumbnail();
  const { data: categories, isLoading: isLoadingCategories } =
    useAllCategories();
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CourseSettingsInput, unknown, CourseSettingsValues>({
    resolver: zodResolver(courseSettingsSchema),
    defaultValues: {
      title: course.title,
      // shortDescription: course.shortDescription || "",
      description: course.description || "",
      price: course.price,
      level: course.level,
      categoryId: course.categoryId,
      language: course.language || "Vietnamese",
      thumbnailUrl: course.thumbnailUrl || "",
    },
  });
  // Update form when course data changes
  useEffect(() => {
    form.reset({
      title: course.title,
      // shortDescription: course.shortDescription || "",
      description: course.description || "",
      price: course.price,
      level: course.level,
      categoryId: course.categoryId,
      language: course.language || "Vietnamese",
      thumbnailUrl: course.thumbnailUrl || "",
    });
  }, [course, form]);

  const handleThumbnailFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    try {
      const uploadedUrl = await uploadThumbnailMutation.mutateAsync(file);
      form.setValue("thumbnailUrl", uploadedUrl, {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("Thumbnail uploaded successfully!");
    } finally {
      event.target.value = "";
    }
  };

  function onSubmit(values: CourseSettingsValues) {
    updateCourse({
      id: course.id,
      data: values,
    });
  }

  const thumbnailUrl = useWatch({
    control: form.control,
    name: "thumbnailUrl",
  });
  const isUploadingThumbnail = uploadThumbnailMutation.isPending;
  const isSubmitting = isPending || isUploadingThumbnail;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Master React in 30 Days"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your course public name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control as any}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Catchy summary for search results" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What will students learn?"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={
                          typeof field.value === "number" ||
                          typeof field.value === "string"
                            ? field.value
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(CourseLevel).map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingCategories}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingCategories
                                ? "Loading..."
                                : "Select category"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Vietnamese, English"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail URL</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploadingThumbnail}
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="shrink-0 gap-2"
                    >
                      {isUploadingThumbnail ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ImageUp className="h-4 w-4" />
                      )}
                      {isUploadingThumbnail ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploadingThumbnail}
              onChange={handleThumbnailFileChange}
            />

            <div className="p-4 rounded-xl border-2 border-dashed bg-muted/30 flex flex-col items-center justify-center gap-4 min-h-[200px]">
              {thumbnailUrl ? (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                  <img
                    src={thumbnailUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/600x400?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <Save className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Thumbnail Preview
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            <Save size={18} />
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
